"use client";
/* eslint-disable @next/next/no-img-element */

import SiteCustomizationRuntime from "@/components/SiteCustomizationRuntime";
import { TemplateContainer } from "@/components/template-primitives";

const projects = [
  {
    title: "Aurelia Paris",
    meta: "Brand identity / 2025",
    description:
      "A complete fragrance house brand world, from obsidian packaging to tactile editorial direction.",
    image: "/t5-project-1.png",
  },
  {
    title: "The Golden Hour",
    meta: "Fashion editorial / 2025",
    description:
      "A motion-led campaign shaped around shadow, amber light, and a brutalist loft interior.",
    image: "/t5-project-2.png",
  },
  {
    title: "Concrete & Canopy",
    meta: "Architecture / 2024",
    description:
      "Visual strategy and launch storytelling for a forest research institute built from glass and raw concrete.",
    image: "/t5-project-3.png",
  },
];

const capabilities = [
  "Creative direction",
  "Brand identity systems",
  "Digital and web experiences",
  "Film and motion storytelling",
  "Editorial photography",
];

export default function NocturneTypographyAgencyTemplate() {
  return (
    <>
      <SiteCustomizationRuntime />
      <main data-edit-id="t25-main" className="bg-[#0c0a09] text-white">
        <style
          dangerouslySetInnerHTML={{
            __html:
              "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');@keyframes facadely-nocturne-marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}",
          }}
        />

        <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-[#0c0a09]/75 backdrop-blur-xl">
          <TemplateContainer className="flex items-center justify-between py-5">
            <a
              href="#"
              data-edit-id="t25-brand"
              className="text-lg tracking-[0.18em] text-white"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              NOCTURNE
            </a>
            <nav
              className="hidden items-center gap-8 text-[0.8rem] uppercase tracking-[0.2em] text-white/40 md:flex"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <a href="#work" className="transition hover:text-white">Work</a>
              <a href="#about" className="transition hover:text-white">About</a>
              <a href="#capabilities" className="transition hover:text-white">Services</a>
            </nav>
            <a
              href="#contact"
              data-edit-id="t25-top-cta"
              className="text-[0.8rem] uppercase tracking-[0.2em] text-white/60 transition hover:text-white"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Let&apos;s talk
            </a>
          </TemplateContainer>
        </header>

        <section className="relative flex min-h-screen flex-col justify-end">
          <div
            data-edit-id="t25-hero-image"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/t5-hero.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c0a09]/65 to-transparent" />

          <TemplateContainer className="relative z-10 pb-20 pt-40 md:pb-28">
            <p
              data-edit-id="t25-eyebrow"
              className="text-[0.72rem] font-semibold uppercase tracking-[0.38em] text-amber-400/80"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Creative studio / est. 2018
            </p>
            <h1
              data-edit-id="t25-title"
              className="mt-8 max-w-5xl text-[clamp(3.7rem,8vw,6.8rem)] leading-[1.02] tracking-[-0.05em] text-white"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              We direct brands
              <br />
              that demand
              <br />
              <span className="text-amber-200/90">attention.</span>
            </h1>
            <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <p
                data-edit-id="t25-copy"
                className="max-w-md text-base leading-8 text-white/50"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Nocturne builds brand identity, cinematic launch narratives, and immersive digital
                work for ambitious clients who want cultural gravity, not decorative noise.
              </p>
              <a
                href="#work"
                data-edit-id="t25-hero-cta"
                className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                View work
              </a>
            </div>
          </TemplateContainer>
        </section>

        <section className="overflow-hidden border-y border-white/5 py-8">
          <div className="flex min-w-max gap-10 px-4 [animation:facadely-nocturne-marquee_22s_linear_infinite] hover:[animation-play-state:paused]">
            {[
              "Brand",
              "Motion",
              "Architecture",
              "Editorial",
              "Identity",
              "Craft",
              "Cinema",
              "Brand",
              "Motion",
              "Architecture",
              "Editorial",
              "Identity",
              "Craft",
              "Cinema",
            ].map((word, index) => (
              <span
                key={`${word}-${index}`}
                className="shrink-0 text-2xl tracking-[0.26em] text-white/16 md:text-4xl"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {word}
              </span>
            ))}
          </div>
        </section>

        <section id="work" className="py-24 md:py-32">
          <TemplateContainer>
            <div className="flex items-end justify-between border-b border-white/10 pb-8">
              <div>
                <p
                  data-edit-id="t25-work-eyebrow"
                  className="text-[0.72rem] font-semibold uppercase tracking-[0.38em] text-amber-400/70"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Selected work
                </p>
                <h2
                  data-edit-id="t25-work-title"
                  className="mt-4 text-4xl tracking-[-0.04em] text-white md:text-6xl"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Featured projects
                </h2>
              </div>
            </div>

            <div className="mt-16 grid gap-16">
              {projects.map((project, index) => (
                <div
                  key={project.title}
                  data-edit-id={`t25-project-${index + 1}`}
                  className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className={`aspect-[4/3] w-full object-cover ${index % 2 === 1 ? "lg:order-2" : ""}`}
                  />
                  <div className={index % 2 === 1 ? "lg:order-1 lg:text-right" : ""}>
                    <p
                      className="text-[0.72rem] uppercase tracking-[0.28em] text-white/35"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {project.meta}
                    </p>
                    <h3
                      data-edit-id={`t25-project-title-${index + 1}`}
                      className="mt-5 text-4xl tracking-[-0.04em] text-white md:text-5xl"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {project.title}
                    </h3>
                    <p
                      data-edit-id={`t25-project-copy-${index + 1}`}
                      className="mt-4 max-w-md text-sm leading-8 text-white/45"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {project.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TemplateContainer>
        </section>

        <section id="about" className="border-y border-white/5 bg-[#0f0d0c] py-24 md:py-32">
          <TemplateContainer>
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <p
                  data-edit-id="t25-about-eyebrow"
                  className="text-[0.72rem] font-semibold uppercase tracking-[0.38em] text-amber-400/70"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  The studio
                </p>
                <h2
                  data-edit-id="t25-about-title"
                  className="mt-5 text-4xl leading-tight tracking-[-0.04em] text-white md:text-5xl"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Design is an act of precision, not decoration.
                </h2>
                <p
                  data-edit-id="t25-about-copy"
                  className="mt-7 max-w-lg text-base leading-8 text-white/42"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  We believe the strongest design is felt before it is noticed. Every project is an
                  exercise in emotional clarity, editing away everything that does not serve the
                  story.
                </p>
              </div>

              <div className="grid gap-px overflow-hidden rounded-xl border border-white/5 bg-white/5 sm:grid-cols-2">
                {[
                  ["Founded", "2018"],
                  ["Team", "14 people"],
                  ["Locations", "Paris · Seoul · New York"],
                  ["Avg. project", "4-8 months"],
                ].map(([label, value]) => (
                  <div key={label} className="bg-[#0c0a09] p-8">
                    <p
                      className="text-[0.72rem] uppercase tracking-[0.28em] text-white/20"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {label}
                    </p>
                    <p
                      className="mt-3 text-xl text-white/82"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TemplateContainer>
        </section>

        <section id="capabilities" className="py-24 md:py-32">
          <TemplateContainer>
            <p
              data-edit-id="t25-capabilities-eyebrow"
              className="text-[0.72rem] font-semibold uppercase tracking-[0.38em] text-amber-400/70"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Capabilities
            </p>
            <h2
              data-edit-id="t25-capabilities-title"
              className="mt-4 text-4xl tracking-[-0.04em] text-white md:text-6xl"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              What we offer
            </h2>

            <div className="mt-14">
              {capabilities.map((capability, index) => (
                <div
                  key={capability}
                  data-edit-id={`t25-capability-${index + 1}`}
                  className="flex flex-col gap-4 border-t border-white/5 py-8 md:flex-row md:items-center md:gap-10"
                >
                  <span
                    className="text-[0.72rem] uppercase tracking-[0.28em] text-white/18"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className="flex-1 text-2xl text-white/86 md:text-3xl"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {capability}
                  </h3>
                </div>
              ))}
            </div>
          </TemplateContainer>
        </section>
      </main>
    </>
  );
}
