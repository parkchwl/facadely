"use client";
/* eslint-disable @next/next/no-img-element */

import SiteCustomizationRuntime from "@/components/SiteCustomizationRuntime";
import { TemplateContainer } from "@/components/template-primitives";

const products = [
  {
    name: "Balancing Facial Oil",
    subtitle: "Jojoba + Rosemary",
    price: "$48",
    description: "A lightweight daily oil that restores moisture balance while calming sensitive texture.",
  },
  {
    name: "Gentle Daily Cleanser",
    subtitle: "Aloe Vera + Oat",
    price: "$36",
    description: "A cloud-soft cleanser for morning and evening use, built to respect the skin barrier.",
  },
  {
    name: "Hydration Serum",
    subtitle: "Hyaluronic Acid + Kelp",
    price: "$52",
    description: "Multi-weight hydration with mineral-rich kelp for elasticity, glow, and long wear comfort.",
  },
];

const values = [
  "Clean formulas published in full.",
  "Traceable sourcing from farm to bottle.",
  "Refillable glass system with lower waste.",
];

export default function VerdantEcommerceEditorialTemplate() {
  return (
    <>
      <SiteCustomizationRuntime />
      <main data-edit-id="t26-main" className="bg-[#fdfbf7] text-[#3d3d3d]">
        <style
          dangerouslySetInnerHTML={{
            __html:
              "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap');",
          }}
        />

        <header className="fixed inset-x-0 top-0 z-40 border-b border-[#e8e2d8]/60 bg-[#fdfbf7]/80 backdrop-blur-xl">
          <TemplateContainer className="flex items-center justify-between py-4">
            <a
              href="#"
              data-edit-id="t26-brand"
              className="flex items-center gap-2.5 text-sm font-semibold tracking-[0.14em] text-[#5a7a5c]"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              VERDANT
            </a>
            <nav
              className="hidden items-center gap-7 text-sm text-[#8b8578] md:flex"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              <a href="#products" className="transition hover:text-[#3d3d3d]">Products</a>
              <a href="#ingredients" className="transition hover:text-[#3d3d3d]">Ingredients</a>
              <a href="#philosophy" className="transition hover:text-[#3d3d3d]">Philosophy</a>
            </nav>
            <a
              href="#products"
              data-edit-id="t26-top-cta"
              className="rounded-full bg-[#5a7a5c] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#4a6a4c]"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Shop now
            </a>
          </TemplateContainer>
        </header>

        <section className="pt-32 md:pt-40">
          <TemplateContainer>
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <p
                  data-edit-id="t26-eyebrow"
                  className="text-xs font-semibold uppercase tracking-[0.35em] text-[#84a98c]"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  Organic skincare · est. 2020
                </p>
                <h1
                  data-edit-id="t26-title"
                  className="mt-6 text-[clamp(3.6rem,7vw,6.8rem)] leading-[1.05] tracking-[-0.05em] text-[#2c3e2d]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Nature&apos;s wisdom,
                  <br />
                  bottled with
                  <br />
                  <span className="text-[#84a98c]">intention.</span>
                </h1>
                <p
                  data-edit-id="t26-copy"
                  className="mt-8 max-w-md text-base leading-8 text-[#8b8578]"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  Verdant creates plant-powered skincare from ethically sourced botanicals. Every
                  formula is a conversation between calm science and the natural world.
                </p>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#products"
                    data-edit-id="t26-cta-primary"
                    className="rounded-full bg-[#5a7a5c] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#4a6a4c]"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    Discover the collection
                  </a>
                  <a
                    href="#philosophy"
                    data-edit-id="t26-cta-secondary"
                    className="rounded-full border border-[#d4cfc5] px-6 py-3 text-sm font-semibold text-[#5a7a5c] transition hover:bg-[#f0ece3]"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    Our story
                  </a>
                </div>
              </div>

              <img
                data-edit-id="t26-hero-image"
                src="/t6-hero.png"
                alt="Verdant hero product shot"
                className="w-full rounded-[2rem] object-cover"
              />
            </div>
          </TemplateContainer>
        </section>

        <section className="py-20">
          <TemplateContainer>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] border border-[#e8e2d8] bg-[#e8e2d8] md:grid-cols-4">
              {[
                ["97%", "natural-origin ingredients"],
                ["100%", "recyclable packaging"],
                ["0", "animal testing"],
                ["12", "botanical actives"],
              ].map(([value, label], index) => (
                <div
                  key={label}
                  data-edit-id={`t26-stat-${index + 1}`}
                  className="bg-[#fdfbf7] p-8 text-center"
                >
                  <p
                    className="text-4xl tracking-[-0.04em] text-[#5a7a5c] md:text-5xl"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {value}
                  </p>
                  <p
                    className="mt-2 text-xs uppercase tracking-[0.2em] text-[#b0a99a]"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </TemplateContainer>
        </section>

        <section id="products" className="py-20 md:py-28">
          <TemplateContainer>
            <div className="text-center">
              <p
                data-edit-id="t26-products-eyebrow"
                className="text-xs font-semibold uppercase tracking-[0.35em] text-[#84a98c]"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                The collection
              </p>
              <h2
                data-edit-id="t26-products-title"
                className="mt-4 text-4xl tracking-[-0.04em] text-[#2c3e2d] md:text-6xl"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Curated essentials
              </h2>
            </div>

            <div className="mt-12 flex justify-center">
              <img
                data-edit-id="t26-products-image"
                src="/t6-product.png"
                alt="Verdant collection"
                className="max-w-lg rounded-[2rem] object-cover"
              />
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {products.map((product, index) => (
                <article
                  key={product.name}
                  data-edit-id={`t26-product-${index + 1}`}
                  className="rounded-2xl border border-[#e8e2d8] bg-white/60 p-8"
                >
                  <p
                    className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#84a98c]"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    {product.subtitle}
                  </p>
                  <h3
                    data-edit-id={`t26-product-title-${index + 1}`}
                    className="mt-4 text-2xl text-[#2c3e2d]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {product.name}
                  </h3>
                  <p
                    data-edit-id={`t26-product-copy-${index + 1}`}
                    className="mt-3 text-sm leading-7 text-[#8b8578]"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    {product.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-[#e8e2d8] pt-5">
                    <span
                      className="text-2xl text-[#2c3e2d]"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {product.price}
                    </span>
                    <button
                      data-edit-id={`t26-product-cta-${index + 1}`}
                      className="rounded-full bg-[#5a7a5c] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white"
                      style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                      Add to cart
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </TemplateContainer>
        </section>

        <section id="ingredients" className="py-8">
          <TemplateContainer>
            <div className="relative overflow-hidden rounded-[2rem]">
              <img
                data-edit-id="t26-lifestyle-image"
                src="/t6-lifestyle.png"
                alt="Verdant lifestyle"
                className="aspect-[2/1] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#2c3e2d]/45 to-transparent" />
              <div className="absolute bottom-0 left-0 p-10 md:p-14">
                <h2
                  data-edit-id="t26-lifestyle-title"
                  className="text-3xl tracking-[-0.04em] text-white md:text-5xl"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Ritual over routine.
                </h2>
                <p
                  data-edit-id="t26-lifestyle-copy"
                  className="mt-4 max-w-md text-sm leading-7 text-white/75"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  Skincare should feel like a daily return to yourself: quiet, tactile, and
                  intentionally unhurried.
                </p>
              </div>
            </div>
          </TemplateContainer>
        </section>

        <section id="philosophy" className="bg-[#f4f0e8] py-20 md:py-28">
          <TemplateContainer>
            <div className="text-center">
              <p
                data-edit-id="t26-values-eyebrow"
                className="text-xs font-semibold uppercase tracking-[0.35em] text-[#84a98c]"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Our philosophy
              </p>
              <h2
                data-edit-id="t26-values-title"
                className="mt-4 text-4xl tracking-[-0.04em] text-[#2c3e2d] md:text-6xl"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Better for you. Better for the planet.
              </h2>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {values.map((value, index) => (
                <div
                  key={value}
                  data-edit-id={`t26-value-${index + 1}`}
                  className="rounded-2xl border border-[#e0d8cc] bg-[#fdfbf7] p-8"
                >
                  <p
                    className="text-sm leading-7 text-[#6f6a60]"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    {value}
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
