"use client";
/* eslint-disable @next/next/no-img-element */

import SiteCustomizationRuntime from "@/components/SiteCustomizationRuntime";
import { TemplateContainer } from "@/components/template-primitives";

const navLinks = ["Retreats", "Therapy", "Journal"];

const featureCards = [
  {
    title: "Private care",
    copy: "One-to-one therapeutic guidance shaped around pace, trust, and recovery.",
  },
  {
    title: "Restorative spaces",
    copy: "Quiet suites, soft daylight, and grounded interiors designed to slow the nervous system.",
  },
  {
    title: "Nature rituals",
    copy: "Breathwork, walks, and sensory sessions reconnect body, routine, and attention.",
  },
];

const stats = [
  { value: "24", label: "Suites prepared for extended stays" },
  { value: "12", label: "Resident therapists and wellness guides" },
  { value: "96%", label: "Guests who return for seasonal programs" },
];

export default function SerenicaWellnessRetreatTemplate() {
  return (
    <>
      <SiteCustomizationRuntime />
      <main data-edit-id="t14-main" className="bg-[#f5f1eb] text-[#1f241c]">
        <style
          dangerouslySetInnerHTML={{
            __html:
              "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap');",
          }}
        />

        <section className="relative min-h-screen overflow-hidden">
          <div
            data-edit-id="t14-hero-image"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/t14-hero.png')" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,24,16,0.22)_0%,rgba(17,24,16,0.16)_35%,rgba(17,24,16,0.72)_100%)]" />

          <TemplateContainer className="relative z-10 flex min-h-screen flex-col">
            <header
              data-edit-id="t14-nav"
              className="flex items-center justify-between py-7 text-white"
            >
              <a
                href="#"
                data-edit-id="t14-brand"
                className="text-[1.45rem] tracking-[0.18em]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Serenica
              </a>
              <nav className="hidden items-center gap-8 md:flex">
                {navLinks.map((link, index) => (
                  <a
                    key={link}
                    href="#"
                    data-edit-id={`t14-nav-link-${index + 1}`}
                    className="text-sm font-medium tracking-[0.16em] text-white/88 transition hover:text-white"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    {link}
                  </a>
                ))}
              </nav>
              <a
                href="#contact"
                data-edit-id="t14-nav-cta"
                className="rounded-full border border-white/45 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-[#243021]"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Book a stay
              </a>
            </header>

            <div className="mt-auto grid gap-14 pb-12 pt-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:pb-16">
              <div className="max-w-4xl">
                <p
                  data-edit-id="t14-eyebrow"
                  className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-white/72"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  Rest, clarity, and private care
                </p>
                <h1
                  data-edit-id="t14-title"
                  className="max-w-4xl text-[clamp(3.9rem,8vw,7.2rem)] leading-[0.94] text-white"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  A slower kind of luxury for healing minds and quiet mornings.
                </h1>
              </div>

              <div className="flex flex-col gap-8 lg:items-end">
                <p
                  data-edit-id="t14-copy"
                  className="max-w-md text-sm leading-7 text-white/86 md:text-base"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  Serenica brings together therapy, design, and restorative ritual in a sanctuary
                  built for recovery. Every room, meal, and conversation is curated to help guests
                  return to themselves with steadier breath and softer focus.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="#programs"
                    data-edit-id="t14-cta-primary"
                    className="rounded-full bg-[#33402f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#253021]"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    Explore programs
                  </a>
                  <a
                    href="#story"
                    data-edit-id="t14-cta-secondary"
                    className="rounded-full border border-white/35 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    Meet the retreat
                  </a>
                </div>
              </div>
            </div>
          </TemplateContainer>
        </section>

        <section data-edit-id="t14-story" id="story" className="border-t border-[#d9d3ca] py-20 md:py-28">
          <TemplateContainer>
            <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="space-y-10">
                <p
                  data-edit-id="t14-story-eyebrow"
                  className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6d7464]"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  Why guests arrive
                </p>
                <h2
                  data-edit-id="t14-story-title"
                  className="max-w-xl text-4xl leading-tight text-[#20261b] md:text-6xl"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Gentle structure, therapeutic depth, and rooms that feel like exhale.
                </h2>
                <p
                  data-edit-id="t14-story-copy"
                  className="max-w-xl text-base leading-8 text-[#4d5347]"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  We designed Serenica for people who need more than a weekend escape. The retreat
                  combines evidence-based support with deeply tactile interiors, offering a calm
                  environment where rest and reflection become part of everyday healing.
                </p>

                <div className="grid gap-5 md:grid-cols-3">
                  {stats.map((stat) => (
                    <div key={stat.label} className="border-l border-[#c9c1b6] pl-4">
                      <div
                        data-edit-id={`t14-stat-${stat.value.replace(/[^a-zA-Z0-9]+/g, "").toLowerCase()}`}
                        className="text-4xl text-[#20261b]"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {stat.value}
                      </div>
                      <p
                        className="mt-2 text-xs uppercase tracking-[0.16em] text-[#6d7464]"
                        style={{ fontFamily: "'Manrope', sans-serif" }}
                      >
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[2rem] bg-[#d7d2c8]">
                <img
                  data-edit-id="t14-story-image"
                  src="/t14-about.png"
                  alt="Serene landscape near the retreat"
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-6 border border-white/30" />
              </div>
            </div>
          </TemplateContainer>
        </section>

        <section data-edit-id="t14-features" id="programs" className="border-t border-[#d9d3ca] py-20 md:py-28">
          <TemplateContainer>
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <h2
                data-edit-id="t14-features-title"
                className="max-w-2xl text-4xl leading-tight text-[#20261b] md:text-5xl"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Care experiences shaped by softness, privacy, and beautiful routine.
              </h2>
              <p
                data-edit-id="t14-features-copy"
                className="max-w-md text-sm leading-7 text-[#5f6656]"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Each stay is built from therapy sessions, movement practices, chef-led nutrition,
                and quiet design details that reduce friction from the day.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {featureCards.map((feature, index) => (
                <article
                  key={feature.title}
                  data-edit-id={`t14-feature-card-${index + 1}`}
                  className="rounded-[1.75rem] border border-[#ddd5cb] bg-[#f9f6f1] p-7"
                >
                  <p
                    data-edit-id={`t14-feature-title-${index + 1}`}
                    className="text-2xl text-[#20261b]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {feature.title}
                  </p>
                  <p
                    data-edit-id={`t14-feature-copy-${index + 1}`}
                    className="mt-4 text-sm leading-7 text-[#56604e]"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    {feature.copy}
                  </p>
                </article>
              ))}
            </div>
          </TemplateContainer>
        </section>
      </main>
    </>
  );
}
