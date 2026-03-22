"use client";
/* eslint-disable @next/next/no-img-element */

import SiteCustomizationRuntime from "@/components/SiteCustomizationRuntime";
import { TemplateContainer } from "@/components/template-primitives";

const gallery = [
  { image: "/t19-facade.png", caption: "ARCHITECTURAL BRILLIANCE" },
  { image: "/t18-hero.png", caption: "CRAFTED TO PERFECTION" },
  { image: "/t18-mq4.png", caption: "DESIGN MASTERY" },
];

export default function FlatoMinimalistCabinTemplate() {
  return (
    <>
      <SiteCustomizationRuntime />
      <main data-edit-id="t21-main" className="relative min-h-screen bg-white text-black">
        <style
          dangerouslySetInnerHTML={{
            __html:
              "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');",
          }}
        />

        <div className="pointer-events-none absolute inset-0 z-0 flex justify-between opacity-10">
          <div className="h-full w-px bg-black" />
          <div className="hidden h-full w-px bg-black md:block" />
          <div className="hidden h-full w-px bg-black md:block" />
          <div className="h-full w-px bg-black" />
        </div>

        <header className="relative z-20 flex items-center justify-between bg-white/80 px-6 py-6 backdrop-blur-md md:px-12">
          <a
            href="#"
            data-edit-id="t21-brand"
            className="text-2xl font-black tracking-[-0.06em]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Flato.
          </a>
          <nav
            className="hidden items-center gap-10 lg:flex"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {["Studio", "Projects", "Services", "Pricing", "Pages"].map((link, index) => (
              <a
                key={link}
                href="#"
                data-edit-id={`t21-nav-${index + 1}`}
                className="text-[11px] font-semibold text-[#333] transition hover:text-black"
              >
                {link}
              </a>
            ))}
          </nav>
          <a
            href="#about"
            data-edit-id="t21-top-cta"
            className="rounded bg-black px-6 py-2.5 text-[11px] font-bold text-white transition hover:opacity-80"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Book a call
          </a>
        </header>

        <section className="relative z-10 flex flex-col items-center overflow-hidden bg-white pt-4 md:pt-8">
          <div className="relative flex w-full justify-center pb-12 md:pb-24 lg:pb-32">
            <img
              data-edit-id="t21-hero-image"
              src="/t18-mq5.png"
              alt="Flato hero"
              className="h-[50vh] w-[95%] max-w-[1600px] object-cover sm:h-[60vh] md:h-[70vh] lg:h-[80vh]"
            />
            <h1
              data-edit-id="t21-title"
              className="absolute bottom-6 left-0 right-0 z-20 text-center text-[clamp(4.5rem,14vw,16rem)] font-medium leading-[0.8] tracking-[-0.06em] text-white mix-blend-difference"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Dream - Homes
            </h1>
          </div>
        </section>

        <section className="relative z-10 bg-transparent py-16 md:py-24">
          <TemplateContainer>
            <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-24">
              <div className="flex items-center gap-4 border-t border-black pt-4">
                <h2
                  data-edit-id="t21-about-eyebrow"
                  className="text-xs font-bold uppercase tracking-[0.24em] text-[#333]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  ABOUT FLATO.
                </h2>
              </div>
              <div>
                <p
                  data-edit-id="t21-about-copy"
                  className="max-w-4xl text-2xl font-medium leading-[1.1] tracking-[-0.03em] text-[#111] md:text-4xl lg:text-5xl"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  At Flato, we believe finding a property should feel exciting, not overwhelming.
                  We connect people with spaces that genuinely match their needs, pace, and
                  lifestyle.
                </p>
                <a
                  href="#gallery"
                  data-edit-id="t21-about-cta"
                  className="mt-12 inline-block rounded bg-black px-10 py-4 text-sm font-semibold text-white transition hover:opacity-80"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  About us
                </a>
              </div>
            </div>
          </TemplateContainer>
        </section>

        <section id="gallery" className="relative z-10 bg-transparent pb-32 pt-16 md:py-32">
          <TemplateContainer>
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_0.8fr] lg:gap-x-12">
              {gallery.map((item, index) => (
                <div
                  key={item.caption}
                  data-edit-id={`t21-gallery-${index + 1}`}
                  className={`${index === 0 ? "lg:mt-32" : ""} ${index === 2 ? "lg:mt-64 md:col-span-2 lg:col-span-1 md:w-1/2 lg:w-full mx-auto" : ""}`}
                >
                  <div className="border-t border-black pt-2">
                    <p
                      data-edit-id={`t21-gallery-caption-${index + 1}`}
                      className="text-[10px] font-bold uppercase tracking-[0.28em] text-black"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {item.caption}
                    </p>
                  </div>
                  <img
                    src={item.image}
                    alt={item.caption}
                    className={`mt-4 w-full object-cover ${
                      index === 0 ? "aspect-[4/3]" : index === 1 ? "aspect-square md:aspect-[3/4]" : "aspect-[2/3]"
                    }`}
                  />
                </div>
              ))}
            </div>
          </TemplateContainer>
        </section>
      </main>
    </>
  );
}
