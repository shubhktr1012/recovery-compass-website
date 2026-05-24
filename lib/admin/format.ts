import { publicPrograms } from "@/lib/public-programs";

const programNameBySlug = new Map<string, string>(
  publicPrograms.map((program) => [program.dbSlug, program.title])
);

const eventLabels: Record<string, string> = {
  audio_played: "Played audio",
  card_completed: "Completed a card",
  card_opened: "Opened a card",
  card_skipped: "Skipped a card",
  day_completed: "Completed a day",
  day_saved_partial: "Saved partial progress",
  notification_tap: "Opened from notification",
  premium_route_blocked: "Hit paid access guard",
  program_completed: "Completed a program",
  program_paused: "Program paused",
  program_resumed: "Program resumed",
  program_started: "Started a program",
  session_opened: "Opened the app",
};

const inrFormatter = new Intl.NumberFormat("en-IN", {
  currency: "INR",
  maximumFractionDigits: 0,
  style: "currency",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

export function maskEmail(email: string | null | undefined) {
  if (!email) {
    return "No email";
  }

  const [name, domain] = email.split("@");
  if (!domain) {
    return "Hidden email";
  }

  const visibleName = name.length <= 2 ? name[0] ?? "*" : name.slice(0, 2);
  const [domainName, ...domainParts] = domain.split(".");
  const visibleDomain = domainName ? domainName[0] : "*";
  const suffix = domainParts.length > 0 ? `.${domainParts.join(".")}` : "";

  return `${visibleName}***@${visibleDomain}***${suffix}`;
}

export function formatProgramName(slug: string | null | undefined) {
  if (!slug) {
    return "Unknown program";
  }

  return programNameBySlug.get(slug) ?? slug.replaceAll("_", " ");
}

export function formatEventTypeLabel(eventType: string | null | undefined) {
  if (!eventType) {
    return "Unknown activity";
  }

  return eventLabels[eventType] ?? eventType.replaceAll("_", " ");
}

export function formatInrFromPaise(amountPaise: number | null | undefined) {
  return inrFormatter.format((amountPaise ?? 0) / 100);
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return dateTimeFormatter.format(date).replace(/\b(am|pm)\b/gi, (match) =>
    match.toUpperCase()
  );
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}
