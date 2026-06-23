import { PageHeader } from "@/components/admin/PageHeader";
import { ReferralOpsPanel } from "@/components/admin/ReferralOpsPanel";
import { canManageReferrals, getAdminAccess } from "@/lib/admin/auth";
import { getAdminReferralDashboard } from "@/lib/admin/referrals";

export const dynamic = "force-dynamic";

export default async function AdminReferralsPage() {
  const access = await getAdminAccess();
  const canManage = access.ok ? canManageReferrals(access.admin) : false;
  const data = await getAdminReferralDashboard();

  return (
    <div className="space-y-6">
      <PageHeader
        description="Create partner codes, track successful referred purchases, and record commission payouts."
        title="Referrals"
        withDateRange={false}
      />
      <ReferralOpsPanel canManage={canManage} initialData={data} />
    </div>
  );
}
