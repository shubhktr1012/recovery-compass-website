import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.jsdelivr.net checkout.razorpay.com https://www.clarity.ms https://*.clarity.ms https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' cdn.jsdelivr.net",
              "img-src 'self' data: https: *.supabase.co https://*.clarity.ms https://*.bing.com https://*.google-analytics.com https://*.googletagmanager.com",
              "font-src 'self' data: https:",
              "connect-src 'self' *.supabase.co https://vitals.vercel-insights.com cdn.jsdelivr.net *.razorpay.com https://lumberjack.razorpay.com https://*.clarity.ms https://*.bing.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
              "frame-src https://api.razorpay.com https://checkout.razorpay.com",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
