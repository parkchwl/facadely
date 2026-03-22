"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import SiteCustomizationRuntime from "@/components/SiteCustomizationRuntime";
import { TemplateContainer } from "@/components/template-primitives";

const services = [
  "Architectural design",
  "Interior planning",
  "Material direction",
  "Spatial consulting",
  "Project oversight",
];

const serviceBlurb = [
  "Residences shaped with calm geometry, natural light, and durable warmth.",
  "Interior systems that make every room feel quieter, clearer, and more intentional.",
  "Material palettes built from oak, stone, limewash, and tactile restraint.",
  "Early stage guidance for developers, homeowners, and hospitality teams.",
  "Detailed coordination from concept board through final handover.",
];

const marqueeImages = [
  "/t18-mq1.png",
  "/t18-mq2.png",
  "/t18-mq3.png",
  "/t18-mq4.png",
  "/t18-mq5.png",
];

const stats = [
  { value: "42", label: "Completed projects" },
  { value: "11", label: "Live developments" },
  { value: "17", label: "Cities reached" },
  { value: "36", label: "Creative collaborators" },
];

export default function NordhavenArchitectureTemplate() {
  const [activeService, setActiveService] = useState(0);

  return (
    <>
      <SiteCustomizationRuntime />
      <main data-edit-id="t18-main" className="bg-[#fbfbf8] text-[#101010]">
        <style
          dangerouslySetInnerHTML={{
            __html:
              "@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&display=swap');",
          }}
        />

        <header className="sticky top-0 z-40 border-b border-black/10 bg-[#fbfbf8]/90 backdrop-blur">
          <TemplateContainer className="flex items-center justify-between py-4">
            <button
              data-edit-id="t18-menu"
              className="text-xs font-semibold uppercase tracking-[0.28em] text-[#202020]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Menu
            </button>
            <a
              href="#"
              data-edit-id="t18-brand"
              className="text-2xl tracking-[-0.08em]"
              style={{ fontFamily: "'Archivo Black', sans-serif" }}
            >
              N
            </a>
            <a
              href="#contact"
              data-edit-id="t18-cta-top"
              className="border-b border-black pb-1 text-xs font-semibold uppercase tracking-[0.24em]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Lets talk
            </a>
          </TemplateContainer>
        </header>

        <section className="overflow-hidden">
          <TemplateContainer className="pt-10 md:pt-16">
            <h1
              data-edit-id="t18-hero-wordmark"
              className="w-full bg-cover bg-center text-center text-[clamp(4rem,17vw,14rem)] uppercase leading-[0.8] tracking-[-0.08em] text-transparent [background-clip:text] [-webkit-background-clip:text]"
              style={{
                backgroundImage: "url('/t18-hero.png')",
                fontFamily: "'Archivo Black', sans-serif",
              }}
            >
              Nordhaven
            </h1>
          </TemplateContainer>

          <div
            data-edit-id="t18-hero-image"
            className="mt-[-1.5rem] h-[52vh] bg-cover bg-center md:h-[70vh]"
            style={{ backgroundImage: "url('/t18-hero.png')" }}
          />
        </section>

        <section data-edit-id="t18-about" className="border-t border-black/10 py-20 md:py-28">
          <TemplateContainer>
            <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
              <p
                data-edit-id="t18-about-eyebrow"
                className="text-xs font-semibold uppercase tracking-[0.28em] text-[#555]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                About us
              </p>
              <div>
                <h2
                  data-edit-id="t18-about-title"
                  className="max-w-5xl text-3xl uppercase leading-[1.05] tracking-[-0.04em] text-[#111] md:text-6xl"
                  style={{ fontFamily: "'Archivo Black', sans-serif" }}
                >
                  We design spaces that speak quietly, built on clarity, balance, and timeless
                  character.
                </h2>
                <div className="mt-10 grid gap-8 md:grid-cols-2">
                  <p
                    data-edit-id="t18-about-copy-1"
                    className="text-sm leading-7 text-[#333] md:text-base"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Nordhaven is an architecture and interiors studio rooted in Scandinavian
                    values: simplicity, light, function, and tactility. We shape residential,
                    hospitality, and cultural spaces with calm proportions and a clear sense of
                    place.
                  </p>
                  <p
                    data-edit-id="t18-about-copy-2"
                    className="text-sm leading-7 text-[#333] md:text-base"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Every commission begins with observation and dialogue. From the first material
                    conversation to the final detail, our work aims to feel grounded, durable, and
                    quietly memorable.
                  </p>
                </div>
                <a
                  href="#services"
                  data-edit-id="t18-about-cta"
                  className="mt-12 inline-block border-b border-black pb-1 text-xs font-semibold uppercase tracking-[0.24em]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Learn more
                </a>
              </div>
            </div>
          </TemplateContainer>
        </section>

        <section className="border-t border-black/10">
          <TemplateContainer className="px-0 md:px-10">
            <div className="grid grid-cols-2 border-b border-black/10 md:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  data-edit-id={`t18-stat-${index + 1}`}
                  className="border-r border-black/10 px-6 py-12 last:border-r-0 md:px-8 md:py-16"
                >
                  <div
                    className="text-5xl tracking-[-0.08em] text-[#101010] md:text-7xl"
                    style={{ fontFamily: "'Archivo Black', sans-serif" }}
                  >
                    {stat.value}
                  </div>
                  <p
                    className="mt-3 text-xs uppercase tracking-[0.16em] text-[#666]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </TemplateContainer>
        </section>

        <section className="overflow-hidden border-t border-black/10 bg-[#f1f1ec] py-3">
          <div className="flex min-w-max gap-3 px-3 [animation:facadely-marquee-26s_linear_infinite] hover:[animation-play-state:paused]">
            {[...marqueeImages, ...marqueeImages].map((src, index) => (
              <img
                key={`${src}-${index}`}
                src={src}
                alt={`Nordhaven project ${index + 1}`}
                className="h-40 w-60 shrink-0 object-cover md:h-64 md:w-96"
              />
            ))}
          </div>
        </section>

        <section data-edit-id="t18-services" id="services" className="py-20 md:py-28">
          <TemplateContainer>
            <div className="grid gap-10 lg:grid-cols-[220px_1fr_0.8fr]">
              <p
                data-edit-id="t18-services-eyebrow"
                className="text-xs font-semibold uppercase tracking-[0.28em] text-[#555]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Services
              </p>
              <div className="space-y-4">
                {services.map((service, index) => {
                  const isActive = activeService === index;
                  return (
                    <button
                      key={service}
                      data-edit-id={`t18-service-item-${index + 1}`}
                      onMouseEnter={() => setActiveService(index)}
                      onFocus={() => setActiveService(index)}
                      className={`block text-left text-2xl tracking-[-0.04em] transition md:text-5xl ${
                        isActive ? "text-[#111]" : "text-[#a2a2a2]"
                      }`}
                      style={{ fontFamily: "'Archivo Black', sans-serif" }}
                    >
                      {service}
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-col justify-between gap-8">
                <p
                  data-edit-id="t18-services-copy"
                  className="max-w-sm text-base leading-8 text-[#353535]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {serviceBlurb[activeService]}
                </p>
                <a
                  href="#contact"
                  data-edit-id="t18-services-cta"
                  className="w-fit border-b border-black pb-1 text-xs font-semibold uppercase tracking-[0.24em]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Start a project
                </a>
              </div>
            </div>
          </TemplateContainer>
        </section>

        <style
          dangerouslySetInnerHTML={{
            __html:
              "@keyframes facadely-marquee{0%{transform:translateX(0)}100%{transform:translateX(calc(-50% - 0.375rem))}}",
          }}
        />
      </main>
    </>
  );
}
