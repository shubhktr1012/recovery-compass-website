"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export function ClarityInit() {
  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
    if (projectId && typeof window !== "undefined") {
      Clarity.init(projectId);
    } else if (!projectId) {
      console.warn("Clarity project ID is missing from environment variables.");
    }
  }, []);

  return null;
}
