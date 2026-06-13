import type { Metadata } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
import { LayoutClientExtras } from "@/components/layout-client-extras";
import { PageTransition } from "@/components/page-transition";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { Preloader } from "@/components/ui/preloader";
import { getHostFromHeaders, isAdminHost } from "@/lib/admin/host";

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
  applicationName: "Recovery Compass Wellness",
  title: {
    default: "Recovery Compass Wellness | Guided Habit Reset & Wellness",
    template: "%s | Recovery Compass Wellness",
  },
  description:
    "Recovery Compass is a wellness app with structured daily programs for habit reset, sleep, energy, men's vitality, and biohacking.",
  keywords: [
    "Recovery Compass Wellness",
    "habit reset",
    "sleep support",
    "energy restore",
    "daily routines",
    "nervous system regulation",
    "wellness programs",
    "behavioral guidance India",
    "science-backed wellness",
  ],
  authors: [{ name: "Recovery Compass Team", url: "https://recoverycompass.co/about" }],
  creator: "Recovery Compass",
  publisher: "Recovery Compass",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://recoverycompass.co",
    title: "Recovery Compass Wellness | Habit Reset & Wellness",
    description:
      "Structured daily programs for habit reset, sleep, energy, men's vitality, and biohacking.",
    siteName: "Recovery Compass Wellness",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Recovery Compass Wellness - Steady Progress Without Pressure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Recovery Compass Wellness | Habit Reset & Wellness",
    description:
      "Structured daily programs for habit reset, sleep, energy, men's vitality, and biohacking.",
    images: ["/og-image.png"],
    creator: "@recoverycompass",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
};

import { CartProvider } from "@/lib/context/cart-context";
import { UserProvider } from "@/lib/context/user-context";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const disablePublicExtras = isAdminHost(getHostFromHeaders(headerStore));

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <link rel="preload" href="/rc-logo-white.svg" as="image" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="1024x1024" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-icon.png" sizes="180x180" />
        {process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID && (
          <script
            id="microsoft-clarity"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
              `,
            }}
          />
        )}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            />
            <script
              id="google-analytics"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
                `,
              }}
            />
          </>
        )}
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
              <PageTransition>{children}</PageTransition>
              <LayoutClientExtras disabled={disablePublicExtras} />
            </CartProvider>
          </UserProvider>
        </SmoothScrollProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
