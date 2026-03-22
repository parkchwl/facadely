"use client";
/* eslint-disable @next/next/no-img-element */

import SiteCustomizationRuntime from "@/components/SiteCustomizationRuntime";
import { TemplateContainer } from "@/components/template-primitives";

export default function DeColoradoRealEstateTemplate() {
  return (
    <>
      <SiteCustomizationRuntime />
      <main data-edit-id="t20-main" className="bg-[#f4f0e8] text-[#2a2d24]">
        <style
          dangerouslySetInnerHTML={{
            __html:
              "@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500;600;700&display=swap');.facadely-script{font-family:'Instrument Serif',serif;font-style:italic;}",
          }}
        />

        <section data-edit-id="t20-top" className="min-h-screen px-4 pb-24 pt-6 md:px-8 md:pb-28">
          <TemplateContainer className="px-0">
            <header className="flex items-center justify-between pb-12">
              <a
                href="#"
                data-edit-id="t20-brand"
                className="text-xl font-semibold tracking-tight"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                De Colorado
              </a>
              <div className="flex items-center gap-4">
                <a
                  href="#contact"
                  data-edit-id="t20-header-cta"
                  className="rounded-full border border-[#2a2d24] px-6 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition hover:bg-[#2a2d24] hover:text-white"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  Contact
                </a>
              </div>
            </header>

            <h1
              data-edit-id="t20-title"
              className="max-w-[920px] text-[clamp(4rem,10vw,8.6rem)] leading-[0.9] tracking-[-0.05em]"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Find <span className="facadely-script text-[1.34em] text-[#52524b]">your</span>
              <span className="block">dream house</span>
            </h1>

            <div className="mt-14 flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
              <div className="w-full lg:w-[64%]">
                <img
                  data-edit-id="t20-top-image"
                  src="/t20-mansion.png"
                  alt="Luxury mansion exterior"
                  className="aspect-[4/3] w-full rounded-[2rem] object-cover"
                />
              </div>

              <div className="flex w-full flex-col gap-10 lg:w-[32%]">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
                  <p
                    data-edit-id="t20-address"
                    className="whitespace-pre-line text-sm leading-7 text-[#53574d]"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    101 Dallas Street
                    {"\n"}Chicago, USA
                    {"\n"}1002
                  </p>
                  <div className="space-y-4">
                    <p
                      data-edit-id="t20-intro-title"
                      className="text-sm font-semibold uppercase tracking-[0.24em]"
                      style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                      Luxury real estate
                    </p>
                    <p
                      data-edit-id="t20-intro-copy"
                      className="text-sm leading-7 text-[#53574d]"
                      style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                      Discover residences where architectural grandeur and tactile interiors meet.
                      We curate landmark homes for buyers who want beauty, privacy, and enduring
                      value in one address.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="#contact"
                    data-edit-id="t20-cta-primary"
                    className="rounded-full bg-[#3d4339] px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:opacity-85"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    Contact us now
                  </a>
                  <a
                    href="#collection"
                    data-edit-id="t20-cta-secondary"
                    className="text-sm font-semibold text-[#53574d] transition hover:text-[#1d1f18]"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    Explore all properties
                  </a>
                </div>
              </div>
            </div>
          </TemplateContainer>
        </section>

        <section
          data-edit-id="t20-bottom"
          id="collection"
          className="-mt-8 rounded-t-[2.6rem] bg-[#3f4439] px-4 py-24 text-[#f4f0e8] md:px-8 md:py-28"
        >
          <TemplateContainer className="px-0">
            <h2
              data-edit-id="t20-bottom-title"
              className="max-w-[1100px] text-[clamp(2.8rem,7vw,6.5rem)] leading-[1.03] tracking-[-0.05em]"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              <span className="facadely-script mr-3 text-[1.32em]">We</span>
              create remarkable neighborhoods that invite exploration and discovery.
            </h2>

            <div className="mt-16 flex flex-col-reverse gap-12 lg:flex-row lg:items-end lg:justify-between">
              <div className="w-full lg:w-[44%]">
                <img
                  data-edit-id="t20-bottom-image"
                  src="/t20-midcentury.png"
                  alt="Modern luxury residence"
                  className="aspect-[4/3] w-full rounded-[2rem] object-cover"
                />
              </div>

              <div className="flex w-full flex-col gap-6 lg:w-[48%] lg:pb-14">
                <p
                  data-edit-id="t20-bottom-copy-1"
                  className="max-w-xl text-sm leading-8 text-[#ece5d9] md:text-base"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  We are committed to purposeful design and development that fosters positive
                  change, long-term value, and a richer experience of home for every resident.
                </p>
                <p
                  data-edit-id="t20-bottom-copy-2"
                  className="max-w-xl text-sm leading-8 text-[#d7d0c4] md:text-base"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  Each property is chosen for proportion, light, and neighborhood potential,
                  helping our clients invest in places that feel exceptional from the first visit.
                </p>
                <a
                  href="#contact"
                  data-edit-id="t20-bottom-cta"
                  className="mt-4 inline-flex w-fit rounded-full border border-[#f4f0e8]/60 px-8 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#f4f0e8] transition hover:bg-[#f4f0e8] hover:text-[#3f4439]"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  Contact us
                </a>
              </div>
            </div>
          </TemplateContainer>
        </section>
      </main>
    </>
  );
}
