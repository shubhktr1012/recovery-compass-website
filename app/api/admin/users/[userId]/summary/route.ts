import { NextResponse, type NextRequest } from "next/server";
import { requireAdminApi } from "@/lib/admin/api";
import { recordAdminAuditLog } from "@/lib/admin/audit";
import {
  ADMIN_USER_SUMMARY_CONTEXT_VERSION,
  buildAdminUserSummaryContext,
  buildUserSummaryPromptContext,
} from "@/lib/admin/user-summary-context";
import {
  generateAdminUserSummary,
  formatAdminUserSummaryError,
  resolveAdminUserSummaryModel,
} from "@/lib/admin/user-summary-generation";
import { formatAdminUserSummaryPlainText } from "@/lib/admin/user-summary-schema";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const REGENERATE_COOLDOWN_MS = 30_000;

type GeneratedSummaryResult =
  | NextResponse
  | {
      cached: false;
      context: Record<string, unknown>;
      contextVersion: number;
      generatedAt: string;
      generatedByAdminEmail: string;
      model: string;
      plainText: string;
      summary: Record<string, unknown>;
    }
  | ReturnType<typeof serializeCachedSummary>;

const inFlightGenerations = new Map<string, Promise<GeneratedSummaryResult>>();

type CachedSummaryRow = {
  context_version: number;
  generated_at: string;
  generated_by_admin_email: string;
  model: string;
  summary: Record<string, unknown>;
  updated_at: string;
  user_id: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

async function readCachedSummary(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("admin_user_ai_summaries")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to read cached user summary: ${error.message}`);
  }

  return data as CachedSummaryRow | null;
}

function serializeCachedSummary(row: CachedSummaryRow) {
  return {
    cached: true as const,
    contextVersion: row.context_version,
    generatedAt: row.generated_at,
    generatedByAdminEmail: row.generated_by_admin_email,
    model: row.model,
    plainText: isRecord(row.summary)
      ? formatAdminUserSummaryPlainText(row.summary as never)
      : "",
    summary: row.summary,
    updatedAt: row.updated_at,
  };
}

async function generateAndPersistSummary(args: {
  adminEmail: string;
  force: boolean;
  role: "owner" | "ops" | "viewer";
  userId: string;
}) {
  const existing = await readCachedSummary(args.userId);

  if (
    existing &&
    !args.force &&
    existing.context_version === ADMIN_USER_SUMMARY_CONTEXT_VERSION
  ) {
    return serializeCachedSummary(existing);
  }

  const inFlight = inFlightGenerations.get(args.userId);
  if (inFlight) {
    return inFlight;
  }

  const work = generateAndPersistSummaryWork(args, existing);
  inFlightGenerations.set(args.userId, work);

  try {
    return await work;
  } finally {
    inFlightGenerations.delete(args.userId);
  }
}

async function generateAndPersistSummaryWork(
  args: {
    adminEmail: string;
    force: boolean;
    role: "owner" | "ops" | "viewer";
    userId: string;
  },
  existing: CachedSummaryRow | null
) {
  if (
    args.force &&
    existing?.generated_at &&
    Date.now() - Date.parse(existing.generated_at) < REGENERATE_COOLDOWN_MS
  ) {
    return NextResponse.json(
      {
        message: "Please wait a few seconds before regenerating again.",
      },
      { status: 429 }
    );
  }

  const context = await buildAdminUserSummaryContext(args.userId, args.role);
  if (!context) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const { model, summary } = await generateAdminUserSummary(context);
  const generatedAt = new Date().toISOString();
  const promptContext = buildUserSummaryPromptContext(context);

  const { error: upsertError } = await supabaseAdmin.from("admin_user_ai_summaries").upsert(
    {
      context_version: ADMIN_USER_SUMMARY_CONTEXT_VERSION,
      generated_at: generatedAt,
      generated_by_admin_email: args.adminEmail,
      model,
      summary,
      updated_at: generatedAt,
      user_id: args.userId,
    },
    { onConflict: "user_id" }
  );

  if (upsertError) {
    throw new Error(`Failed to cache user summary: ${upsertError.message}`);
  }

  return {
    cached: false as const,
    context: promptContext,
    contextVersion: ADMIN_USER_SUMMARY_CONTEXT_VERSION,
    generatedAt,
    generatedByAdminEmail: args.adminEmail,
    model,
    plainText: formatAdminUserSummaryPlainText(summary),
    summary,
  };
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const auth = await requireAdminApi(request);
  if ("response" in auth) {
    return auth.response;
  }

  try {
    const { userId } = await context.params;
    const cached = await readCachedSummary(userId);

    if (!cached) {
      return NextResponse.json({ summary: null });
    }

    if (cached.context_version !== ADMIN_USER_SUMMARY_CONTEXT_VERSION) {
      return NextResponse.json({
        stale: true,
        summary: serializeCachedSummary(cached),
      });
    }

    await recordAdminAuditLog({
      action: "user_ai_summary_viewed",
      admin: auth.admin,
      metadata: { cached: true, source: "admin_api" },
      targetUserId: userId,
    });

    return NextResponse.json({ summary: serializeCachedSummary(cached) });
  } catch (error) {
    return NextResponse.json(
      { message: formatAdminUserSummaryError(error) },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const auth = await requireAdminApi(request);
  if ("response" in auth) {
    return auth.response;
  }

  try {
    const { userId } = await context.params;
    let force = false;

    try {
      const body = await request.json();
      force = Boolean(body?.force);
    } catch {
      force = false;
    }

    const result = await generateAndPersistSummary({
      adminEmail: auth.admin.email,
      force,
      role: auth.admin.role,
      userId,
    });

    if (result instanceof NextResponse) {
      return result;
    }

    await recordAdminAuditLog({
      action: "user_ai_summary_generated",
      admin: auth.admin,
      metadata: {
        cached: result.cached,
        force,
        model: result.model ?? resolveAdminUserSummaryModel(),
        source: "admin_api",
      },
      targetUserId: userId,
    });

    return NextResponse.json({ summary: result });
  } catch (error) {
    return NextResponse.json(
      { message: formatAdminUserSummaryError(error) },
      { status: 500 }
    );
  }
}
