import SiteCustomizationRuntime from "@/components/SiteCustomizationRuntime";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <SiteCustomizationRuntime />
      <main data-edit-id="t6-main" className="min-h-screen bg-black overflow-hidden relative selection:bg-indigo-500/30">
        {/* Abstract Background Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-[150px] pointer-events-none" />

      {/* Navigation Layer */}
      <nav data-edit-id="t6-nav" className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div data-edit-id="t6-brand" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span data-edit-id="t6-brand-text" className="text-sm font-bold tracking-tight text-white">Velocity</span>
          </div>

          <div data-edit-id="t6-nav-menu" className="hidden md:flex items-center gap-8 text-[13px] font-medium text-zinc-400">
            <a data-edit-id="t6-nav-link-features" href="#features" className="hover:text-white transition-colors">Features</a>
            <a data-edit-id="t6-nav-link-developers" href="#developers" className="hover:text-white transition-colors">Developers</a>
            <a data-edit-id="t6-nav-link-pricing" href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a data-edit-id="t6-nav-link-company" href="#company" className="hover:text-white transition-colors">Company</a>
          </div>

          <div data-edit-id="t6-nav-actions" className="flex items-center gap-4">
            <Link data-edit-id="t6-nav-login" href="/login" className="text-[13px] font-medium text-zinc-300 hover:text-white transition-colors hidden sm:block">Log in</Link>
            <button data-edit-id="t6-nav-start" className="h-9 px-4 rounded-full bg-white text-black text-[13px] font-semibold hover:bg-zinc-200 transition-colors shadow-glow-sm">
              Start Building
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section data-edit-id="t6-hero" className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        <div data-edit-id="t6-hero-badge" className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-pointer">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span data-edit-id="t6-hero-badge-text" className="text-xs font-medium text-zinc-300">Introducing Velocity Engine 2.0</span>
          <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>

        <h1 data-edit-id="t6-hero-title" className="text-5xl md:text-7xl lg:text-[80px] font-bold tracking-tighter text-white leading-[1.1] text-balance max-w-5xl mb-6">
          The velocity of <br className="hidden md:block" />
          <span data-edit-id="t6-hero-title-emphasis" className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-600">
            limitless creation.
          </span>
        </h1>

        <p data-edit-id="t6-hero-copy" className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 text-balance leading-relaxed">
          Design, build, and scale exceptional web applications at the speed of thought.
          The ultimate platform for modern engineering teams.
        </p>

        <div data-edit-id="t6-hero-cta-group" className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button data-edit-id="t6-hero-cta-primary" className="w-full sm:w-auto h-12 px-8 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-glow-md flex items-center justify-center gap-2">
            Start Deploying
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
          <button data-edit-id="t6-hero-cta-secondary" className="w-full sm:w-auto h-12 px-8 rounded-full bg-zinc-900 border border-white/10 text-white text-sm font-medium hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Read the Docs
          </button>
        </div>
      </section>

      {/* Abstract Dashboard Mockup */}
      <section data-edit-id="t6-dashboard" className="relative max-w-6xl mx-auto px-6 pb-32 z-10">
        <div data-edit-id="t6-dashboard-shell" className="relative rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-2xl shadow-2xl overflow-hidden ring-1 ring-white/5">
          {/* Mockup Header */}
          <div data-edit-id="t6-dashboard-header" className="h-12 border-b border-white/5 flex items-center px-4 gap-2 bg-zinc-900/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
            </div>
            <div data-edit-id="t6-dashboard-status" className="mx-auto px-12 py-1.5 rounded-md bg-black/50 border border-white/5 text-[10px] text-zinc-500 font-mono flex items-center gap-2">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span data-edit-id="t6-dashboard-status-text">Deploying to production...</span>
            </div>
          </div>

          {/* Mockup Content */}
          <div data-edit-id="t6-dashboard-preview" className="aspect-[16/9] md:aspect-[21/9] bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center relative opacity-40 mix-blend-luminosity">
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
          </div>

          {/* Floating UI Elements */}
          <div data-edit-id="t6-dashboard-toast" className="absolute bottom-8 left-8 p-4 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md shadow-2xl flex items-center gap-4 hidden md:flex animate-pulse">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <p data-edit-id="t6-dashboard-toast-title" className="text-xs font-semibold text-white">Build Successful</p>
              <p data-edit-id="t6-dashboard-toast-copy" className="text-[10px] text-zinc-400">Ready in 234ms</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Marquee */}
      <section data-edit-id="t6-trusted" className="py-12 border-y border-white/5 bg-zinc-950/30 relative z-10 w-full overflow-hidden">
        <p data-edit-id="t6-trusted-heading" className="text-center text-xs font-semibold text-zinc-600 tracking-widest uppercase mb-8">Trusted by innovative teams worldwide</p>
        <div data-edit-id="t6-trusted-track" className="flex w-fit animate-[marquee_20s_linear_infinite] hover:[animation-play-state:paused] gap-16 px-8 items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          <div data-edit-id="t6-trusted-logo-vercel" className="text-2xl font-bold font-serif italic text-white/50 hover:text-white transition-colors">Vercel</div>
          <div data-edit-id="t6-trusted-logo-linear" className="text-2xl font-black tracking-tighter text-white/50 hover:text-white transition-colors">LINEAR</div>
          <div className="text-2xl font-bold flex items-center gap-1.5 text-white/50 hover:text-white transition-colors"><span className="w-5 h-5 bg-current rounded-md inline-block"></span><span data-edit-id="t6-trusted-logo-notion">Notion</span></div>
          <div data-edit-id="t6-trusted-logo-raycast" className="text-2xl font-extrabold tracking-widest text-white/50 hover:text-white transition-colors">RAYCAST</div>
          <div data-edit-id="t6-trusted-logo-framer" className="text-2xl font-bold text-white/50 hover:text-white transition-colors">Framer</div>

          <div className="text-2xl font-bold font-serif italic text-white/50 hover:text-white transition-colors">Vercel</div>
          <div className="text-2xl font-black tracking-tighter text-white/50 hover:text-white transition-colors">LINEAR</div>
          <div className="text-2xl font-bold flex items-center gap-1.5 text-white/50 hover:text-white transition-colors"><span className="w-5 h-5 bg-current rounded-md inline-block"></span> Notion</div>
          <div className="text-2xl font-extrabold tracking-widest text-white/50 hover:text-white transition-colors">RAYCAST</div>
          <div className="text-2xl font-bold text-white/50 hover:text-white transition-colors">Framer</div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section id="features" data-edit-id="t6-features" className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div data-edit-id="t6-features-header" className="text-center max-w-3xl mx-auto mb-20">
          <h2 data-edit-id="t6-features-title" className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">Built for the next generation of the web.</h2>
          <p data-edit-id="t6-features-copy" className="text-zinc-400 text-lg md:text-xl leading-relaxed text-balance">Everything you need to build stunning interfaces, robust backend logic, and scalable infrastructure, all in one place.</p>
        </div>

        <div data-edit-id="t6-features-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature Card 1 (Large) */}
          <div data-edit-id="t6-feature-card-render" className="md:col-span-2 rounded-3xl bg-zinc-900/50 border border-white/5 p-8 relative overflow-hidden group hover:bg-zinc-900/80 hover:border-white/10 transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] group-hover:bg-indigo-500/20 transition-colors" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-sm group-hover:bg-white/10 transition-colors">
                <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <h3 data-edit-id="t6-feature-card-render-title" className="text-xl font-bold text-white mb-3">Instant Serverless Rendering</h3>
                <p data-edit-id="t6-feature-card-render-copy" className="text-sm text-zinc-400 leading-relaxed max-w-md">Push your code and watch it distribute globally within seconds. No cold starts, no complex infrastructure management.</p>
              </div>
            </div>
            {/* Visual element */}
            <div className="absolute -right-8 -bottom-8 w-64 h-48 bg-black rounded-tl-2xl border-t border-l border-white/10 shadow-2xl p-4 hidden md:block group-hover:-translate-y-2 group-hover:-translate-x-2 transition-transform duration-500">
              <div className="space-y-3 mt-2">
                <div className="h-2 w-3/4 bg-zinc-800 rounded-full" />
                <div className="h-2 w-1/2 bg-zinc-800 rounded-full" />
                <div className="h-2 w-full bg-indigo-500/50 rounded-full shadow-glow-sm" />
              </div>
            </div>
          </div>

          {/* Feature Card 2 */}
          <div data-edit-id="t6-feature-card-security" className="rounded-3xl bg-zinc-900/50 border border-white/5 p-8 relative overflow-hidden group hover:bg-zinc-900/80 hover:border-white/10 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-sm group-hover:bg-white/10 transition-colors">
              <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h3 data-edit-id="t6-feature-card-security-title" className="text-xl font-bold text-white mb-3">Enterprise Security</h3>
            <p data-edit-id="t6-feature-card-security-copy" className="text-sm text-zinc-400 leading-relaxed">End-to-end encryption and compliance out of the box, keeping your user data locked down.</p>
          </div>

          {/* Feature Card 3 */}
          <div data-edit-id="t6-feature-card-database" className="rounded-3xl bg-zinc-900/50 border border-white/5 p-8 relative overflow-hidden group hover:bg-zinc-900/80 hover:border-white/10 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-sm group-hover:bg-white/10 transition-colors">
              <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
            </div>
            <h3 data-edit-id="t6-feature-card-database-title" className="text-xl font-bold text-white mb-3">Edge Databases</h3>
            <p data-edit-id="t6-feature-card-database-copy" className="text-sm text-zinc-400 leading-relaxed">Read and write data at the edge. Single-digit millisecond latency worldwide.</p>
          </div>

          {/* Feature Card 4 (Large) */}
          <div data-edit-id="t6-feature-card-frameworks" className="md:col-span-2 rounded-3xl bg-zinc-900/50 border border-white/5 p-8 relative overflow-hidden group hover:bg-zinc-900/80 hover:border-white/10 transition-all duration-300 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-sm group-hover:bg-white/10 transition-colors">
                <svg className="w-6 h-6 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              </div>
              <h3 data-edit-id="t6-feature-card-frameworks-title" className="text-xl font-bold text-white mb-3">Zero-Config Frameworks</h3>
              <p data-edit-id="t6-feature-card-frameworks-copy" className="text-sm text-zinc-400 leading-relaxed">Next.js, React, Svelte, Vue—we auto-detect your framework and optimize builds automatically.</p>
            </div>
            <div data-edit-id="t6-feature-card-frameworks-snippet" className="flex-1 w-full bg-black rounded-xl border border-white/10 p-5 font-mono text-[12px] text-zinc-300 shadow-inner overflow-hidden group-hover:border-white/20 transition-colors">
              <div className="flex gap-2 mb-4 border-b border-white/5 pb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <div data-edit-id="t6-feature-card-frameworks-snippet-content" className="space-y-1.5 opacity-90">
                <p><span className="text-indigo-400">const</span> <span className="text-blue-300">app</span> = <span className="text-fuchsia-400">new</span> <span className="text-emerald-300">Velocity</span>();</p>
                <p>app.<span className="text-blue-300">deploy</span>({`{`}</p>
                <p className="pl-4">framework: <span className="text-amber-300">&apos;next.js&apos;</span>,</p>
                <p className="pl-4">region: <span className="text-amber-300">&apos;global&apos;</span></p>
                <p>{`}`});</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section data-edit-id="t6-testimonials" className="py-24 border-t border-white/5 bg-zinc-950/20 relative z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h2 data-edit-id="t6-testimonials-title" className="text-3xl font-bold text-white mb-16 text-center tracking-tight">Loved by top engineering teams</h2>
          <div data-edit-id="t6-testimonials-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: "sarah",
                name: "Sarah Jenkins",
                role: "CTO at StartupX",
                text: "We migrated our entire infrastructure to Velocity in one weekend. The developer experience is simply unmatched in the industry."
              },
              {
                id: "david",
                name: "David Chen",
                role: "Lead Frontend Engineer",
                text: "The zero-config deployments have saved us hundreds of hours. We just push code and incredible value gets delivered to our users."
              },
              {
                id: "elena",
                name: "Elena Rodriguez",
                role: "Founder, ScaleApp",
                text: "The speed of the global edge network is unbelievable. Our TTFB dropped by 80% overnight, massively boosting our conversion rates."
              }
            ].map((t) => (
              <div data-edit-id={`t6-testimonial-card-${t.id}`} key={t.id} className="p-8 rounded-3xl bg-zinc-900/40 border border-white/5 relative hover:bg-zinc-900/60 hover:-translate-y-1 transition-all duration-300 shadow-sm">
                <svg className="w-8 h-8 text-white/5 absolute top-6 right-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                <p data-edit-id={`t6-testimonial-quote-${t.id}`} className="text-sm text-zinc-300 mb-8 leading-relaxed relative z-10 font-medium">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p data-edit-id={`t6-testimonial-name-${t.id}`} className="text-sm font-semibold text-white">{t.name}</p>
                    <p data-edit-id={`t6-testimonial-role-${t.id}`} className="text-xs text-zinc-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section data-edit-id="t6-cta" className="py-32 relative z-10 border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-indigo-500/5 mix-blend-overlay" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div data-edit-id="t6-cta-content" className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 data-edit-id="t6-cta-title" className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-6">Ready to accelerate?</h2>
          <p data-edit-id="t6-cta-copy" className="text-lg text-zinc-400 mb-10 max-w-2xl mx-auto text-balance">Join thousands of developers building scalable, lightning-fast applications with zero friction.</p>
          <div data-edit-id="t6-cta-actions" className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button data-edit-id="t6-cta-primary" className="h-12 w-full sm:w-auto px-8 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              Start Building for Free
            </button>
            <button data-edit-id="t6-cta-secondary" className="h-12 w-full sm:w-auto px-8 rounded-full bg-transparent border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Actual Footer */}
      <footer data-edit-id="t6-footer" className="border-t border-white/5 bg-black py-16 px-6 relative z-10">
        <div data-edit-id="t6-footer-top" className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div data-edit-id="t6-footer-brand" className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <span data-edit-id="t6-footer-brand-text" className="text-sm font-bold text-white tracking-tight">Velocity Inc.</span>
            </div>
            <p data-edit-id="t6-footer-brand-copy" className="text-xs text-zinc-500 max-w-xs">Connecting dots, building dreams. The enterprise infrastructure for standard web applications.</p>
          </div>

          <div data-edit-id="t6-footer-links" className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16 text-sm">
            <div data-edit-id="t6-footer-col-product" className="flex flex-col gap-3">
              <h4 data-edit-id="t6-footer-col-product-title" className="text-white font-semibold mb-2">Product</h4>
              <a data-edit-id="t6-footer-link-product-features" href="#" className="text-zinc-500 hover:text-white transition-colors">Features</a>
              <a data-edit-id="t6-footer-link-product-integrations" href="#" className="text-zinc-500 hover:text-white transition-colors">Integrations</a>
              <a data-edit-id="t6-footer-link-product-pricing" href="#" className="text-zinc-500 hover:text-white transition-colors">Pricing</a>
              <a data-edit-id="t6-footer-link-product-changelog" href="#" className="text-zinc-500 hover:text-white transition-colors">Changelog</a>
            </div>
            <div data-edit-id="t6-footer-col-resources" className="flex flex-col gap-3">
              <h4 data-edit-id="t6-footer-col-resources-title" className="text-white font-semibold mb-2">Resources</h4>
              <a data-edit-id="t6-footer-link-resources-docs" href="#" className="text-zinc-500 hover:text-white transition-colors">Documentation</a>
              <a data-edit-id="t6-footer-link-resources-blog" href="#" className="text-zinc-500 hover:text-white transition-colors">Blog</a>
              <a data-edit-id="t6-footer-link-resources-community" href="#" className="text-zinc-500 hover:text-white transition-colors">Community</a>
              <a data-edit-id="t6-footer-link-resources-guides" href="#" className="text-zinc-500 hover:text-white transition-colors">Guides</a>
            </div>
            <div data-edit-id="t6-footer-col-company" className="flex flex-col gap-3">
              <h4 data-edit-id="t6-footer-col-company-title" className="text-white font-semibold mb-2">Company</h4>
              <a data-edit-id="t6-footer-link-company-about" href="#" className="text-zinc-500 hover:text-white transition-colors">About Us</a>
              <a data-edit-id="t6-footer-link-company-careers" href="#" className="text-zinc-500 hover:text-white transition-colors">Careers</a>
              <a data-edit-id="t6-footer-link-company-legal" href="#" className="text-zinc-500 hover:text-white transition-colors">Legal</a>
              <a data-edit-id="t6-footer-link-company-contact" href="#" className="text-zinc-500 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
        <div data-edit-id="t6-footer-bottom" className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-zinc-600">
          <p data-edit-id="t6-footer-copyright">© {new Date().getFullYear()} Velocity Inc. All rights reserved.</p>
          <div data-edit-id="t6-footer-legal-links" className="flex gap-4">
            <a data-edit-id="t6-footer-link-privacy" href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a data-edit-id="t6-footer-link-terms" href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
      </main>
    </>
  );
}
