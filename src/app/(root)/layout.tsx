import type { Metadata } from "next";
import "../globals.css";
import Layout from "../components/Layout";
import ErrorBoundary from "../components/ErrorBoundary";
import { getDictionary } from "@/lib/get-dictionary";
import { i18n } from "@/i18n/config";

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export const metadata: Metadata = {
  title: "facadely",
  description: "Build a professional website in minutes — No code, no hassle",
};

export default async function MainLayout({
  children,
}: LayoutProps) {
  const lang = i18n.defaultLocale;
  const dictionary = await getDictionary(lang);
  return (
    <ErrorBoundary>
      <Layout dictionary={dictionary}>{children}</Layout>
    </ErrorBoundary>
  );
}