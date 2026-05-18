import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Recovery Compass Wellness",
    short_name: "Recovery Compass Wellness",
    description:
      "Recovery Compass offers structured daily programs for habit reset, sleep, energy, men's vitality, and biohacking.",
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
