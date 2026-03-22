"use client";
/* eslint-disable @next/next/no-img-element */

import SiteCustomizationRuntime from "@/components/SiteCustomizationRuntime";
import { TemplateContainer } from "@/components/template-primitives";

const features = [
  "Real-time analytics with sub-second refresh",
  "Multi-currency accounts across 40+ markets",
  "AI-assisted budgeting and categorization",
  "Instant transfers and virtual cards",
  "Bank-grade security and biometric access",
  "Premium card controls and cashback",
];

const pricing = [
  { name: "Standard", price: "Free", description: "Everything you need to get started." },
  { name: "Premium", price: "$9.99/mo", description: "Advanced controls for serious money managers." },
  { name: "Business", price: "$29/mo", description: "Built for teams, workflows, and scale." },
];

export default function VaultFintechDashboardTemplate() {
  return (
    <>
      <SiteCustomizationRuntime />
      <main data-edit-id="t9-main" className="relative isolate overflow-hidden bg-[#040404] text-white">
        <style
          dangerouslySetInnerHTML={{
            __html:
              "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');",
          }}
        />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
          <div className="absolute left-[10%] top-[8%] h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute right-[8%] top-[20%] h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-[30rem] bg-gradient-to-t from-black via-black/90 to-transparent" />
        </div>

        <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-2xl">
          <TemplateContainer className="flex items-center justify-between py-4">
            <a
              href="#"
              data-edit-id="t9-brand"
              className="flex items-center gap-2 text-sm font-bold tracking-wide text-white"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-xs font-black text-black shadow-[0_0_24px_rgba(255,255,255,0.2)]">
                V
              </span>
              Vault
            </a>
            <nav
              className="hidden items-center gap-7 text-[0.82rem] text-white/55 md:flex"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <a href="#features" className="transition hover:text-white">Features</a>
              <a href="#pricing" className="transition hover:text-white">Pricing</a>
              <a href="#security" className="transition hover:text-white">Security</a>
            </nav>
            <a
              href="#pricing"
              data-edit-id="t9-top-cta"
              className="rounded-lg border border-white/10 bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-white/90"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Get started
            </a>
          </TemplateContainer>
        </header>

        <section className="relative pt-32 pb-20 md:pt-44 md:pb-28">
          <TemplateContainer>
            <div className="mx-auto max-w-4xl text-center">
              <p
                data-edit-id="t9-eyebrow"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-white/75 shadow-[0_0_32px_rgba(255,255,255,0.04)]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.9)]" />
                Now processing $12B annually
              </p>
              <h1
                data-edit-id="t9-title"
                className="mt-8 text-[clamp(3.6rem,8vw,7rem)] font-extrabold leading-[1.05] tracking-[-0.05em] text-white"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                The modern way
                <br />
                to manage <span className="bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent">money.</span>
              </h1>
              <p
                data-edit-id="t9-copy"
                className="mx-auto mt-7 max-w-xl text-base leading-8 text-white/58"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Vault combines multi-currency accounts, instant transfers, and real-time analytics
                in one operating layer for modern personal and business finance.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="#pricing"
                  data-edit-id="t9-cta-primary"
                  className="rounded-lg border border-white/10 bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Open an account
                </a>
                <a
                  href="#features"
                  data-edit-id="t9-cta-secondary"
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white/76 transition hover:bg-white/[0.07]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  See all features
                </a>
              </div>
            </div>

            <div className="relative mx-auto mt-16 max-w-4xl">
              <div className="absolute -inset-5 rounded-[2rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)] blur-2xl" />
              <div className="absolute -inset-1 rounded-[1.75rem] border border-white/10 bg-white/[0.03]" />
              <img
                data-edit-id="t9-dashboard-image"
                src="/t9-dashboard.svg"
                alt="Vault dashboard"
                className="relative w-full rounded-[1.4rem] border border-white/10 object-cover shadow-[0_30px_120px_rgba(0,0,0,0.55)]"
              />
            </div>
          </TemplateContainer>
        </section>

        <section className="border-y border-white/5 py-8">
          <TemplateContainer>
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-semibold tracking-[0.18em] text-white/28">
              {["TechCrunch", "Forbes", "Bloomberg", "Wired", "Financial Times"].map((name) => (
                <span key={name}>{name}</span>
              ))}
            </div>
          </TemplateContainer>
        </section>

        <section id="features" className="py-20 md:py-28">
          <TemplateContainer>
            <div className="mx-auto max-w-2xl text-center">
              <p
                data-edit-id="t9-features-eyebrow"
                className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-300"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Features
              </p>
              <h2
                data-edit-id="t9-features-title"
                className="mt-4 text-3xl font-bold tracking-[-0.03em] text-white md:text-5xl"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Everything you need. Nothing you don&apos;t.
              </h2>
            </div>

            <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={feature}
                  data-edit-id={`t9-feature-${index + 1}`}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] p-7 shadow-[0_18px_50px_rgba(0,0,0,0.28)]"
                >
                  <p
                    className="text-sm leading-7 text-white/74"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </TemplateContainer>
        </section>

        <section id="security" className="py-20 md:py-28">
          <TemplateContainer>
            <div className="grid gap-12 rounded-[2rem] border border-white/8 bg-white/[0.025] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.3)] lg:grid-cols-2 lg:items-center lg:p-10">
              <div className="rounded-[1.5rem] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_48%)] p-6">
                <img
                  data-edit-id="t9-card-image"
                  src="/t9-card.png"
                  alt="Vault card"
                  className="w-full object-contain"
                />
              </div>
              <div>
                <p
                  data-edit-id="t9-card-eyebrow"
                  className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-300"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  The Vault card
                </p>
                <h2
                  data-edit-id="t9-card-title"
                  className="mt-4 text-3xl font-bold tracking-[-0.03em] text-white md:text-5xl"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  A card as smart as your money.
                </h2>
                <p
                  data-edit-id="t9-card-copy"
                  className="mt-6 text-base leading-8 text-white/58"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Matte black metal, dynamic CVV, instant freeze, and spending controls that move
                  with the speed of the app behind it.
                </p>
              </div>
            </div>
          </TemplateContainer>
        </section>

        <section id="pricing" className="pb-24 pt-20 md:pb-32 md:pt-28">
          <TemplateContainer>
            <div className="mx-auto max-w-2xl text-center">
              <p
                data-edit-id="t9-pricing-eyebrow"
                className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-300"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Pricing
              </p>
              <h2
                data-edit-id="t9-pricing-title"
                className="mt-4 text-3xl font-bold tracking-[-0.03em] text-white md:text-5xl"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Start free. Scale as you grow.
              </h2>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {pricing.map((plan, index) => (
                <div
                  key={plan.name}
                  data-edit-id={`t9-plan-${index + 1}`}
                  className={`rounded-xl border p-7 ${
                    index === 1
                      ? "border-white/15 bg-white/[0.05] shadow-[0_24px_80px_rgba(37,99,235,0.16)]"
                      : "border-white/8 bg-white/[0.025]"
                  }`}
                >
                  <h3
                    className="text-base font-semibold text-white"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className="mt-3 text-4xl font-bold tracking-tight text-white"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {plan.price}
                  </p>
                  <p
                    className="mt-3 text-sm text-white/58"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {plan.description}
                  </p>
                </div>
              ))}
            </div>
          </TemplateContainer>
        </section>
      </main>
    </>
  );
}
