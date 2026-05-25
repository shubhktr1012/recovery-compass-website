import { NextResponse, type NextRequest } from "next/server";
import { requireAdminApi, adminApiError } from "@/lib/admin/api";
import { canGrantPrograms } from "@/lib/admin/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { PROGRAM_LABELS, isProgramSlug } from "@/lib/program-access";

type ProgramGrantRequest = {
  email?: string;
  evidence?: string;
  programSlug?: string;
  reason?: string;
  userId?: string;
};

type ProfileMatch = {
  email: string | null;
  id: string;
};

type ProgramGrantRow = {
  already_owned: boolean;
  completion_state: string;
  current_day: number | null;
  owned_program: string;
  priority_rank: number | null;
  program_state: string;
  purchase_state: string;
  target_email: string | null;
  updated_at: string;
  user_id: string;
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

async function resolveTargetUser(body: ProgramGrantRequest) {
  const userId = normalizeText(body.userId);
  const email = normalizeText(body.email).toLowerCase();

  if (userId) {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id,email")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data as ProfileMatch | null;
  }

  if (!email) {
    return null;
  }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id,email")
    .ilike("email", email)
    .limit(2);

  if (error) {
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    return null;
  }

  if (data.length > 1) {
    throw new Error("Multiple users matched that email address");
  }

  return data[0] as ProfileMatch;
}

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const auth = await requireAdminApi(request);
  if ("response" in auth) {
    return auth.response;
  }

  if (!canGrantPrograms(auth.admin)) {
    return NextResponse.json(
      { message: "Only owner and ops admins can grant programs." },
      { status: 403 }
    );
  }

  try {
    const body = (await request.json()) as ProgramGrantRequest;
    const rawProgramSlug = normalizeText(body.programSlug);
    const reason = normalizeText(body.reason);
    const evidence = normalizeText(body.evidence);

    if (!isProgramSlug(rawProgramSlug)) {
      return NextResponse.json({ message: "Invalid program slug." }, { status: 400 });
    }

    if (reason.length < 3 || evidence.length < 3) {
      return NextResponse.json(
        { message: "Reason and evidence are required." },
        { status: 400 }
      );
    }

    const profile = await resolveTargetUser(body);
    if (!profile) {
      return NextResponse.json({ message: "No user found." }, { status: 404 });
    }

    const { data, error } = await supabaseAdmin.rpc("admin_grant_program_access", {
      p_admin_email: auth.admin.email,
      p_admin_role: auth.admin.role,
      p_admin_user_id: auth.admin.userId,
      p_evidence: evidence,
      p_metadata: {
        source: "admin_dashboard",
      },
      p_program_id: rawProgramSlug,
      p_reason: reason,
      p_target_user_id: profile.id,
    });

    if (error) {
      throw new Error(error.message);
    }

    const grant = Array.isArray(data) ? (data[0] as ProgramGrantRow | undefined) : null;
    if (!grant) {
      throw new Error("Grant did not return a program access row.");
    }
    const programLabel =
      PROGRAM_LABELS[grant.owned_program as keyof typeof PROGRAM_LABELS] ??
      grant.owned_program.replaceAll("_", " ");

    return NextResponse.json({
      grant: {
        alreadyOwned: grant.already_owned,
        completionState: grant.completion_state,
        currentDay: grant.current_day,
        email: grant.target_email,
        priorityRank: grant.priority_rank,
        programLabel,
        programSlug: grant.owned_program,
        programState: grant.program_state,
        purchaseState: grant.purchase_state,
        updatedAt: grant.updated_at,
        userId: grant.user_id,
      },
      success: true,
    });
  } catch (error) {
    return adminApiError(error);
  }
}
