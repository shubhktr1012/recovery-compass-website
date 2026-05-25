"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Apple,
  BarChart3,
  CreditCard,
  Home,
  LayoutDashboard,
  ListChecks,
  Users,
} from "lucide-react";
import type { AdminSession } from "@/lib/admin/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AdminSignOutButton } from "@/components/admin/AdminSignOutButton";

const navItems = [
  { href: "/overview", label: "Home", icon: Home },
  { href: "/users", label: "Users", icon: Users },
  { href: "/programs", label: "Programs", icon: ListChecks },
  { href: "/purchases", label: "Purchases", icon: CreditCard },
  { href: "/diet-plans", label: "Diet Plans", icon: Apple },
  { href: "/engagement", label: "Engagement", icon: BarChart3 },
  { href: "/activity", label: "Admin Activity", icon: Activity },
];

export function AdminShell({
  admin,
  children,
}: {
  admin: AdminSession;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#06190d] text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(139,211,255,0.14),transparent_32%),radial-gradient(circle_at_78%_18%,rgba(247,198,106,0.12),transparent_26%),radial-gradient(circle_at_62%_82%,rgba(199,183,255,0.1),transparent_30%),linear-gradient(135deg,#06190d,#092113_45%,#061016)]" />
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-black/15 px-5 py-6 backdrop-blur-xl lg:block">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-white text-[#073512]">
            <LayoutDashboard className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">Recovery Compass</p>
            <p className="text-xs text-white/45">Admin dashboard</p>
          </div>
        </Link>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/overview" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                  isActive
                    ? "bg-sky-100 text-[#082035] shadow-lg shadow-black/10"
                    : "text-white/62 hover:bg-white/[0.07] hover:text-white"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute inset-x-5 bottom-6 rounded-3xl border border-white/10 bg-white/[0.05] p-4">
          <p className="text-xs text-white/45">Signed in as</p>
          <p className="mt-1 truncate text-sm font-medium">{admin.email}</p>
          <Badge className="mt-3 bg-white/10 text-white hover:bg-white/10">
            {admin.role}
          </Badge>
          <AdminSignOutButton className="mt-3 w-full" />
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#06190d]/82 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/40">
                Internal operations
              </p>
              <p className="mt-1 text-lg font-semibold">Admin dashboard</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 md:flex">
                <Badge className="bg-white/10 text-white hover:bg-white/10">
                  {admin.source.replace("_", " ")}
                </Badge>
                <Badge className="bg-sky-300/15 text-sky-100 hover:bg-sky-300/15">
                  Read-only V1
                </Badge>
              </div>
              <AdminSignOutButton className="px-3" showLabel={false} />
            </div>
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-2 text-xs font-medium",
                    isActive ? "bg-sky-100 text-[#082035]" : "bg-white/[0.07] text-white/65"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
