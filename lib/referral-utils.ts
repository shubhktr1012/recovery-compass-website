export const REFERRAL_STORAGE_KEY = "rc_referral_code";

export function normalizeReferralCode(value: unknown) {
  return typeof value === "string"
    ? value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 32)
    : "";
}

export function calculateReferralDiscount(amountInPaise: number, discountPct: number) {
  if (!Number.isInteger(amountInPaise) || amountInPaise <= 0) return 0;
  if (!Number.isFinite(discountPct) || discountPct <= 0 || discountPct > 100) return 0;
  return Math.round((amountInPaise * discountPct) / 100);
}

export function suggestReferralCode(name: string) {
  return normalizeReferralCode(name).slice(0, 16);
}
