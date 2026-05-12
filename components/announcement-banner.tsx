"use client";

import { ArrowRight } from "lucide-react";
import { getDownloadHref, isExternalDownloadPlatform } from "@/lib/constants";
import { useDownloadPlatform } from "@/lib/use-download-platform";

export function AnnouncementBanner() {
  const platform = useDownloadPlatform();
  const downloadHref = getDownloadHref(platform);
  const isExternalLink = isExternalDownloadPlatform(platform);

  return (
    <div className="bg-[oklch(0.2475_0.0661_146.79)] text-white px-4 py-2 text-sm text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 font-satoshi font-medium">
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="opacity-90">Recovery Compass App — Now on iOS & Android</span>
        </span>
        <a 
          href={downloadHref}
          {...(isExternalLink ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="group inline-flex items-center gap-1 font-bold tracking-tight hover:text-white/80 transition-colors"
        >
          Download Now
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
}
