import type { Metadata } from "next";
import localFont from "next/font/local";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { BackToTop } from "@/components/ui/back-to-top";
import { Preloader } from "@/components/ui/preloader";

import "./globals.css";

// Local Satoshi Font
const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/Satoshi-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

// Local Erode Font
const erode = localFont({
  src: [
    {
      path: "../public/fonts/Erode-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Erode-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/Erode-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Erode-MediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/Erode-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Erode-SemiboldItalic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../public/fonts/Erode-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Erode-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-erode",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://recoverycompass.co"),
  title: {
    default: "Recovery Compass - Reclaim Your Clarity",
    template: "%s | Recovery Compass",
  },
  description:
    "Recovery Compass is your premium companion for a smoke-free life. Navigate urge waves, track health recovery, visualize savings, and build lasting habits.",
  keywords: ["quit smoking", "addiction recovery", "somatic regulation", "health tracker", "smoke-free"],
  authors: [{ name: "Recovery Compass Team" }],
  creator: "Recovery Compass",
  publisher: "Recovery Compass",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://recoverycompass.co",
    title: "Recovery Compass - Reclaim Your Clarity",
    description:
      "A premium companion for your journey to a smoke-free life. Track progress, health recovery, and savings with clarity.",
    siteName: "Recovery Compass",
    images: [
      {
        url: "/hero.jpeg",
        width: 1200,
        height: 630,
        alt: "Recovery Compass Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Recovery Compass - Reclaim Your Clarity",
    description:
      "A premium companion for your journey to a smoke-free life. Track progress, health recovery, and savings with clarity.",
    images: ["/hero.jpeg"],
    creator: "@recoverycompass",
  },
  icons: {
    icon: "/rc-logo-white.svg",
    apple: "/rc-logo-white.svg",
  },
};

export const viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
};

import { PageTransition } from "@/components/page-transition";
import { CookieBanner } from "@/components/cookie-banner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body
        className={`${satoshi.variable} ${erode.variable} font-sans antialiased`}
      >

        <SmoothScrollProvider>
          <Preloader />
          <PageTransition>
            {children}
          </PageTransition>
          <BackToTop />
          <CookieBanner />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
