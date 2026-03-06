import type { Metadata, Viewport } from "next";
import { appMono, appSans, appMontserrat, appPlusJakarta } from "./fonts";
import "./globals.css";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: {
    default: "facadely - Website Builder",
    template: "%s | facadely"
  },
  description: "Build and operate professional websites with a modern website builder and template system.",
  keywords: ["website builder", "templates", "web design", "landing page", "website platform"],
  authors: [{ name: "facadely Team" }],
  creator: "facadely Corp.",
  publisher: "facadely Corp.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://facadely.com'),
  manifest: '/manifest.json',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'facadely - Website Builder',
    description: 'Build and operate professional websites with a modern website builder',
    siteName: 'facadely',
    images: [{
      url: '/image/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'facadely Website Builder',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'facadely - Website Builder',
    description: 'Build and operate professional websites with a modern website builder',
    images: ['/image/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const ROOT_THEME_STYLE: CSSProperties = {
  "--primary": "#6366f1",
  "--secondary": "#d946ef",
  "--radius": "0.5rem",
  "--spacing-base": "1rem",
} as CSSProperties;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={ROOT_THEME_STYLE} suppressHydrationWarning>
      <body
        className={`${appSans.variable} ${appMono.variable} ${appMontserrat.variable} ${appPlusJakarta.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
