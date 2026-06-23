const DEFAULT_STALE_GENERATION_MINUTES = 10;

function getStaleGenerationWindowMs() {
  const configuredMinutes = Number.parseInt(
    process.env.DIET_PLAN_STALE_GENERATION_MINUTES ?? "",
    10
  );
  const minutes =
    Number.isFinite(configuredMinutes) && configuredMinutes > 0
      ? configuredMinutes
      : DEFAULT_STALE_GENERATION_MINUTES;

  return minutes * 60 * 1000;
}

export function isDietPlanGenerationStale({
  claimedAt,
  now = Date.now(),
  status,
  updatedAt,
}: {
  claimedAt?: string | null;
  now?: number;
  status?: string | null;
  updatedAt?: string | null;
}) {
  if (status !== "generating") {
    return false;
  }

  const leaseTimestamp = claimedAt || updatedAt;
  if (!leaseTimestamp) {
    return true;
  }

  const leaseTime = Date.parse(leaseTimestamp);
  if (Number.isNaN(leaseTime)) {
    return true;
  }

  return now - leaseTime >= getStaleGenerationWindowMs();
}
