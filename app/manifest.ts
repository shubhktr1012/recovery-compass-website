import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Recovery Compass",
    short_name: "Recovery Compass",
    description:
      "Recovery Compass offers guided programs for habit reset, better sleep, steadier energy, and calmer daily balance through practical daily support.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0F172A",
    icons: [
      {
        src: "/rc-logo-white.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
