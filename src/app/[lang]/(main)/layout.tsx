import type { Metadata } from "next";
import { headers } from "next/headers";
import "../../globals.css";
import Layout from "../../components/Layout";
import ErrorBoundary from "../../components/ErrorBoundary";
import { getDictionary } from "@/lib/get-dictionary";
import { i18n, type Locale } from "@/i18n/config";
import { getAuthenticatedUser } from "@/lib/server/api-security";

type LayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>;

export const metadata: Metadata = {
  title: "facadely",
  description: "Build and operate professional websites with a modern website builder and template workflow",
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
  const requestHeaders = await headers();
  const authenticatedUser = await getAuthenticatedUser(requestHeaders.get('cookie') || '');
  return (
    <ErrorBoundary>
      <Layout dictionary={dictionary} authenticatedUser={authenticatedUser}>{children}</Layout>
    </ErrorBoundary>
  );
}
