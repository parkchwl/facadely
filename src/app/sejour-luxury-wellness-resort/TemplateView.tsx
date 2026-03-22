"use client";
/* eslint-disable @next/next/no-img-element */

import SiteCustomizationRuntime from "@/components/SiteCustomizationRuntime";
import { TemplateContainer } from "@/components/template-primitives";

const properties = [
  {
    name: "Cliff Pavilion",
    location: "Uluwatu, Bali",
    description: "An open-air pavilion with private infinity pool, natural stone finishes, and uninterrupted sunset views.",
    image: "/t8-hero.png",
  },
  {
    name: "Ocean Suite",
    location: "Cape Town, South Africa",
    description: "A panoramic suite with wraparound terrace, freestanding bath, and quiet walnut interiors.",
    image: "/t8-room.png",
  },
];

const experiences = [
  {
    title: "Holistic Spa",
    description: "Traditional rituals paired with modern wellness science, set among volcanic stone and warm water.",
    image: "/t8-spa.png",
  },
  {
    title: "Private Dining",
    description: "Cliff-edge dinners timed to the sunset with seasonal tasting menus and ocean air.",
  },
  {
    title: "Dawn Yoga",
    description: "Guided sunrise sessions followed by pressed juices and a botanical breakfast ritual.",
  },
];

export default function SejourLuxuryWellnessResortTemplate() {
  return (
    <>
      <SiteCustomizationRuntime />
      <main data-edit-id="t8-main" className="bg-[#faf8f5] text-[#2a2522]">
        <style
          dangerouslySetInnerHTML={{
            __html:
              "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');",
          }}
        />

        <header className="fixed inset-x-0 top-0 z-40 border-b border-[#e8e0d4]/50 bg-[#faf8f5]/75 backdrop-blur-xl">
          <TemplateContainer className="flex items-center justify-between py-5">
            <a
              href="#"
              data-edit-id="t8-brand"
              className="text-xl tracking-[0.22em] text-[#1a3a3a]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              SEJOUR
            </a>
            <nav
              className="hidden items-center gap-8 text-[0.76rem] uppercase tracking-[0.2em] text-[#8a7e72] md:flex"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <a href="#properties" className="transition hover:text-[#2a2522]">Properties</a>
              <a href="#experiences" className="transition hover:text-[#2a2522]">Experiences</a>
              <a href="#story" className="transition hover:text-[#2a2522]">Our story</a>
            </nav>
            <a
              href="#book"
              data-edit-id="t8-top-cta"
              className="bg-[#1a3a3a] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#102828]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Reserve
            </a>
          </TemplateContainer>
        </header>

        <section className="relative min-h-screen">
          <div
            data-edit-id="t8-hero-image"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/t8-hero.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1512]/65 via-[#1a1512]/12 to-transparent" />

          <TemplateContainer className="relative z-10 flex min-h-screen flex-col justify-end pb-16 pt-40 md:pb-24">
            <p
              data-edit-id="t8-eyebrow"
              className="text-[0.72rem] font-medium uppercase tracking-[0.5em] text-white/60"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              A sanctuary above the sea
            </p>
            <h1
              data-edit-id="t8-title"
              className="mt-6 max-w-3xl text-[clamp(3.8rem,8vw,7.8rem)] leading-[1.04] tracking-[-0.04em] text-white"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Where the horizon
              <br />
              becomes home.
            </h1>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#properties"
                data-edit-id="t8-cta-primary"
                className="bg-white px-8 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#1a3a3a]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Explore properties
              </a>
              <a
                href="#book"
                data-edit-id="t8-cta-secondary"
                className="border border-white/30 px-8 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white/10"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Book a stay
              </a>
            </div>
          </TemplateContainer>
        </section>

        <section id="story" className="py-24 md:py-32">
          <TemplateContainer>
            <div className="mx-auto max-w-3xl text-center">
              <p
                data-edit-id="t8-story-eyebrow"
                className="text-[0.72rem] font-medium uppercase tracking-[0.5em] text-[#1a3a3a]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                The Sejour philosophy
              </p>
              <h2
                data-edit-id="t8-story-title"
                className="mt-8 text-3xl leading-[1.28] tracking-[-0.02em] text-[#2a2522] md:text-5xl"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                We compose environments where stillness becomes the greatest luxury.
              </h2>
              <p
                data-edit-id="t8-story-copy"
                className="mx-auto mt-8 max-w-xl text-base leading-8 text-[#8a7e72]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Each destination is shaped around intentional quiet, tactile materials, and a sense
                of time moving slower than the rest of the world.
              </p>
            </div>
          </TemplateContainer>
        </section>

        <section className="border-y border-[#e8e0d4]">
          <TemplateContainer>
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                ["2018", "established"],
                ["4", "properties"],
                ["12", "countries"],
                ["98%", "guest satisfaction"],
              ].map(([value, label], index) => (
                <div
                  key={label}
                  data-edit-id={`t8-stat-${index + 1}`}
                  className={`py-10 text-center ${index < 3 ? "border-r border-[#e8e0d4]" : ""}`}
                >
                  <p
                    className="text-4xl tracking-[-0.03em] text-[#1a3a3a] md:text-5xl"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {value}
                  </p>
                  <p
                    className="mt-2 text-[0.68rem] uppercase tracking-[0.24em] text-[#b5aa9c]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </TemplateContainer>
        </section>

        <section id="properties" className="py-24 md:py-32">
          <TemplateContainer>
            <p
              data-edit-id="t8-properties-eyebrow"
              className="text-[0.72rem] font-medium uppercase tracking-[0.5em] text-[#1a3a3a]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Properties
            </p>
            <h2
              data-edit-id="t8-properties-title"
              className="mt-4 text-4xl tracking-[-0.03em] text-[#2a2522] md:text-6xl"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Curated sanctuaries
            </h2>

            <div className="mt-14 grid gap-14">
              {properties.map((property, index) => (
                <div
                  key={property.name}
                  data-edit-id={`t8-property-${index + 1}`}
                  className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center"
                >
                  <img
                    src={property.image}
                    alt={property.name}
                    className={`aspect-[4/3] w-full object-cover ${index % 2 === 1 ? "lg:order-2" : ""}`}
                  />
                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <p
                      className="text-[0.68rem] uppercase tracking-[0.28em] text-[#b5aa9c]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {property.location}
                    </p>
                    <h3
                      data-edit-id={`t8-property-title-${index + 1}`}
                      className="mt-4 text-3xl tracking-[-0.03em] text-[#2a2522] md:text-4xl"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {property.name}
                    </h3>
                    <p
                      data-edit-id={`t8-property-copy-${index + 1}`}
                      className="mt-5 text-sm leading-8 text-[#8a7e72]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {property.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TemplateContainer>
        </section>

        <section id="experiences" className="bg-[#f3ede4] py-24 md:py-32">
          <TemplateContainer>
            <p
              data-edit-id="t8-experiences-eyebrow"
              className="text-[0.72rem] font-medium uppercase tracking-[0.5em] text-[#1a3a3a]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Experiences
            </p>
            <h2
              data-edit-id="t8-experiences-title"
              className="mt-4 text-4xl tracking-[-0.03em] text-[#2a2522] md:text-6xl"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Beyond the room
            </h2>

            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {experiences.map((experience, index) => (
                <article
                  key={experience.title}
                  data-edit-id={`t8-experience-${index + 1}`}
                  className="overflow-hidden bg-[#faf8f5]"
                >
                  {experience.image ? (
                    <img
                      src={experience.image}
                      alt={experience.title}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center bg-[#1a3a3a] text-center">
                      <p
                        className="text-4xl tracking-[-0.03em] text-white/20"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {experience.title}
                      </p>
                    </div>
                  )}
                  <div className="p-8">
                    <h3
                      data-edit-id={`t8-experience-title-${index + 1}`}
                      className="text-2xl tracking-[-0.02em] text-[#2a2522]"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {experience.title}
                    </h3>
                    <p
                      data-edit-id={`t8-experience-copy-${index + 1}`}
                      className="mt-3 text-sm leading-7 text-[#8a7e72]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {experience.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </TemplateContainer>
        </section>
      </main>
    </>
  );
}
