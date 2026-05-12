import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { PROGRAM_LABELS, type ProgramSlug, isProgramSlug } from "@/lib/program-access";

type ProgramGrantRequest = {
  adminSecret?: string;
  email?: string;
  programSlug?: string;
};

function unauthorized() {
  return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
}

export async function POST(request: Request) {
  const expectedSecret = process.env.PROGRAM_GRANTS_ADMIN_SECRET;

  try {
    const body = (await request.json()) as ProgramGrantRequest;
    const adminSecret = body.adminSecret?.trim();
    const email = body.email?.trim().toLowerCase();
    const rawProgramSlug = body.programSlug?.trim();

    if (!expectedSecret || adminSecret !== expectedSecret) {
      return unauthorized();
    }

    if (!email || !rawProgramSlug) {
      return NextResponse.json(
        { success: false, error: "email and programSlug are required" },
        { status: 400 }
      );
    }

    if (!isProgramSlug(rawProgramSlug)) {
      return NextResponse.json({ success: false, error: "Invalid program slug" }, { status: 400 });
    }

    const programSlug: ProgramSlug = rawProgramSlug;

    const { data: profiles, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, email, display_name")
      .ilike("email", email)
      .limit(2);

    if (profileError) {
      console.error("[Program Grants] Failed to look up profile by email:", profileError);
      return NextResponse.json({ success: false, error: profileError.message }, { status: 500 });
    }

    if (!profiles || profiles.length === 0) {
      return NextResponse.json(
        { success: false, error: "No user found for that email address" },
        { status: 404 }
      );
    }

    if (profiles.length > 1) {
      return NextResponse.json(
        { success: false, error: "Multiple users matched that email address" },
        { status: 409 }
      );
    }

    const profile = profiles[0];

    const { data: existingAccess, error: accessLookupError } = await supabaseAdmin
      .from("program_access")
      .select("completion_state, current_day, started_at")
      .eq("user_id", profile.id)
      .eq("owned_program", programSlug)
      .maybeSingle();

    if (accessLookupError) {
      console.error("[Program Grants] Failed to read existing program access row:", accessLookupError);
      return NextResponse.json({ success: false, error: accessLookupError.message }, { status: 500 });
    }

    const nowIso = new Date().toISOString();
    const { error: grantError } = await supabaseAdmin.from("program_access").upsert(
      {
        user_id: profile.id,
        owned_program: programSlug,
        purchase_state: "owned_active",
        completion_state: existingAccess?.completion_state ?? "not_started",
        current_day:
          typeof existingAccess?.current_day === "number" && existingAccess.current_day > 0
            ? existingAccess.current_day
            : 1,
        started_at: existingAccess?.started_at ?? nowIso,
        archived_at: null,
        updated_at: nowIso,
      },
      { onConflict: "user_id, owned_program" }
    );

    if (grantError) {
      console.error("[Program Grants] Failed to upsert program access:", grantError);
      return NextResponse.json({ success: false, error: grantError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      granted: {
        userId: profile.id,
        email: profile.email,
        displayName: profile.display_name,
        programSlug,
        programLabel: PROGRAM_LABELS[programSlug],
      },
    });
  } catch (error) {
    console.error("[Program Grants] Route failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown program grant route error",
      },
      { status: 500 }
    );
  }
}
