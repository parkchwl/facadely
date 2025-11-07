'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { DM_Serif_Display } from 'next/font/google';
import { Zap, Smartphone, Palette, Settings, BarChart3, Shield, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollingBanner from '../components/ScrollingBanner';
import TemplateCard from '../components/TemplateCard';
import OptimizedImage, { ImageType } from '../components/OptimizedImage';
import type { HomePageDictionary } from '@/types/dictionary';

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

// ================================================================================
// CONFIGURATION CONSTANTS
// ================================================================================
const CONFIG = {
  // Timing & Intervals
  FAQ_ROTATION_INTERVAL: 15000,      // FAQ auto-cycle interval (ms)
  INTERSECTION_THRESHOLD: 0.3,        // IntersectionObserver threshold
  CRITICAL_IMAGES: 3,                 // Images needed before showing page
  MIN_LOADING_TIME: 500,              // Minimum loading screen duration
  MAX_LOADING_TIME: 1500,             // Maximum loading screen duration

  // Animation Durations (seconds)
  ANIMATION_DURATION_FAST: 0.3,       // Quick transitions
  ANIMATION_DURATION_NORMAL: 0.6,     // Standard transitions
  ANIMATION_DURATION_SLOW: 0.8,       // Slow transitions

  // Animation Delays
  ANIMATION_DELAY_SMALL: 0.2,         // Small delay
  ANIMATION_DELAY_MEDIUM: 0.4,        // Medium delay

  // Image Quality & Format
  IMAGE_QUALITY: 75,                  // Next.js image quality
  IMAGE_FORMAT: 'webp' as const,      // Image format

  // Scales & Transforms
  HOVER_SCALE: 1.05,                  // Hover scale effect
  ACTIVE_SCALE: 0.95,                 // Active/tap scale
  CARD_HOVER_SCALE: 1.02,             // Card hover scale
  HOVER_TRANSLATE_Y: -0.5,            // Hover vertical offset (rem units)

  // Display Counts
  STATS_DISPLAY_THRESHOLD: 4,         // Hide stats after this index on mobile
} as const;

// ================================================================================
// ANIMATION PRESETS
// ================================================================================
const ANIMATIONS = {
  // Hero Section
  heroFadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: CONFIG.ANIMATION_DURATION_SLOW }
  },

  // Section Headings
  headingFadeInUp: {
    initial: { opacity: 0, y: -50 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: CONFIG.ANIMATION_DURATION_SLOW },
    viewport: { once: true }
  },

  // Section Descriptions
  descriptionFadeInUp: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: CONFIG.ANIMATION_DURATION_SLOW, delay: CONFIG.ANIMATION_DELAY_SMALL },
    viewport: { once: true }
  },

  // CTA Buttons
  ctaButtonFadeInUp: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: CONFIG.ANIMATION_DURATION_SLOW, delay: CONFIG.ANIMATION_DELAY_MEDIUM },
    viewport: { once: true }
  },

  // Stats Cards
  statsContainerFadeInUp: {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: CONFIG.ANIMATION_DURATION_SLOW, delay: CONFIG.ANIMATION_DELAY_SMALL },
    viewport: { once: true }
  },

  // Solution Section
  solutionFadeInUp: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: CONFIG.ANIMATION_DURATION_NORMAL },
    viewport: { once: true }
  },

  // FAQ Section
  faqFadeInUp: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: CONFIG.ANIMATION_DURATION_NORMAL },
    viewport: { once: true }
  },

  // Button Hover Effects
  buttonHover: {
    whileHover: { scale: CONFIG.HOVER_SCALE, y: `${CONFIG.HOVER_TRANSLATE_Y}rem` },
    whileTap: { scale: CONFIG.ACTIVE_SCALE },
  },

  // Card Hover Effects
  cardHover: {
    whileHover: { scale: CONFIG.CARD_HOVER_SCALE, y: `${CONFIG.HOVER_TRANSLATE_Y}rem` },
  }
} as const;

// ================================================================================
// STYLES & TAILWIND CLASSES
// ================================================================================
const STYLES = {
  // Container & Layout
  containerClasses: "w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16",
  heroContainerClasses: "w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16",
  sectionSpacing: "py-16 sm:py-20 lg:py-24 xl:py-28 2xl:py-32",

  // Hero Section
  heroSection: "relative z-10 flex flex-col bg-black",
  heroImageContainer: "relative text-left text-white h-[55vh] sm:h-[60vh] lg:h-[65vh] flex items-center justify-center overflow-hidden",
  heroGradient: "absolute inset-0 bg-gradient-to-r from-black/60 to-transparent",
  heroTitle: "text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-10xl font-extrabold text-white tracking-tight leading-[0.9] mb-8 lg:mb-20 xl:mb-20",
  heroSubtitle: "text-xl sm:text-2xl lg:text-3xl text-gray-200 leading-relaxed max-w-2xl font-light",
  heroButtonGroup: "flex items-center gap-4 lg:gap-6 flex-shrink-0",
  heroLink: "font-semibold text-white hover:text-blue-400 transition-colors border-b-2 border-transparent hover:border-blue-400 pb-1 text-lg",
  heroButton: "bg-white text-black hover:bg-gray-100 py-4 px-8 lg:py-5 lg:px-10 rounded-xl transition-all shadow-lg font-bold text-lg hover:shadow-2xl hover:scale-105",

  // Template Carousel
  carouselSection: "relative bg-black overflow-hidden space-y-8 py-16",
  carouselContainer: "overflow-hidden",
  scrollContainer: "scroll-container scroll-left",
  scrollContainerReverse: "scroll-container scroll-right",
  templateCardWrapper: "flex-shrink-0 w-72 sm:w-80 lg:w-96 mx-4",

  // Why Matters Section
  whyMattersContainer: "relative flex items-center justify-center min-h-screen py-16 sm:py-20 lg:py-24 overflow-hidden",
  whyMattersGradient: "absolute inset-0 bg-black/40",
  whyMattersGrid: "grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24 items-start",
  whyMattersLeftColumn: "flex flex-col gap-4 lg:gap-6 justify-start lg:col-span-1",
  whyMattersTitle: "text-7xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[110px] 2xl:text-[130px] font-extrabold tracking-tight leading-[0.9] text-white",
  whyMattersDescription: "text-xl lg:text-2xl xl:text-3xl text-gray-200 leading-relaxed font-light max-w-xl",
  whyMattersButton: "bg-white text-black px-12 py-6 lg:px-14 lg:py-7 rounded-full hover:bg-gray-100 transition-all duration-200 text-xl lg:text-2xl font-bold shadow-2xl hover:scale-105 hover:-translate-y-0.5 active:scale-95",
  statsGrid: "grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8",
  statCard: "relative group bg-gradient-to-br from-white/5 via-white/3 to-transparent backdrop-blur-lg rounded-xl p-6 lg:p-8 cursor-pointer transition-all duration-300 overflow-hidden border-2 border-white/20 hover:border-white/40 hover:-translate-y-1 hover:scale-[1.02]",
  statCardGlow: "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none stat-card-inner-glow",
  statCardContent: "relative z-10 flex flex-col gap-4",
  statNumber: "text-5xl lg:text-6xl xl:text-7xl font-bold text-white",
  statHighlight: "font-medium",
  statText: "text-base lg:text-lg xl:text-xl text-white leading-relaxed mb-3 font-light",
  statSource: "text-sm lg:text-base text-gray-400",

  // Solution Section
  solutionSection: "relative border-t border-gray-800 overflow-hidden",
  solutionGradient: "absolute inset-0 bg-black/10",
  solutionCard: "bg-white rounded-3xl shadow-2xl px-8 sm:px-12 lg:px-16 py-20 lg:py-24",
  solutionTitle: "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-black mb-16 lg:mb-20 text-center",
  solutionGrid: "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10",
  solutionItem: "bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg p-8 lg:p-10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] border border-gray-200",
  solutionIcon: "w-12 h-12 lg:w-14 lg:h-14 mb-6 text-black",
  solutionItemTitle: "text-xl lg:text-2xl font-bold text-black mb-4",
  solutionItemDesc: "text-gray-700 text-base lg:text-lg whitespace-pre-line leading-relaxed",
  solutionCta: "mt-20 text-center",
  solutionCtaText: "text-xl lg:text-2xl xl:text-3xl text-gray-800 mb-10 max-w-3xl mx-auto leading-relaxed font-light",
  solutionCtaButton: "inline-block px-10 py-5 lg:px-12 lg:py-6 bg-black text-white font-bold rounded-full hover:bg-gray-900 transition-all duration-200 text-lg lg:text-xl shadow-xl hover:scale-105",

  // FAQ Section
  faqSection: "relative bg-black py-20 lg:py-28 border-t border-gray-800",
  faqGrid: "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12",
  faqLeftColumn: "space-y-3",
  faqButton: "w-full text-left p-6 rounded-xl transition-all duration-300",
  faqButtonText: "text-base lg:text-lg font-semibold leading-relaxed",
  faqChevron: "w-5 h-5 flex-shrink-0 transition-all duration-300",
  faqProgressBar: "mt-4 h-1 bg-gray-200 rounded-full overflow-hidden",
  faqProgressFill: "h-full bg-black animate-progress",
  faqRightColumn: "lg:sticky lg:top-24 h-fit",
  faqAnswerCard: "bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-8 lg:p-10 shadow-2xl",
  faqQuestionLabel: "inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-semibold text-white mb-4",
  faqQuestionTitle: "text-2xl lg:text-3xl font-bold text-white mb-6 leading-tight",
  faqAnswerContainer: "space-y-4",
  faqAnswerParagraph: "text-lg lg:text-xl text-gray-200 leading-relaxed",
  faqDivider: "h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-8",
  faqDots: "flex items-center gap-2",
  faqDot: "h-2 rounded-full transition-all duration-300",

  // Final CTA Section
  finalCtaSection: "relative bg-gradient-to-t from-gray-900 to-black py-20 lg:py-32 border-t border-gray-800",
  finalCtaContainer: "text-center max-w-4xl mx-auto",
  finalCtaTitle: "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-8",
  finalCtaSubtitle: "text-xl lg:text-2xl text-gray-400 mb-12 leading-relaxed",
  finalCtaButtonGroup: "flex flex-col sm:flex-row gap-6 justify-center items-center",
  finalCtaButtonPrimary: "inline-block bg-white text-black px-10 py-5 lg:px-12 lg:py-6 rounded-full hover:bg-gray-100 transition-all duration-200 text-lg lg:text-xl font-bold shadow-2xl hover:scale-105",
  finalCtaButtonSecondary: "inline-block bg-transparent border-2 border-white text-white px-10 py-5 lg:px-12 lg:py-6 rounded-full hover:bg-white hover:text-black transition-all duration-200 text-lg lg:text-xl font-bold hover:scale-105",

  // Loading Screen
  loadingScreen: "fixed inset-0 bg-black z-50 flex flex-col items-center justify-center w-full",
  loadingBrand: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white font-montserrat tracking-tight animate-pulse-glow",
};

// ================================================================================
// CUSTOM HOOKS
// ================================================================================

/**
 * useFaqRotation Hook
 * Handles automatic FAQ rotation logic with pause on interaction
 * Uses CSS animation-play-state to pause progress bar without re-rendering
 */
function useFaqRotation(faqCount: number) {
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFaqInView, setIsFaqInView] = useState(false);
  const faqSectionRef = React.useRef<HTMLDivElement>(null);
  const pauseTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Setup intersection observer to detect when FAQ section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsFaqInView(entry.isIntersecting);
    }, { threshold: CONFIG.INTERSECTION_THRESHOLD });

    const currentRef = faqSectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Auto-cycle FAQ items when in view and not paused
  useEffect(() => {
    if (isPaused || !isFaqInView) return;
    const timer = setTimeout(() => {
      setActiveFaqIndex((current) => (current + 1) % faqCount);
    }, CONFIG.FAQ_ROTATION_INTERVAL);
    return () => clearTimeout(timer);
  }, [isPaused, activeFaqIndex, isFaqInView, faqCount]);

  const handleFaqIndexChange = useCallback((index: number) => {
    setActiveFaqIndex(index);
    setIsPaused(false);
  }, []);

  const handleFaqMouseEnter = useCallback(() => {
    // Clear any existing pause timeout
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    setIsPaused(true);
  }, []);

  const handleFaqMouseLeave = useCallback(() => {
    // Delay unpause slightly to allow CSS animation to resume smoothly
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 100);
  }, []);

  return {
    activeFaqIndex,
    isPaused,
    faqSectionRef,
    handleFaqIndexChange,
    handleFaqMouseEnter,
    handleFaqMouseLeave,
  };
}

/**
 * useImageLoading Hook
 * Handles image loading state and minimum loading screen duration
 * Returns loading state and image load handler
 */
function useImageLoading(criticalImageCount: number = CONFIG.CRITICAL_IMAGES) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const loadStartTime = React.useRef(Date.now());

  // Manage loading screen timing
  useEffect(() => {
    if (imagesLoaded >= criticalImageCount) {
      const elapsed = Date.now() - loadStartTime.current;
      const remainingDelay = Math.max(0, CONFIG.MIN_LOADING_TIME - elapsed);
      setTimeout(() => setIsLoaded(true), remainingDelay);
    } else {
      const maxTimer = setTimeout(() => setIsLoaded(true), CONFIG.MAX_LOADING_TIME);
      return () => clearTimeout(maxTimer);
    }
  }, [imagesLoaded, criticalImageCount]);

  const handleImageLoad = useCallback(() => {
    setImagesLoaded(prev => prev + 1);
  }, []);

  return {
    isLoaded,
    imagesLoaded,
    handleImageLoad,
  };
}

// Base templates - this would ideally be fetched from a database
const BASE_TEMPLATES = [
  { id: 1, title: 'Beauty & Cosmetics', category: 'E-commerce', image: '/image/1.avif' },
  { id: 2, title: 'Minimal Portfolio', category: 'Creative', image: '/image/2.avif' },
  { id: 3, title: 'Luxury Fragrance', category: 'Product', image: '/image/3.avif' },
  { id: 4, title: 'Modern Studio', category: 'Business', image: '/image/4.avif' },
  { id: 5, title: 'Restaurant Menu', category: 'Food & Dining', image: '/image/5.avif' },
  { id: 6, title: 'Tech Startup', category: 'Technology', image: '/image/6.avif' },
  { id: 7, title: 'Travel Blog', category: 'Lifestyle', image: '/image/7.avif' },
  { id: 8, title: 'Fitness App', category: 'Health', image: '/image/8.avif' },
  { id: 9, title: 'Real Estate', category: 'Business', image: '/image/9.avif' },
  { id: 10, title: 'Online Course', category: 'Education', image: '/image/10.avif' },
  { id: 11, title: 'Template 11', category: 'Category', image: '/image/11.avif' },
  { id: 12, title: 'Template 12', category: 'Category', image: '/image/12.avif' },
  { id: 13, title: 'Template 13', category: 'Category', image: '/image/13.avif' }
] as const;

const iconMap: { [key: string]: React.ElementType } = {
  Zap,
  Smartphone,
  Palette,
  Settings,
  BarChart3,
  Shield
};

interface FAQItem {
  question: string;
  answer: string;
}

interface HomePageProps {
  dictionary: HomePageDictionary;
  lang?: string;
}

export default function HomePage({ dictionary, lang }: HomePageProps) {
  // Initialize custom hooks for state management
  const { isLoaded, handleImageLoad } = useImageLoading();
  const {
    activeFaqIndex,
    isPaused,
    faqSectionRef,
    handleFaqIndexChange,
    handleFaqMouseEnter,
    handleFaqMouseLeave,
  } = useFaqRotation(dictionary.faq.questions.length);

  // Extract dictionary data
  const { hero, whyMatters, solution, faq, finalCta, loadingScreen } = dictionary;
  const FAQS = faq.questions;
  const langPrefix = lang ? `/${lang}` : '';
  const STATS_DATA = whyMatters.stats;
  const SOLUTION_DATA = solution.items;

  // Memoize duplicated template rows for carousel
  const duplicatedRow1 = useMemo(() => [...BASE_TEMPLATES, ...BASE_TEMPLATES], []);
  const duplicatedRow2 = useMemo(() => [...BASE_TEMPLATES, ...BASE_TEMPLATES], []);

  return (
    <>
      <main className="bg-black min-h-screen">
        <section className="relative z-10 flex flex-col bg-black">
          <div className="relative text-left text-white h-[55vh] sm:h-[60vh] lg:h-[65vh] flex items-center justify-center overflow-hidden">
            <OptimizedImage
              src="/image/Title.avif"
              alt="Hero background"
              type={ImageType.STATIC_BACKGROUND}
              fill
              priority
              className="object-cover brightness-150"
              onLoad={handleImageLoad}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
            <motion.div
              {...ANIMATIONS.heroFadeInUp}
              className={`${STYLES.heroContainerClasses} py-12 sm:py-16 lg:py-20 xl:py-24 relative z-10 w-full`}
            >
              <h1
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-10xl font-extrabold text-white tracking-tight leading-[0.9] mb-8 lg:mb-20 xl:mb-20"
                style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)' }}
                dangerouslySetInnerHTML={{ __html: hero.title }}
              />
              <div className="w-full flex flex-col lg:flex-row lg:items-center items-start lg:justify-between gap-8 lg:gap-12">
                <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 leading-relaxed max-w-2xl font-light"
                   dangerouslySetInnerHTML={{ __html: hero.subtitle }} />
                <div className="flex items-center gap-4 lg:gap-6 flex-shrink-0">
                  <Link href={`${langPrefix}/templates`} className="font-semibold text-white hover:text-blue-400 transition-colors border-b-2 border-transparent hover:border-blue-400 pb-1 text-lg">
                    {hero.templatesLink}
                  </Link>
                  <Link href={`${langPrefix}/login`} className="bg-white text-black hover:bg-gray-100 py-4 px-8 lg:py-5 lg:px-10 rounded-xl transition-all shadow-lg font-bold text-lg hover:shadow-2xl hover:scale-105">
                    {hero.signupButton} <span className="hidden sm:inline font-normal">{hero.signupFreeText}</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          <section className="relative bg-black overflow-hidden space-y-8 py-16">
            <div className="overflow-hidden">
              <div className="scroll-container scroll-left">
                {duplicatedRow1.map((template, index) => (
                  <Link href={`${langPrefix}/templates`} key={`row1-${template.id}-${index}`}>
                    <div className="flex-shrink-0 w-72 sm:w-80 lg:w-96 mx-4">
                      <TemplateCard template={template} index={index} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="scroll-container scroll-right">
                {duplicatedRow2.map((template, index) => (
                  <Link href={`${langPrefix}/templates`} key={`row2-${template.id}-${index}`}>
                    <div className="flex-shrink-0 w-72 sm:w-80 lg:w-96 mx-4">
                      <TemplateCard template={template} index={index + 13} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <div className="relative flex items-center justify-center min-h-screen py-16 sm:py-20 lg:py-24 overflow-hidden">
            <OptimizedImage
              src="/image/Matters.avif"
              alt="Why your website matters background"
              type={ImageType.STATIC_BACKGROUND}
              fill
              className="object-cover"
              onLoad={handleImageLoad}
            />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className={`${STYLES.containerClasses} py-12 sm:py-16 lg:py-20 xl:py-24 relative z-10`}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24 items-start">
                <div className="flex flex-col gap-4 lg:gap-6 justify-start lg:col-span-1">
                  <motion.div
                    {...ANIMATIONS.headingFadeInUp}
                    className="w-full mb-2"
                    suppressHydrationWarning
                  >
                    <h2
                      className={`text-7xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[110px] 2xl:text-[130px] font-extrabold tracking-tight leading-[0.9] text-white ${dmSerif.className}`}
                      dangerouslySetInnerHTML={{ __html: whyMatters.title }}
                      suppressHydrationWarning
                    />
                  </motion.div>
                  <motion.div
                    {...ANIMATIONS.descriptionFadeInUp}
                    className="w-full"
                  >
                    <p className="text-xl lg:text-2xl xl:text-3xl text-gray-200 leading-relaxed font-light max-w-xl"
                       dangerouslySetInnerHTML={{ __html: whyMatters.description }} />
                  </motion.div>
                  <motion.div
                    {...ANIMATIONS.ctaButtonFadeInUp}
                    className="w-fit"
                  >
                    <Link href={`${langPrefix}/generate`}>
                      <button className="bg-white text-black px-12 py-6 lg:px-14 lg:py-7 rounded-full hover:bg-gray-100 transition-all duration-200 text-xl lg:text-2xl font-bold shadow-2xl hover:scale-105 hover:-translate-y-0.5 active:scale-95">
                        {whyMatters.ctaButton}
                      </button>
                    </Link>
                  </motion.div>
                </div>
                <motion.div
                  {...ANIMATIONS.statsContainerFadeInUp}
                  className="w-full lg:col-span-2"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {STATS_DATA.map((item, index: number) => (
                      <div
                        key={index}
                        className={`relative group bg-gradient-to-br from-white/5 via-white/3 to-transparent backdrop-blur-lg rounded-xl p-6 lg:p-8 cursor-pointer transition-all duration-300 overflow-hidden border-2 border-white/20 hover:border-white/40 hover:-translate-y-1 hover:scale-[1.02] ${index >= CONFIG.STATS_DISPLAY_THRESHOLD ? 'hidden md:block' : ''}`}
                        style={{ boxShadow: `inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)`, transform: 'translateZ(0)' }}
                      >
                        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none stat-card-inner-glow"></div>
                        <div className="relative z-10 flex flex-col gap-4">
                          <h3 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white">
                            {item.stat}
                          </h3>
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
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <ScrollingBanner />

        <section className="relative border-t border-gray-800 overflow-hidden">
          <OptimizedImage
            src="/image/Solution.avif"
            alt="facadely solution background"
            type={ImageType.STATIC_BACKGROUND}
            fill
            className="object-cover"
            onLoad={handleImageLoad}
          />
          <div className="absolute inset-0 bg-black/10"></div>
          <div className={`${STYLES.containerClasses} ${STYLES.sectionSpacing} relative z-10`}>
            <div className="bg-white rounded-3xl shadow-2xl px-8 sm:px-12 lg:px-16 py-20 lg:py-24">
              <motion.h2
                {...ANIMATIONS.solutionFadeInUp}
                className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-black mb-16 lg:mb-20 text-center ${dmSerif.className}`}
              >
                {solution.title}
              </motion.h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
                {SOLUTION_DATA.map((item, index: number) => {
                  const iconKeys = Object.keys(iconMap) as Array<keyof typeof iconMap>;
                  const IconComponent = iconMap[iconKeys[index % iconKeys.length]] || Zap;
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
                  {solution.cta_text}
                </p>
                <Link href={`${langPrefix}/templates`} className="inline-block px-10 py-5 lg:px-12 lg:py-6 bg-black text-white font-bold rounded-full hover:bg-gray-900 transition-all duration-200 text-lg lg:text-xl shadow-xl hover:scale-105">
                  {solution.cta_button}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section ref={faqSectionRef} className="relative bg-black py-20 lg:py-28 border-t border-gray-800">
          <div className={STYLES.containerClasses}>
            <motion.div
              {...ANIMATIONS.faqFadeInUp}
              className="text-center mb-16"
            >
              <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 ${dmSerif.className}`}
              >
                {faq.title}
              </h2>
              <p className="text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto">
                {faq.subtitle}
              </p>
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-3">
                {FAQS.map((faqItem: FAQItem, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleFaqIndexChange(index)}
                    onMouseEnter={handleFaqMouseEnter}
                    onMouseLeave={handleFaqMouseLeave}
                    className={`w-full text-left p-6 rounded-xl transition-all duration-300 ${activeFaqIndex === index
                      ? 'bg-white text-black shadow-2xl scale-105'
                      : 'bg-white/5 text-white hover:bg-white/10'}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className={`text-base lg:text-lg font-semibold leading-relaxed ${activeFaqIndex === index ? 'text-black' : 'text-white'}`}
                      >
                        {faqItem.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${activeFaqIndex === index ? 'rotate-180 text-black' : 'text-gray-400'}`}
                      />
                    </div>
                    {activeFaqIndex === index && (
                      <div key={`progress-${activeFaqIndex}`} className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-black animate-progress"
                          style={{
                            animation: `progressBar ${CONFIG.FAQ_ROTATION_INTERVAL}ms linear forwards`,
                            animationPlayState: isPaused ? 'paused' : 'running'
                          }}
                        />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="lg:sticky lg:top-24 h-fit">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFaqIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: CONFIG.ANIMATION_DURATION_FAST }}
                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-8 lg:p-10 shadow-2xl"
                  >
                    <div className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-semibold text-white mb-4">
                      {(faq.questionLabel as string).replace('{current}', String(activeFaqIndex + 1)).replace('{total}', String(FAQS.length))}
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6 leading-tight">
                      {FAQS[activeFaqIndex].question}
                    </h3>
                    <div className="space-y-4">
                      {FAQS[activeFaqIndex].answer.split('\n\n').map((paragraph: string, idx: number) => (
                        <p key={idx} className="text-lg lg:text-xl text-gray-200 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-8" />
                    <div className="flex items-center gap-2">
                      {FAQS.map((_: FAQItem, index: number) => (
                        <button
                          key={index}
                          onClick={() => handleFaqIndexChange(index)}
                          className={`h-2 rounded-full transition-all duration-300 ${activeFaqIndex === index ? 'bg-white w-8' : 'bg-white/30 w-2 hover:bg-white/50'}`}
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

        <section className="relative bg-gradient-to-t from-gray-900 to-black py-20 lg:py-32 border-t border-gray-800">
          <div className={STYLES.containerClasses}>
            <motion.div
              {...ANIMATIONS.faqFadeInUp}
              className="text-center max-w-4xl mx-auto"
            >
              <h2 className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 ${dmSerif.className}`}
              >
                {finalCta.title}
              </h2>
              <p className="text-xl lg:text-2xl text-gray-400 mb-12 leading-relaxed">
                {finalCta.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link href={`${langPrefix}/templates`} className="inline-block bg-white text-black px-10 py-5 lg:px-12 lg:py-6 rounded-full hover:bg-gray-100 transition-all duration-200 text-lg lg:text-xl font-bold shadow-2xl hover:scale-105">
                  {finalCta.browseButton}
                </Link>
                <Link href={`${langPrefix}/login`} className="inline-block bg-transparent border-2 border-white text-white px-10 py-5 lg:px-12 lg:py-6 rounded-full hover:bg-white hover:text-black transition-all duration-200 text-lg lg:text-xl font-bold hover:scale-105">
                  {finalCta.startButton}
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed bg-black z-50 flex flex-col items-center justify-center"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: 'hidden'
            }}
          >
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white font-montserrat tracking-tight animate-pulse-glow">
                ✦ {loadingScreen.brandName}
              </h1>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}