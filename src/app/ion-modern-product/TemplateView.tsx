"use client";

import SiteCustomizationRuntime from "@/components/SiteCustomizationRuntime";
import { TemplateContainer } from "@/components/template-primitives";

const features = [
  {
    title: "Autonomous driving level 3+",
    copy: "Neural highway assist, live route modeling, and adaptive safety systems work together with remarkable calm.",
  },
  {
    title: "900V charging architecture",
    copy: "Recover range in minutes with silicon-carbide efficiency and an overbuilt thermal system.",
  },
  {
    title: "Carbon fibre structure",
    copy: "A lightweight monocoque balances rigidity, silence, and long-range comfort in one platform.",
  },
  {
    title: "Adaptive aero surfaces",
    copy: "Active front and rear elements shape airflow in real time for stability at every speed band.",
  },
];

const systems = [
  "Design language shaped by wind tunnel data and sculpted restraint.",
  "Dual-motor torque vectoring with configurable dynamics profiles.",
  "A panoramic cockpit interface with ambient, low-glare instrumentation.",
  "Carbon-neutral production and second-life battery storage planning.",
];

export default function IonModernProductTemplate() {
  return (
    <>
      <SiteCustomizationRuntime />
      <main
        data-edit-id="t2-main"
        className="overflow-hidden bg-[#05070b] text-white"
      >
        <style
          dangerouslySetInnerHTML={{
            __html:
              "@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');",
          }}
        />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-10rem] top-[-8rem] h-[28rem] w-[28rem] rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute right-[-8rem] top-[10rem] h-[26rem] w-[26rem] rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute left-1/2 top-[30rem] h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#05070b]/70 backdrop-blur-xl">
          <TemplateContainer className="flex items-center justify-between py-4">
            <a
              href="#"
              data-edit-id="t2-brand"
              className="flex items-center gap-3 text-sm font-semibold tracking-[0.16em] text-white"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              ION Motors
            </a>
            <div
              className="hidden items-center gap-6 text-sm text-white/55 md:flex"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              <a href="#features" className="transition hover:text-white">Technology</a>
              <a href="#performance" className="transition hover:text-white">Performance</a>
              <a href="#system" className="transition hover:text-white">Design</a>
            </div>
          </TemplateContainer>
        </header>

        <section className="relative pt-32 md:pt-40">
          <TemplateContainer>
            <div className="mx-auto max-w-4xl text-center">
              <p
                data-edit-id="t2-eyebrow"
                className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-blue-300"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                2026 GT reservations now open
              </p>
              <h1
                data-edit-id="t2-title"
                className="mt-8 text-[clamp(3.8rem,9vw,7.8rem)] font-extrabold leading-[0.95] tracking-[-0.06em]"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Drive beyond
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  the horizon.
                </span>
              </h1>
              <p
                data-edit-id="t2-copy"
                className="mx-auto mt-8 max-w-2xl text-base leading-8 text-white/62 md:text-lg"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                1,020 horsepower, 680 km range, and a cabin shaped for silence. ION is a
                performance platform for drivers who refuse to choose between speed, comfort, and
                intelligence.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="#features"
                  data-edit-id="t2-cta-primary"
                  className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  Reserve now
                </a>
                <a
                  href="#system"
                  data-edit-id="t2-cta-secondary"
                  className="rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  Explore specs
                </a>
              </div>
            </div>

            <div className="mx-auto mt-20 grid max-w-5xl gap-px overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 md:grid-cols-4">
              {[
                ["0-100", "2.1 seconds"],
                ["680 km", "single charge"],
                ["1,020", "horsepower"],
                ["AWD", "dual motor"],
              ].map(([value, label], index) => (
                <div
                  key={label}
                  data-edit-id={`t2-stat-${index + 1}`}
                  className="bg-black/35 px-6 py-7 text-center"
                >
                  <div
                    className="text-3xl font-bold tracking-tight text-white"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    {value}
                  </div>
                  <div
                    className="mt-1 text-xs uppercase tracking-[0.2em] text-white/40"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </TemplateContainer>
        </section>

        <section id="features" className="relative pt-28 md:pt-36">
          <TemplateContainer>
            <div className="max-w-3xl">
              <p
                data-edit-id="t2-features-eyebrow"
                className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-300"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Technology
              </p>
              <h2
                data-edit-id="t2-features-title"
                className="mt-4 text-4xl font-bold tracking-[-0.05em] text-white md:text-6xl"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Engineered without compromise.
              </h2>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-2">
              {features.map((feature, index) => (
                <article
                  key={feature.title}
                  data-edit-id={`t2-feature-card-${index + 1}`}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm"
                >
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    0{index + 1}
                  </p>
                  <h3
                    data-edit-id={`t2-feature-title-${index + 1}`}
                    className="mt-4 text-2xl font-semibold text-white"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    data-edit-id={`t2-feature-copy-${index + 1}`}
                    className="mt-3 text-sm leading-7 text-white/60"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    {feature.copy}
                  </p>
                </article>
              ))}
            </div>
          </TemplateContainer>
        </section>

        <section id="performance" className="relative pt-28 md:pt-36">
          <TemplateContainer>
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <p
                  data-edit-id="t2-performance-eyebrow"
                  className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-300"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  Drive modes
                </p>
                <h2
                  data-edit-id="t2-performance-title"
                  className="mt-4 text-4xl font-bold tracking-[-0.05em] text-white md:text-5xl"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  Your drive, your rules.
                </h2>
                <p
                  data-edit-id="t2-performance-copy"
                  className="mt-5 text-base leading-8 text-white/62"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  Configure torque vectoring, regenerative braking, suspension bias, and launch
                  behavior through a software layer that feels as sharp as the chassis beneath it.
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-[#090b10] shadow-2xl shadow-blue-950/20">
                <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
                  <div className="h-3 w-3 rounded-full border border-red-500/50 bg-red-500/20" />
                  <div className="h-3 w-3 rounded-full border border-yellow-500/50 bg-yellow-500/20" />
                  <div className="h-3 w-3 rounded-full border border-green-500/50 bg-green-500/20" />
                  <span
                    className="ml-2 text-xs text-white/45"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    vehicle.config.ts
                  </span>
                </div>
                <pre
                  data-edit-id="t2-code"
                  className="overflow-x-auto p-5 text-sm leading-7 text-white/78"
                  style={{ fontFamily: "'SFMono-Regular', ui-monospace, monospace" }}
                >
{`const mode = new DriveMode("track");

mode.configure({
  torqueVector: "aggressive",
  regen: 0.95,
  suspension: {
    front: "firm",
    rear: "adaptive",
  },
  launch: { enabled: true, mode: "max" },
});`}
                </pre>
              </div>
            </div>
          </TemplateContainer>
        </section>

        <section id="system" className="relative pb-24 pt-28 md:pb-32 md:pt-36">
          <TemplateContainer>
            <div className="mb-10 border-b border-white/10 pb-8">
              <h2
                data-edit-id="t2-system-title"
                className="text-3xl font-bold tracking-[-0.04em] text-white md:text-5xl"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Every detail, intentional.
              </h2>
            </div>

            <div className="grid gap-px overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/10 md:grid-cols-2">
              {systems.map((copy, index) => (
                <div
                  key={copy}
                  data-edit-id={`t2-system-card-${index + 1}`}
                  className="bg-[#080a0f] p-8"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm text-white/50"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <p
                    className="mt-5 text-sm leading-7 text-white/62"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    {copy}
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
