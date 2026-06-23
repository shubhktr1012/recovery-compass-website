"use client";

import { useEffect } from "react";
import { normalizeReferralCode, REFERRAL_STORAGE_KEY } from "@/lib/referral-utils";

export function ReferralAttribution() {
  useEffect(() => {
    const code = normalizeReferralCode(new URL(window.location.href).searchParams.get("ref"));
    if (code.length >= 3) {
      sessionStorage.setItem(REFERRAL_STORAGE_KEY, code);
    }
  }, []);

  return null;
}
