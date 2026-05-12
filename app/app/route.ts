import { NextResponse } from "next/server";
import {
    APP_STORE_URL,
    APP_DOWNLOAD_ANCHOR,
    PLAY_STORE_URL,
    detectDownloadPlatform,
} from "@/lib/constants";

export function GET(request: Request) {
    const platform = detectDownloadPlatform(request.headers.get("user-agent") ?? "");

    if (platform === "ios") {
        return NextResponse.redirect(APP_STORE_URL, 307);
    }

    if (platform === "android") {
        return NextResponse.redirect(PLAY_STORE_URL, 307);
    }

    const fallbackUrl = new URL("/", request.url);
    fallbackUrl.hash = APP_DOWNLOAD_ANCHOR.slice(1);

    return NextResponse.redirect(fallbackUrl, 307);
}
