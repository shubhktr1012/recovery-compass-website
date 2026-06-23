import { describe, expect, it } from "vitest";
import { calculateReferralDiscount, normalizeReferralCode } from "@/lib/referral-utils";
import { readReferralSnapshot } from "@/lib/referrals";

describe("referral helpers", () => {
  it("normalizes partner codes consistently", () => {
    expect(normalizeReferralCode(" anjan-10 ")).toBe("ANJAN10");
  });

  it("calculates the exact percentage in paise", () => {
    expect(calculateReferralDiscount(599900, 10)).toBe(59990);
    expect(calculateReferralDiscount(0, 10)).toBe(0);
  });

  it("only accepts complete transaction referral snapshots", () => {
    expect(readReferralSnapshot({ referral: { code: "ANJAN10" } })).toBeNull();
    expect(readReferralSnapshot({
      referral: {
        partnerId: "partner-1", partnerName: "Anjan", code: "ANJAN10",
        discountPct: 10, commissionPct: 10, originalAmountPaise: 599900,
        discountAmountPaise: 59990, finalAmountPaise: 539910,
      },
    })).toEqual(expect.objectContaining({ code: "ANJAN10", discountAmountPaise: 59990 }));
  });
});
