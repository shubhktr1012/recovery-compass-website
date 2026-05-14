import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Recovery Compass Wellness",
    short_name: "Recovery Compass Wellness",
    description:
      "Recovery Compass offers guided programs for habit reset, better sleep, steadier energy, and calmer daily balance through practical daily support.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0F172A",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
