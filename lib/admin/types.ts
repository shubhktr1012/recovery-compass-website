export type AdminRole = "owner" | "ops" | "viewer";

export type AdminSession = {
  userId: string;
  email: string;
  role: AdminRole;
  source: "admin_users" | "env_allowlist";
};

export type AdminAccessResult =
  | { ok: true; admin: AdminSession }
  | {
      ok: false;
      status: 401 | 403 | 404;
      reason: "unauthenticated" | "not_admin" | "wrong_host";
      message: string;
    };

export type AdminDateRangeKey = "today" | "7d" | "14d" | "30d";

export type AdminDateRange = {
  key: AdminDateRangeKey;
  label: string;
  days: number;
  start: Date;
  end: Date;
  startIso: string;
  endIso: string;
};

export type AdminSearchParams = Record<string, string | string[] | undefined>;

export type AdminKpi = {
  label: string;
  value: string;
  detail?: string;
  technical?: string;
};

export type AdminTrendPoint = {
  date: string;
  label: string;
  signups?: number;
  purchases?: number;
  dayCompletions?: number;
  events?: number;
  revenue?: number;
};

export type AdminTableColumn = {
  key: string;
  label: string;
};

export type AdminActivityItem = {
  id: string;
  label: string;
  detail: string;
  occurredAt: string;
  eventType: string;
  userId: string | null;
  programSlug: string | null;
};
