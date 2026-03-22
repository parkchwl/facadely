"use client";
/* eslint-disable @next/next/no-img-element */

import SiteCustomizationRuntime from "@/components/SiteCustomizationRuntime";
import { TemplateContainer } from "@/components/template-primitives";

export default function RekoletBrutalismTemplate() {
  return (
    <>
      <SiteCustomizationRuntime />
      <main data-edit-id="t17-main" className="bg-[#0a0a0a] text-white">
        <style
          dangerouslySetInnerHTML={{
            __html:
              "@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');",
          }}
        />

        <section className="relative flex min-h-screen flex-col overflow-hidden px-4 pb-8 pt-6 md:px-8 md:pt-8">
          <img
            data-edit-id="t17-hero-image"
            src="/t17-hero.png"
            alt="Rekolet hero"
            className="absolute inset-x-0 top-0 bottom-[120px] h-auto w-full object-cover opacity-60"
          />
          <div className="absolute inset-x-0 top-0 bottom-[120px] bg-gradient-to-b from-[#0a0a0a]/80 via-transparent to-[#0a0a0a]" />
          <div className="absolute inset-x-0 top-0 bottom-[120px] bg-gradient-to-r from-[#0a0a0a]/90 via-transparent to-transparent" />

          <header className="relative z-10 flex items-center justify-between">
            <a
              href="#"
              data-edit-id="t17-brand"
              className="text-xl font-bold tracking-tight text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Rekolet
            </a>
            <div
              data-edit-id="t17-menu"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-sm text-white backdrop-blur-md"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Menu
            </div>
          </header>

          <div className="relative z-10 flex flex-1 flex-col justify-center pt-12 lg:pt-20">
            <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
              <h1
                data-edit-id="t17-title"
                className="text-[clamp(4rem,14vw,15rem)] font-bold uppercase leading-[0.85] tracking-[-0.08em] text-white"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                DIGITAL
                <br />
                ENGINEER
              </h1>

              <div
                data-edit-id="t17-card"
                className="max-w-[340px] rounded-3xl border border-white/10 bg-[#1a1a1a]/80 p-8 shadow-2xl backdrop-blur-xl"
              >
                <p
                  data-edit-id="t17-card-copy"
                  className="text-xl leading-snug tracking-tight text-white/90"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Rekolet is a product-first design studio built for clarity, scale, and execution.
                </p>
                <a
                  href="#recognition"
                  data-edit-id="t17-card-cta"
                  className="mt-8 inline-flex rounded-full bg-[#0d6efd] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0b5ed7]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Let&apos;s work
                </a>
              </div>
            </div>

            <p
              data-edit-id="t17-description"
              className="relative z-10 mt-10 text-xs font-semibold uppercase tracking-[0.28em] text-white/60 md:text-sm"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              REKOLET IS A DESIGN-LED STUDIO BUILT FOR CLARITY, SCALE, AND EXECUTION.
            </p>
          </div>

          <div className="relative z-10 mt-auto grid grid-cols-2 gap-2 pt-12 md:grid-cols-4 md:gap-4">
            {["INSTAGRAM", "MEDIUM", "TWITTER X", "LINKEDIN"].map((item, index) => (
              <a
                key={item}
                href="#"
                data-edit-id={`t17-social-${index + 1}`}
                className="flex h-14 items-center justify-center rounded-2xl border border-white/5 bg-[#1a1a1a]/80 text-xs font-bold tracking-[0.24em] text-white backdrop-blur-md transition hover:bg-white hover:text-black"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {item}
              </a>
            ))}
          </div>
        </section>

        <section
          id="recognition"
          data-edit-id="t17-recognition"
          className="-mt-6 rounded-t-[2.5rem] bg-white px-4 py-24 text-[#0a0a0a] md:px-12 md:py-32"
        >
          <TemplateContainer>
            <div className="flex flex-col gap-16">
              <div className="max-w-5xl">
                <p
                  data-edit-id="t17-recognition-eyebrow"
                  className="mb-6 text-sm font-bold uppercase tracking-[0.26em] text-[#0a0a0a]/50"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Industry circles
                </p>
                <h2
                  data-edit-id="t17-recognition-title"
                  className="text-4xl font-bold leading-[1.05] tracking-[-0.05em] md:text-6xl lg:text-[5.2rem]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Rekolet has been recognised across respected <span className="text-[#0a0a0a]/40">design platforms.</span>
                </h2>
              </div>

              <div className="flex flex-col gap-8 border-t border-black/10 pt-12 lg:flex-row lg:items-center lg:justify-between">
                <p
                  data-edit-id="t17-recognition-date"
                  className="text-3xl font-bold tracking-tight text-[#0a0a0a]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  2012-Now
                </p>
                <div className="flex flex-wrap items-center gap-8 md:gap-12">
                  {["LOGOIPSUM", "DEPARTMENT OF LOGOS", "PIXEL INDEX", "MONO FORM", "A11Y DOT"].map((item, index) => (
                    <span
                      key={item}
                      data-edit-id={`t17-client-${index + 1}`}
                      className="text-sm font-bold tracking-[0.18em] text-[#0a0a0a]/75"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </TemplateContainer>
        </section>
      </main>
    </>
  );
}
