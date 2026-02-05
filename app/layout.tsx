import type { Metadata } from "next";
import localFont from "next/font/local";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { BackToTop } from "@/components/ui/back-to-top";

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
      path: "../public/fonts/Erode-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Erode-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Erode-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Erode-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-erode",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Recovery Compass - Reclaim Your Clarity",
  description: "A premium companion for your journey to a smoke-free life. Track progress, health recovery, and savings with clarity.",
  icons: {
    icon: "/rc-logo-white.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body
        className={`${satoshi.variable} ${erode.variable} font-sans antialiased`}
      >

        <SmoothScrollProvider>
          {children}
          <BackToTop />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
