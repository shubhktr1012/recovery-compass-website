export const APP_DOWNLOAD_ANCHOR = "#app-download";
export const APP_STORE_URL = "https://apps.apple.com/in/app/recovery-compass-wellness/id6761656102";
export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.recoverycompass.app&pcampaignid=web_share";
export const WEBSITE_URL = "https://recoverycompass.co";
export const SMART_APP_PATH = "/app";
export const SMART_APP_URL = `${WEBSITE_URL}${SMART_APP_PATH}`;

export const APP_STORE_BADGE_URL = "https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg";
export const PLAY_STORE_BADGE_URL = "https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png";

export type DownloadPlatform = "ios" | "android" | "desktop";

export function detectDownloadPlatform(userAgent: string): DownloadPlatform {
    if (/iPad|iPhone|iPod/.test(userAgent) || (/Macintosh/.test(userAgent) && /Mobile/.test(userAgent))) {
        return "ios";
    }

    if (/android/i.test(userAgent)) {
        return "android";
    }

    return "desktop";
}

export function getDownloadHref(platform: DownloadPlatform) {
    if (platform === "ios") {
        return APP_STORE_URL;
    }

    if (platform === "android") {
        return PLAY_STORE_URL;
    }

    return APP_DOWNLOAD_ANCHOR;
}

export function isExternalDownloadPlatform(platform: DownloadPlatform) {
    return platform !== "desktop";
}
