"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopySupportButton({
  audit,
  text,
  label = "Copy",
}: {
  audit?: {
    action: string;
    metadata?: Record<string, unknown>;
    targetEmail?: string | null;
    targetProgram?: string | null;
    targetUserId?: string | null;
  };
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);

    if (audit) {
      void fetch("/api/admin/audit", {
        body: JSON.stringify(audit),
        headers: { "content-type": "application/json" },
        method: "POST",
      }).catch(() => {
        // Copying support details should not fail because audit logging is transiently unavailable.
      });
    }
  }

  return (
    <Button
      className="rounded-full border-white/10 bg-white/[0.08] text-white hover:bg-sky-300/15 hover:text-sky-50"
      onClick={handleCopy}
      type="button"
      variant="outline"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : label}
    </Button>
  );
}
