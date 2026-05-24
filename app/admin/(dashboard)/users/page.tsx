import { Search } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resolveSearchParams } from "@/lib/admin/date-range";
import { searchAdminUsers } from "@/lib/admin/data";
import { formatDateTime } from "@/lib/admin/format";
import type { AdminSearchParams } from "@/lib/admin/types";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: Promise<AdminSearchParams>;
}) {
  const params = await resolveSearchParams(searchParams);
  const query = Array.isArray(params.q) ? params.q[0] ?? "" : params.q ?? "";
  const users = await searchAdminUsers(query);

  return (
    <div className="space-y-6">
      <PageHeader
        description="Search users by email, display name, or UUID. List views intentionally mask email addresses."
        title="Users"
        withDateRange={false}
      />
      <form className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.05] p-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/35" />
          <Input
            className="h-12 rounded-2xl border-white/10 bg-white/[0.08] pl-10 text-white placeholder:text-white/35"
            defaultValue={query}
            name="q"
            placeholder="Search by email, name, or user ID"
          />
        </div>
        <Button className="h-12 rounded-2xl bg-white px-6 text-[#073512] hover:bg-white/90">
          Search
        </Button>
      </form>
      <DataTable
        columns={[
          { key: "displayName", label: "User" },
          { key: "email", label: "Email" },
          { key: "programCount", label: "Programs" },
          { key: "recommendedProgram", label: "Recommendation" },
          { key: "onboardingComplete", label: "Onboarded" },
          { key: "lastSeen", label: "Updated" },
        ]}
        data={users.map((user) => ({
          ...user,
          href: `/admin/users/${user.id}`,
          lastSeen: formatDateTime(user.lastSeen),
        }))}
        emptyDescription="No users matched that search."
        linkColumn={{ hrefKey: "href", key: "displayName" }}
      />
    </div>
  );
}
