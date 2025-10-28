import type { Metadata } from "next";
import "../../globals.css";
import Layout from "../../components/Layout";
import ErrorBoundary from "../../components/ErrorBoundary";
import { getDictionary } from "@/lib/get-dictionary";

type LayoutProps = Readonly<{
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Promise<any>;
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
  const dictionary = await getDictionary(lang);
  return (
    <ErrorBoundary>
      <Layout dictionary={dictionary}>{children}</Layout>
    </ErrorBoundary>
  );
}