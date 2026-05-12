"use client";

import { useSyncExternalStore } from "react";
import { detectDownloadPlatform, type DownloadPlatform } from "@/lib/constants";

function subscribe() {
    return () => {};
}

function getClientSnapshot(): DownloadPlatform {
    return detectDownloadPlatform(navigator.userAgent || "");
}

function getServerSnapshot(): DownloadPlatform {
    return "desktop";
}

export function useDownloadPlatform() {
    return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
