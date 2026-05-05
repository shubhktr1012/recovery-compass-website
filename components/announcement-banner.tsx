import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AnnouncementBanner() {
  return (
    <div className="bg-[oklch(0.2475_0.0661_146.79)] text-white px-4 py-2 text-sm text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 font-satoshi font-medium">
        <span className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 814 1000" className="w-3.5 h-3.5 fill-current shrink-0" aria-hidden="true">
            <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 268.5-317.3 71 0 130.1 46.4 175 46.4 42.3 0 109.1-49.1 185.6-49.1 29.8 0 108.2 2.6 168.4 79.3zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
          </svg>
          <span className="opacity-90">Introducing the Recovery Compass iOS App</span>
        </span>
        <a 
          href="https://apps.apple.com/in/app/recovery-compass-wellness/id6761656102"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1 font-bold tracking-tight hover:text-white/80 transition-colors"
        >
          Download Now
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
}
