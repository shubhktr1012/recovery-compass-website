import { supabaseAdmin } from "@/lib/supabase-admin";
import type { AdminSession } from "@/lib/admin/types";

type RecordAdminAuditInput = {
  action: string;
  admin: AdminSession;
  evidence?: string | null;
  metadata?: Record<string, unknown>;
  reason?: string | null;
  targetEmail?: string | null;
  targetProgram?: string | null;
  targetUserId?: string | null;
};

export async function recordAdminAuditLog({
  action,
  admin,
  evidence = null,
  metadata = {},
  reason = null,
  targetEmail = null,
  targetProgram = null,
  targetUserId = null,
}: RecordAdminAuditInput) {
  const { error } = await supabaseAdmin.from("admin_audit_logs").insert({
    action,
    admin_email: admin.email,
    admin_role: admin.role,
    admin_user_id: admin.userId,
    evidence,
    metadata,
    reason,
    target_email: targetEmail,
    target_program: targetProgram,
    target_user_id: targetUserId,
  });

  if (error) {
    console.warn("[admin] Failed to write audit log", {
      action,
      error: error.message,
      targetUserId,
    });
  }
}
