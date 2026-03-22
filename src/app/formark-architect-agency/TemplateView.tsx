"use client";
/* eslint-disable @next/next/no-img-element */

import SiteCustomizationRuntime from "@/components/SiteCustomizationRuntime";
import { TemplateContainer } from "@/components/template-primitives";

const marqueeItems = new Array(6).fill("Special launch offer available now");

export default function FormarkArchitectAgencyTemplate() {
  return (
    <>
      <SiteCustomizationRuntime />
      <main data-edit-id="t22-main" className="bg-black text-white">
        <style
          dangerouslySetInnerHTML={{
            __html:
              "@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');@keyframes facadely-ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}",
          }}
        />

        <section data-edit-id="t22-header-section" className="min-h-[48vh] bg-white pb-12 pt-6 text-black">
          <TemplateContainer className="flex min-h-[48vh] max-w-none flex-col justify-between px-4 md:px-8 xl:px-12">
            <header className="grid grid-cols-2 gap-6 border-b border-black/10 pb-8">
              <nav className="flex flex-wrap gap-x-4 gap-y-2">
                {["[HOME]", "[ABOUT]", "[PROJECT]", "[CONTACT]", "[CART]"].map((link, index) => (
                  <a
                    key={link}
                    href="#"
                    data-edit-id={`t22-nav-link-${index + 1}`}
                    className="px-1 text-[11px] font-bold uppercase tracking-tight transition hover:bg-[#dfff00]"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {link}
                  </a>
                ))}
              </nav>
              <div className="flex justify-end">
                <a
                  href="#projects"
                  data-edit-id="t22-pages-link"
                  className="text-xs font-bold uppercase tracking-tight transition hover:bg-[#dfff00]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  [PAGES]
                </a>
              </div>
            </header>

            <div className="mt-16">
              <h1
                data-edit-id="t22-title"
                className="text-[clamp(4rem,13vw,14rem)] leading-[0.84] tracking-[-0.06em] text-black"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                ARCHITECT
                <br />
                AGENCY
              </h1>
            </div>
          </TemplateContainer>
        </section>

        <section className="overflow-hidden border-y border-black bg-[#dfff00] py-2 text-black">
          <div className="flex min-w-max gap-8 [animation:facadely-ticker_24s_linear_infinite] hover:[animation-play-state:paused]">
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="flex shrink-0 items-center gap-3 px-2 text-[11px] font-bold uppercase tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <span>+</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section
          data-edit-id="t22-hero-image"
          className="h-[56vh] bg-cover bg-center md:h-[78vh]"
          style={{ backgroundImage: "url('/t18-hero.png')" }}
        />

        <section data-edit-id="t22-about" className="relative overflow-hidden bg-black py-24 md:py-36">
          <div className="pointer-events-none absolute inset-0 mx-auto flex max-w-[1800px] justify-between px-4 md:px-8 xl:px-12">
            <div className="h-full w-px border-l border-dashed border-white/20" />
            <div className="hidden h-full w-px border-l border-dashed border-white/20 md:block" />
            <div className="hidden h-full w-px border-l border-dashed border-white/20 lg:block" />
            <div className="h-full w-px border-l border-dashed border-white/20" />
          </div>

          <TemplateContainer className="relative z-10 max-w-[1800px] px-4 md:px-8 xl:px-12">
            <div className="grid gap-12 lg:grid-cols-[1fr_2.4fr]">
              <div className="flex flex-col gap-10 md:gap-24">
                <p
                  data-edit-id="t22-about-label"
                  className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/50"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  # ABOUT US-
                </p>
                <p
                  data-edit-id="t22-about-subtext"
                  className="max-w-[280px] text-sm leading-7 text-white/72"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  We turn concepts into spaces that speak: modern, refined, and built to last.
                </p>
              </div>

              <div className="flex flex-col items-start gap-12">
                <p
                  data-edit-id="t22-about-copy"
                  className="max-w-5xl text-2xl leading-[1.18] tracking-[-0.03em] text-white/82 md:text-5xl"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <span className="text-white">
                    Formark is a design-driven architecture studio dedicated to creating functional,
                    timeless spaces that elevate everyday experiences.
                  </span>{" "}
                  We blend aesthetics, innovation, and purpose to craft places that reflect a
                  client vision while standing up to the realities of time, use, and growth.
                </p>
                <a
                  href="#contact"
                  data-edit-id="t22-about-cta"
                  className="bg-[#dfff00] px-12 py-4 text-sm font-bold uppercase tracking-[0.18em] text-black transition hover:brightness-110"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Contact
                </a>
              </div>
            </div>

            <div id="projects" className="mt-24 grid gap-16 lg:grid-cols-[3fr_2fr]">
              <div className="lg:mt-32">
                <div className="relative overflow-hidden">
                  <img
                    data-edit-id="t22-gallery-image-1"
                    src="/t19-facade.png"
                    alt="Formark featured facade"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
                </div>
                <p
                  data-edit-id="t22-gallery-caption-1"
                  className="mt-4 text-right text-[10px] font-bold uppercase tracking-[0.3em] text-white/50"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  [MINIMALIST - 2024]
                </p>
              </div>

              <div>
                <p
                  data-edit-id="t22-gallery-caption-2"
                  className="mb-4 text-right text-[10px] font-bold uppercase tracking-[0.3em] text-white/50"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {`{INDUSTRIAL - 2023}`}
                </p>
                <img
                  data-edit-id="t22-gallery-image-2"
                  src="/t18-hero.png"
                  alt="Formark industrial residence"
                  className="aspect-[3/4] w-full object-cover object-left"
                />
              </div>
            </div>
          </TemplateContainer>
        </section>
      </main>
    </>
  );
}
