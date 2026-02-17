import type { Metadata } from "next";
import "../../globals.css";
import Layout from "../../components/Layout";
import ErrorBoundary from "../../components/ErrorBoundary";
import { getDictionary } from "@/lib/get-dictionary";
import { i18n, type Locale } from "@/i18n/config";

type LayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>;

export const metadata: Metadata = {
  title: "facadely",
  description: "Build a professional website in minutes — No code, no hassle",
};

export default async function MainLayout({
  children,
  params,
}: LayoutProps) {
  const { lang } = await params;
  const resolvedLang = i18n.locales.includes(lang as Locale)
    ? (lang as Locale)
    : i18n.defaultLocale;
  const dictionary = await getDictionary(resolvedLang);
  return (
    <ErrorBoundary>
      <Layout dictionary={dictionary}>{children}</Layout>
    </ErrorBoundary>
  );
}
