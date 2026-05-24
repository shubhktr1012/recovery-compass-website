import type {
  AdminDateRange,
  AdminDateRangeKey,
  AdminSearchParams,
} from "@/lib/admin/types";

export const ADMIN_DATE_RANGE_OPTIONS: Array<{
  key: AdminDateRangeKey;
  label: string;
  days: number;
}> = [
  { key: "today", label: "Today", days: 1 },
  { key: "7d", label: "Last 7 days", days: 7 },
  { key: "14d", label: "Last 14 days", days: 14 },
  { key: "30d", label: "Last 30 days", days: 30 },
];

const optionsByKey = new Map(
  ADMIN_DATE_RANGE_OPTIONS.map((option) => [option.key, option])
);

function getFirstParam(
  params: URLSearchParams | AdminSearchParams | undefined,
  key: string
) {
  if (!params) {
    return undefined;
  }

  if (params instanceof URLSearchParams) {
    return params.get(key) ?? undefined;
  }

  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export function getAdminDateRange(
  params?: URLSearchParams | AdminSearchParams,
  now = new Date()
): AdminDateRange {
  const rawKey = getFirstParam(params, "range");
  const key = optionsByKey.has(rawKey as AdminDateRangeKey)
    ? (rawKey as AdminDateRangeKey)
    : "7d";
  const option = optionsByKey.get(key) ?? ADMIN_DATE_RANGE_OPTIONS[1];
  const end = new Date(now);
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  if (option.days > 1) {
    start.setDate(start.getDate() - (option.days - 1));
  }

  return {
    key,
    label: option.label,
    days: option.days,
    start,
    end,
    startIso: start.toISOString(),
    endIso: end.toISOString(),
  };
}

export async function resolveSearchParams(
  searchParams:
    | AdminSearchParams
    | Promise<AdminSearchParams>
    | undefined
): Promise<AdminSearchParams> {
  if (!searchParams) {
    return {};
  }

  return await searchParams;
}

export function getDayKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Kolkata",
    year: "numeric",
  }).format(date);
}

export function getShortDayLabel(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

export function buildDailyBuckets(range: AdminDateRange) {
  const buckets = new Map<string, { date: string; label: string }>();

  for (let index = range.days - 1; index >= 0; index -= 1) {
    const date = new Date(range.end);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - index);
    buckets.set(getDayKey(date), {
      date: getDayKey(date),
      label: getShortDayLabel(date),
    });
  }

  return buckets;
}
