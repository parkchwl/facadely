import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "facadely - No-Code Website Builder",
    template: "%s | facadely"
  },
  description: "Build a professional website in minutes — No code, no hassle. Choose from 100+ templates and launch your site today.",
  keywords: ["website builder", "no-code", "templates", "web design", "landing page", "website maker"],
  authors: [{ name: "facadely Team" }],
  creator: "facadely Corp.",
  publisher: "facadely Corp.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://facadely.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'facadely - No-Code Website Builder',
    description: 'Build a professional website in minutes — No code, no hassle',
    siteName: 'facadely',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'facadely Website Builder',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'facadely - No-Code Website Builder',
    description: 'Build a professional website in minutes — No code, no hassle',
    images: ['/twitter-image.png'],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}