'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DM_Serif_Display } from 'next/font/google';
import { Rocket, Smartphone, Palette, Settings, BarChart3, Shield, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollingBanner from '../components/ScrollingBanner';
import TemplateCard from '../components/TemplateCard';

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

// Static data - moved outside component for better performance
const STATS_DATA = [
  { stat: '94%', highlight: 'of first impressions', text: 'are design-related.', source: 'Northumbria University UX Lab' },
  { stat: '88%', highlight: 'of online consumers', text: 'are less likely to return to a site after a bad experience.', source: 'Econsultancy / Adobe' },
  { stat: '81%', highlight: 'of consumers', text: 'visit a website before making a purchase decision.', source: 'GE Capital Retail Bank / Google Think Insights' },
  { stat: '75%', highlight: 'of users', text: "judge a company's credibility based on its website.", source: 'Stanford Web Credibility Research' },
  { stat: '~70%', highlight: 'lose trust', text: "if a website doesn't look professional.", source: 'Adobe & Sweor' },
  { stat: '69%', highlight: 'of mobile users', text: 'interact with the website as their first brand experience.', source: 'Think with Google' }
];

const SOLUTION_DATA = [
  { title: 'Launch in 5 minutes, no setup', desc: 'Start instantly with ready-made templates.\nNo coding or installation required.', icon: Rocket },
  { title: 'Mobile-ready by default', desc: 'All templates are fully responsive.\nYour site looks great on any device—automatically.', icon: Smartphone },
  { title: 'Professional design, made easy', desc: 'Built by designers to earn trust and credibility.\nCreate a polished site without design skills.', icon: Palette },
  { title: 'Tools for bookings and customer management', desc: 'Everything you need—forms, scheduling, CRM—built in.\nNo plugins or third-party tools required.', icon: Settings },
  { title: 'Real-time analytics included', desc: 'Track visits, traffic, and user behavior.\nMake smarter decisions with live data.', icon: BarChart3 },
  { title: 'Security built-in', desc: 'SSL and encryption applied automatically.\nStay protected with continuous updates.', icon: Shield }
];

const FAQS = [
  {
    question: 'Do I need coding skills to use facadely?',
    answer: 'No! facadely is designed for everyone.\n\nOur intuitive drag-and-drop interface makes it easy to create professional websites without any coding knowledge.'
  },
  {
    question: 'Can I use my own domain name?',
    answer: 'Yes, you can connect your custom domain or purchase a new one directly through facadely.\n\nWe handle all the technical setup for you.'
  },
  {
    question: 'Are the templates mobile-responsive?',
    answer: 'Absolutely! All our templates are fully responsive and optimized for mobile, tablet, and desktop devices.\n\nYour site will look perfect on any screen size.'
  },
  {
    question: 'Can I switch templates after launching my site?',
    answer: 'Yes, you can change your template at any time without losing your content.\n\nYour text, images, and settings will transfer seamlessly.'
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! You can start building your website for free.\n\nNo credit card required. Upgrade when you\'re ready to publish.'
  },
  {
    question: 'What kind of support do you offer?',
    answer: 'We provide 24/7 customer support via chat and email.\n\nOur help center also includes tutorials, guides, and FAQs to help you succeed.'
  }
];

const STYLES = {
  containerClasses: "w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16",
  heroContainerClasses: "w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16",
  sectionSpacing: "py-16 sm:py-20 lg:py-24 xl:py-28 2xl:py-32"
};

// Base templates - no duplication
const BASE_TEMPLATES = [
  { id: 1, title: 'Beauty & Cosmetics', category: 'E-commerce', image: '/image/1.webp' },
  { id: 2, title: 'Minimal Portfolio', category: 'Creative', image: '/image/2.webp' },
  { id: 3, title: 'Luxury Fragrance', category: 'Product', image: '/image/3.webp' },
  { id: 4, title: 'Modern Studio', category: 'Business', image: '/image/4.webp' },
  { id: 5, title: 'Restaurant Menu', category: 'Food & Dining', image: '/image/5.webp' },
  { id: 6, title: 'Tech Startup', category: 'Technology', image: '/image/6.webp' },
  { id: 7, title: 'Travel Blog', category: 'Lifestyle', image: '/image/7.webp' },
  { id: 8, title: 'Fitness App', category: 'Health', image: '/image/8.webp' },
  { id: 9, title: 'Real Estate', category: 'Business', image: '/image/9.webp' },
  { id: 10, title: 'Online Course', category: 'Education', image: '/image/10.webp' },
  { id: 11, title: 'Template 11', category: 'Category', image: '/image/11.webp' },
  { id: 12, title: 'Template 12', category: 'Category', image: '/image/12.webp' },
  { id: 13, title: 'Template 13', category: 'Category', image: '/image/13.webp' }
] as const;

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFaqInView, setIsFaqInView] = useState(false);
  const faqSectionRef = React.useRef<HTMLDivElement>(null);
  const loadStartTime = React.useRef(Date.now());

  // Dynamic loading screen - waits for critical images or minimum time
  useEffect(() => {
    const CRITICAL_IMAGES = 3; // Title.webp, Matters.webp, Solution.webp
    const MIN_LOADING_TIME = 500; // Minimum 500ms
    const MAX_LOADING_TIME = 1500; // Maximum 1500ms

    if (imagesLoaded >= CRITICAL_IMAGES) {
      const elapsed = Date.now() - loadStartTime.current;
      const remainingDelay = Math.max(0, MIN_LOADING_TIME - elapsed);

      setTimeout(() => setIsLoaded(true), remainingDelay);
    } else {
      // Fallback: force load after MAX_LOADING_TIME
      const maxTimer = setTimeout(() => setIsLoaded(true), MAX_LOADING_TIME);
      return () => clearTimeout(maxTimer);
    }
  }, [imagesLoaded]);

  // Intersection Observer for FAQ section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFaqInView(entry.isIntersecting);
      },
      { threshold: 0.3 } // FAQ 섹션의 30%가 보일 때 활성화
    );

    if (faqSectionRef.current) {
      observer.observe(faqSectionRef.current);
    }

    return () => {
      if (faqSectionRef.current) {
        observer.unobserve(faqSectionRef.current);
      }
    };
  }, []);

  // Duplicate BASE_TEMPLATES for infinite scroll (no useMemo dependency needed)
  const duplicatedRow1 = useMemo(() =>
    [...BASE_TEMPLATES, ...BASE_TEMPLATES],
    []
  );

  const duplicatedRow2 = useMemo(() =>
    [...BASE_TEMPLATES, ...BASE_TEMPLATES],
    []
  );

  // FAQ 자동 재생 효과 - 뷰포트에 있을 때만 실행 (CSS animation으로 최적화)
  useEffect(() => {
    if (isPaused || !isFaqInView) return;

    const duration = 15000;

    const timer = setTimeout(() => {
      setActiveFaqIndex((current) => (current + 1) % FAQS.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [isPaused, activeFaqIndex, isFaqInView]);



  return (
    <>
      <main className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative z-10 flex flex-col bg-black">
        <div className="relative text-left text-white h-[55vh] sm:h-[60vh] lg:h-[65vh] flex items-center overflow-hidden">
          <Image
            src="/image/Title.webp"
            alt="Hero background"
            fill
            priority
            quality={75}
            sizes="100vw"
            className="object-cover brightness-150"
            onLoad={() => setImagesLoaded(prev => prev + 1)}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`${STYLES.heroContainerClasses} py-12 sm:py-16 lg:py-20 xl:py-24 relative z-10`}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-10xl font-extrabold text-white tracking-tight leading-[0.9] mb-8 lg:mb-20 xl:mb-20"
                style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)' }}>
              Customers are<br />searching for you
            </h1>

            <div className="w-full flex flex-col lg:flex-row lg:items-center items-start lg:justify-between gap-8 lg:gap-12">
              <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 leading-relaxed max-w-2xl font-light">
                Build a professional website in minutes —<br />
                <span className="font-medium">No code, No hassle</span>
              </p>

              <div className="flex items-center gap-4 lg:gap-6 flex-shrink-0">
                <Link href="/templates" className="font-semibold text-white hover:text-blue-400 transition-colors border-b-2 border-transparent hover:border-blue-400 pb-1 text-lg">
                  Templates
                </Link>
                <Link href="/login" className="bg-white text-black hover:bg-gray-100 py-4 px-8 lg:py-5 lg:px-10 rounded-xl transition-all shadow-lg font-bold text-lg hover:shadow-2xl hover:scale-105">
                  Sign up <span className="hidden sm:inline font-normal">It&apos;s free!</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Template Gallery Section */}
        <section className="relative bg-black overflow-hidden space-y-8 py-16">
          {/* Row 1: Scroll Left */}
          <div className="overflow-hidden">
            <div className="scroll-container scroll-left">
              {/* Render templates twice for infinite loop */}
              {duplicatedRow1.map((template, index) => (
                <Link href="/templates" key={`row1-${template.id}-${index}`}>
                  <div className="flex-shrink-0 w-72 sm:w-80 lg:w-96 mx-4">
                    <TemplateCard template={template} index={index} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Row 2: Scroll Right */}
          <div className="overflow-hidden">
            <div className="scroll-container scroll-right">
              {/* Render templates twice for infinite loop */}
              {duplicatedRow2.map((template, index) => (
                <Link href="/templates" key={`row2-${template.id}-${index}`}>
                  <div className="flex-shrink-0 w-72 sm:w-80 lg:w-96 mx-4">
                    <TemplateCard template={template} index={index + 13} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="relative flex items-center justify-center min-h-screen py-16 sm:py-20 lg:py-24 overflow-hidden">
          <Image
            src="/image/Matters.webp"
            alt="Why your website matters background"
            fill
            quality={75}
            sizes="100vw"
            className="object-cover"
            onLoad={() => setImagesLoaded(prev => prev + 1)}
          />
          <div className="absolute inset-0 bg-black/40"></div>

          <div className={`${STYLES.containerClasses} py-12 sm:py-16 lg:py-20 xl:py-24 relative z-10`}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24 items-start">
              {/* Left Section - Headline & CTA */}
              <div className="flex flex-col gap-6 lg:gap-10 justify-start lg:col-span-1">
                {/* Title - Staggered */}
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="w-full mb-4"
                >
                  <h2 className={`text-7xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[110px] 2xl:text-[130px] font-extrabold tracking-tight leading-[0.9] text-white ${dmSerif.className}`}>
                    Why<br />Website<br />Matters
                  </h2>
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="w-full"
                >
                  <p className="text-xl lg:text-2xl xl:text-3xl text-gray-200 leading-relaxed font-light max-w-xl">
                    In today&apos;s digital world, your website is your <span className="font-semibold text-white">first impression</span>, your <span className="font-semibold text-white">credibility</span>, and often your <span className="font-semibold text-white">main sales tool</span>.
                  </p>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="w-fit"
                >
                  <Link href="/generate">
                    <button className="bg-white text-black px-12 py-6 lg:px-14 lg:py-7 rounded-full hover:bg-gray-100 transition-all duration-200 text-xl lg:text-2xl font-bold shadow-2xl hover:scale-105 hover:-translate-y-0.5 active:scale-95">
                      Build Your Site Today
                    </button>
                  </Link>
                </motion.div>
              </div>

              {/* Right Section - 6 Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="w-full lg:col-span-2"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {STATS_DATA.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`relative group bg-gradient-to-br from-white/5 via-white/3 to-transparent backdrop-blur-lg rounded-xl p-6 lg:p-8 cursor-pointer transition-all duration-300 overflow-hidden border-2 border-white/20 hover:border-white/40 hover:-translate-y-1 hover:scale-[1.02] ${index >= 4 ? 'hidden md:block' : ''}`}
                        style={{
                          boxShadow: `
                            inset 0 1px 0 0 rgba(255, 255, 255, 0.1),
                            0 4px 6px -1px rgba(0, 0, 0, 0.3),
                            0 2px 4px -1px rgba(0, 0, 0, 0.2)
                          `,
                          transform: 'translateZ(0)'
                        }}
                      >
                        {/* Inner Glow on Hover - CSS 클래스 사용 */}
                        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none stat-card-inner-glow"></div>

                        {/* Vertical Layout - Number on top, text below */}
                        <div className="relative z-10 flex flex-col gap-4">
                          {/* Stat Number */}
                          <h3 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white">
                            {item.stat}
                          </h3>

                          {/* Description */}
                          <div>
                            <p className="text-base lg:text-lg xl:text-xl text-white leading-relaxed mb-3 font-light">
                              <span className="font-medium">{item.highlight}</span> {item.text}
                            </p>
                            <p className="text-sm lg:text-base text-gray-400">
                              {item.source}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <ScrollingBanner />

      {/* facadely Solution Section */}
      <section className="relative border-t border-gray-800 overflow-hidden">
        <Image
          src="/image/Solution.webp"
          alt="facadely solution background"
          fill
          quality={75}
          sizes="100vw"
          className="object-cover"
          onLoad={() => setImagesLoaded(prev => prev + 1)}
        />
        <div className="absolute inset-0 bg-black/10"></div>

        <div className={`${STYLES.containerClasses} ${STYLES.sectionSpacing} relative z-10`}>
          <div className="bg-white rounded-3xl shadow-2xl px-8 sm:px-12 lg:px-16 py-20 lg:py-24">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-black mb-16 lg:mb-20 text-center ${dmSerif.className}`}
            >
              facadely solves the problems
            </motion.h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
              {SOLUTION_DATA.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg p-8 lg:p-10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] border border-gray-200"
                  >
                    <IconComponent className="w-12 h-12 lg:w-14 lg:h-14 mb-6 text-black" />
                    <h3 className="text-xl lg:text-2xl font-bold text-black mb-4">{item.title}</h3>
                    <p className="text-gray-700 text-base lg:text-lg whitespace-pre-line leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-20 text-center">
              <p className="text-xl lg:text-2xl xl:text-3xl text-gray-800 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
                Create a lasting first impression and build a trusted brand that customers remember.
              </p>
              <Link href="/templates" className="inline-block px-10 py-5 lg:px-12 lg:py-6 bg-black text-white font-bold rounded-full hover:bg-gray-900 transition-all duration-200 text-lg lg:text-xl shadow-xl hover:scale-105">
                Start Building Your Business
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqSectionRef} className="relative bg-black py-20 lg:py-28 border-t border-gray-800">
        <div className={STYLES.containerClasses}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 ${dmSerif.className}`}>
              Frequently Asked Questions
            </h2>
            <p className="text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto">
              Got questions? We&apos;ve got answers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* 좌측 - 질문 목록 */}
            <div className="space-y-3">
              {FAQS.map((faq, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveFaqIndex(index);
                    setIsPaused(false);
                  }}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  className={`w-full text-left p-6 rounded-xl transition-all duration-300 ${
                    activeFaqIndex === index
                      ? 'bg-white text-black shadow-2xl scale-105'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className={`text-base lg:text-lg font-semibold leading-relaxed ${
                      activeFaqIndex === index ? 'text-black' : 'text-white'
                    }`}>
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${
                        activeFaqIndex === index
                          ? 'rotate-180 text-black'
                          : 'text-gray-400'
                      }`}
                    />
                  </div>

                  {/* 프로그레스 바 - CSS animation으로 최적화 */}
                  {activeFaqIndex === index && !isPaused && (
                    <div key={`progress-${activeFaqIndex}`} className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black animate-progress"
                        style={{
                          animation: 'progressBar 15s linear forwards'
                        }}
                      />
                    </div>
                  )}
                  {activeFaqIndex === index && isPaused && (
                    <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-black w-0" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* 우측 - 답변 컨텐츠 */}
            <div className="lg:sticky lg:top-24 h-fit">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFaqIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-8 lg:p-10 shadow-2xl"
                >
                  {/* 질문 번호 배지 */}
                  <div className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-semibold text-white mb-4">
                    Question {activeFaqIndex + 1} of {FAQS.length}
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6 leading-tight">
                    {FAQS[activeFaqIndex].question}
                  </h3>

                  {/* 답변 - 줄바꿈 처리 및 개선된 타이포그래피 */}
                  <div className="space-y-4">
                    {FAQS[activeFaqIndex].answer.split('\n\n').map((paragraph, idx) => (
                      <p
                        key={idx}
                        className="text-lg lg:text-xl text-gray-200 leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* 구분선 */}
                  <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-8" />

                  {/* 인디케이터 */}
                  <div className="flex items-center gap-2">
                    {FAQS.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setActiveFaqIndex(index);
                          setIsPaused(false);
                        }}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          activeFaqIndex === index
                            ? 'bg-white w-8'
                            : 'bg-white/30 w-2 hover:bg-white/50'
                        }`}
                        aria-label={`Go to question ${index + 1}`}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative bg-gradient-to-t from-gray-900 to-black py-20 lg:py-32 border-t border-gray-800">
        <div className={STYLES.containerClasses}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 ${dmSerif.className}`}>
              Ready to build your dream website?
            </h2>
            <p className="text-xl lg:text-2xl text-gray-400 mb-12 leading-relaxed">
              Join thousands of happy users who transformed their online presence with facadely
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/templates" className="inline-block bg-white text-black px-10 py-5 lg:px-12 lg:py-6 rounded-full hover:bg-gray-100 transition-all duration-200 text-lg lg:text-xl font-bold shadow-2xl hover:scale-105">
                Browse Templates
              </Link>
              <Link href="/login" className="inline-block bg-transparent border-2 border-white text-white px-10 py-5 lg:px-12 lg:py-6 rounded-full hover:bg-white hover:text-black transition-all duration-200 text-lg lg:text-xl font-bold hover:scale-105">
                Start for Free
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>

    {/* Loading Screen Overlay */}
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center"
        >
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white font-montserrat tracking-tight animate-pulse-glow">
              ✦ facadely
            </h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
