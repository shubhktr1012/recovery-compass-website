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
    default: "Recovery Compass - Steady Progress Without Pressure",
    template: "%s | Recovery Compass",
  },
  description:
    "Recovery Compass helps you gently reset habits, restore balance, and move toward a healthier daily rhythm through calm, structured daily guidance.",
  keywords: ["habit reset", "nervous system regulation", "sleep reset", "wellness programs", "daily balance"],
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
    title: "Recovery Compass - Steady Progress Without Pressure",
    description:
      "Recovery Compass helps you gently reset habits, restore balance, and move toward a healthier daily rhythm.",
    siteName: "Recovery Compass",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Recovery Compass - Steady Progress Without Pressure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Recovery Compass - Steady Progress Without Pressure",
    description:
      "Recovery Compass helps you gently reset habits, restore balance, and move toward a healthier daily rhythm.",
    images: ["/og-image.png"],
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
import { CartProvider } from "@/lib/context/cart-context";
import { UserProvider } from "@/lib/context/user-context";
import { MyPlanDrawer } from "@/components/my-plan-drawer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (sessionStorage.getItem('has_seen_preloader')) {
                  document.documentElement.classList.add('skip-preloader');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${satoshi.variable} ${erode.variable} font-sans antialiased`}
      >

        <SmoothScrollProvider>
          <UserProvider>
            <CartProvider>
              <Preloader />
              <PageTransition>
                {children}
              </PageTransition>
              <MyPlanDrawer />
              <BackToTop />
              <CookieBanner />
            </CartProvider>
          </UserProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
