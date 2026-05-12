"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
    APP_DOWNLOAD_ANCHOR,
    APP_STORE_URL,
    PLAY_STORE_URL,
    detectDownloadPlatform,
} from "@/lib/constants";

const WEBSITE_DOWNLOAD_FALLBACK = `/${APP_DOWNLOAD_ANCHOR}`;

function getBrowserRedirectTarget() {
    const platform = detectDownloadPlatform(navigator.userAgent || "");

    if (platform === "ios") {
        return APP_STORE_URL;
    }

    if (platform === "android") {
        return PLAY_STORE_URL;
    }

    return WEBSITE_DOWNLOAD_FALLBACK;
}

export default function AppRedirectPage() {
    useEffect(() => {
        window.location.replace(getBrowserRedirectTarget());
    }, []);

    return (
        <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
            <div className="max-w-md text-center space-y-4">
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Recovery Compass</p>
                <h1 className="text-3xl font-erode">Opening the right app store…</h1>
                <p className="text-base text-muted-foreground">
                    If nothing happens, choose your platform below.
                </p>
                <div className="flex flex-col gap-3 pt-2">
                    <a
                        href={APP_STORE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-full bg-black text-white px-5 py-3"
                    >
                        Open App Store
                    </a>
                    <a
                        href={PLAY_STORE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-full bg-black text-white px-5 py-3"
                    >
                        Open Google Play
                    </a>
                    <Link
                        href={WEBSITE_DOWNLOAD_FALLBACK}
                        className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-3"
                    >
                        Open Website
                    </Link>
                </div>
            </div>
        </main>
    );
}
