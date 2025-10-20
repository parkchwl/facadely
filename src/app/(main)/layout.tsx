import type { Metadata } from "next";
import "../globals.css";
import Layout from "../components/Layout";
import ErrorBoundary from "../components/ErrorBoundary";

export const metadata: Metadata = {
  title: "facadely",
  description: "Build a professional website in minutes — No code, no hassle",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ErrorBoundary>
      <Layout>{children}</Layout>
    </ErrorBoundary>
  );
}