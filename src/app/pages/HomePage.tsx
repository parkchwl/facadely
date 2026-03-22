'use client';

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Zap, Smartphone, Palette, Settings, BarChart3, Shield, ChevronDown } from 'lucide-react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform
} from 'framer-motion';
import ScrollingBanner from '../components/ScrollingBanner';
import TemplateCard from '../components/TemplateCard';
import OptimizedImage, { ImageType } from '../components/OptimizedImage';
import type { HomePageDictionary } from '@/types/dictionary';
import { listCanonicalTemplateEntries } from '@/lib/template-registry';

const dmSerif = { className: 'font-serif' } as const;
const inter = { className: 'font-sans' } as const;

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

  // Scroll-linked gallery tuning
  GALLERY_SCROLL_INTENSITY: 0.04,     // Lower = slower horizontal movement
  GALLERY_CARD_BASE_WIDTH: 330,       // Keep card width visually consistent
  GALLERY_CARD_BASE_WIDTH_MOBILE: 200,// Smaller cards on mobile viewports
  GALLERY_MOBILE_BREAKPOINT: 640,     // Tailwind sm breakpoint
  GALLERY_ZOOM_COMPENSATION_MAX: 4,   // 100% -> 25% zoom range support
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
    viewport: { once: true, margin: "-100px" }
  },

  // FAQ Section
  faqFadeInUp: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: CONFIG.ANIMATION_DURATION_NORMAL },
    viewport: { once: true, margin: "-100px" }
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
  containerClasses: "w-full max-w-7xl mx-auto px-6 sm:px-8",
  heroContainerClasses: "w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16",
  sectionSpacing: "py-16 sm:py-20 lg:py-24 xl:py-28 2xl:py-32",

  // Hero Section
  heroSection: "relative z-10 flex flex-col bg-black",
  heroImageContainer: "relative text-left text-white flex items-center justify-center overflow-hidden py-24 sm:py-32 lg:py-40",
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
  whyMattersContainer: "relative flex items-center justify-center min-h-app-vh py-16 sm:py-20 lg:py-24 overflow-hidden",
  whyMattersGradient: "absolute inset-0 bg-black/40",
  whyMattersGrid: "grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start",
  whyMattersLeftColumn: "flex flex-col gap-4 lg:gap-6 justify-start lg:col-span-1",
  whyMattersTitle: "text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70",
  whyMattersDescription: "text-lg lg:text-xl xl:text-2xl text-gray-200 leading-relaxed font-light max-w-2xl",
  whyMattersButton: "bg-white text-black px-10 py-5 lg:px-12 lg:py-6 rounded-full hover:bg-gray-100 transition-all duration-200 text-lg lg:text-xl font-bold shadow-2xl hover:scale-105 hover:-translate-y-0.5 active:scale-95",
  statsGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8",
  statCard: "relative group bg-gradient-to-br from-white/5 via-white/3 to-transparent backdrop-blur-lg rounded-xl p-6 lg:p-8 cursor-pointer transition-all duration-300 overflow-hidden border-2 border-white/20 hover:border-white/40 hover:-translate-y-1 hover:scale-[1.02]",
  statCardGlow: "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none stat-card-inner-glow",
  statCardContent: "relative z-10 flex flex-col gap-4",
  statNumber: "text-4xl lg:text-5xl xl:text-6xl font-bold text-white",
  statHighlight: "font-medium",
  statText: "text-sm lg:text-base xl:text-lg text-white leading-relaxed mb-3 font-light",
  statSource: "text-xs lg:text-sm text-gray-400",

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
 * Keeps progress bar reset in sync with FAQ rotation state changes
 */
function useFaqRotation(faqCount: number) {
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFaqInView, setIsFaqInView] = useState(false);
  const [faqProgressCycle, setFaqProgressCycle] = useState(0);
  const faqSectionRef = React.useRef<HTMLDivElement>(null);
  const pauseTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Setup intersection observer to detect when FAQ section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsFaqInView(entry.isIntersecting);
      if (entry.isIntersecting) {
        setFaqProgressCycle((prev) => prev + 1);
      }
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

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  const handleFaqIndexChange = useCallback((index: number) => {
    setActiveFaqIndex(index);
    setIsPaused(false);
    setFaqProgressCycle((prev) => prev + 1);
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
      setFaqProgressCycle((prev) => prev + 1);
      setIsPaused(false);
    }, 100);
  }, []);

  return {
    activeFaqIndex,
    isPaused,
    isFaqInView,
    faqProgressCycle,
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
// Custom hook for image loading with session check
function useImageLoading(criticalImageCount: number = CONFIG.CRITICAL_IMAGES) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const loadStartTime = React.useRef<number | null>(null);
  const hasVisitedRef = React.useRef(false);

  useEffect(() => {
    hasVisitedRef.current = sessionStorage.getItem('hasVisited') === 'true';

    // Returning visitors skip loading screen after hydration.
    if (hasVisitedRef.current) {
      const visitedTimer = setTimeout(() => {
        setIsLoaded(true);
      }, 0);
      return () => clearTimeout(visitedTimer);
    }

    loadStartTime.current = Date.now();
  }, []);

  // Manage loading screen timing
  useEffect(() => {
    if (hasVisitedRef.current || isLoaded || loadStartTime.current === null) return;

    if (imagesLoaded >= criticalImageCount) {
      const elapsed = Date.now() - loadStartTime.current;
      const remainingDelay = Math.max(0, CONFIG.MIN_LOADING_TIME - elapsed);

      const minTimer = setTimeout(() => {
        setIsLoaded(true);
        sessionStorage.setItem('hasVisited', 'true');
      }, remainingDelay);
      return () => clearTimeout(minTimer);
    } else {
      const maxTimer = setTimeout(() => {
        setIsLoaded(true);
        sessionStorage.setItem('hasVisited', 'true');
      }, CONFIG.MAX_LOADING_TIME);
      return () => clearTimeout(maxTimer);
    }
  }, [imagesLoaded, criticalImageCount, isLoaded]);

  const handleImageLoad = useCallback(() => {
    setImagesLoaded(prev => prev + 1);
  }, []);

  return {
    isLoaded,
    imagesLoaded,
    handleImageLoad,
  };
}

const HOME_GALLERY_TEMPLATES = listCanonicalTemplateEntries().map((entry) => ({
  id: entry.templateId,
  title: entry.name,
  category: entry.description,
  image: entry.previewImage,
}));

const HOME_GALLERY_TOP_ROW_IDS = [
  'velocity-saas-landing',
  'vault-fintech-dashboard',
  'rekolet-brutalism',
  'nocturne-typography-agency',
  'nexus-ai-enterprise',
  'ion-modern-product',
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
    isFaqInView,
    faqProgressCycle,
    faqSectionRef,
    handleFaqIndexChange,
    handleFaqMouseEnter,
    handleFaqMouseLeave,
  } = useFaqRotation(dictionary.faq.questions.length);

  // Extract dictionary data
  const { hero, solution, faq, finalCta, loadingScreen } = dictionary;
  const FAQS = faq.questions;
  const langPrefix = lang ? `/${lang}` : '';
  const SOLUTION_DATA = solution.items;
  const solutionTitleSegments = solution.title.split('✦');
  const hasInlineSolutionStar = solutionTitleSegments.length >= 2;
  const solutionTitleBeforeStar = solutionTitleSegments[0]?.trim() ?? solution.title;
  const solutionTitleAfterStar = solutionTitleSegments.slice(1).join('✦').trim();
  const finalCtaTitleSegments = finalCta.title.split('✦');
  const hasInlineFinalCtaStar = finalCtaTitleSegments.length >= 2;
  const finalCtaTitleBeforeStar = finalCtaTitleSegments[0]?.trim() ?? finalCta.title;
  const finalCtaTitleAfterStar = finalCtaTitleSegments.slice(1).join('✦').trim();
  const hasSolutionCta = Boolean(solution.cta_text?.trim() || solution.cta_button?.trim());
  const finalCtaTitleClassName = hasInlineFinalCtaStar
    ? `${inter.className} text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-8 tracking-tight leading-none sm:whitespace-nowrap`
    : `${inter.className} text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white mb-8 tracking-tight leading-none`;

  const topRowTemplateIdSet = useMemo(
    () => new Set<string>(HOME_GALLERY_TOP_ROW_IDS),
    []
  );
  const topRowTemplates = useMemo(
    () =>
      HOME_GALLERY_TOP_ROW_IDS
        .map((templateId) =>
          HOME_GALLERY_TEMPLATES.find((template) => template.id === templateId)
        )
        .filter((template): template is (typeof HOME_GALLERY_TEMPLATES)[number] => Boolean(template)),
    []
  );
  const bottomRowTemplates = useMemo(
    () =>
      HOME_GALLERY_TEMPLATES.filter(
        (template) => !topRowTemplateIdSet.has(String(template.id))
      ),
    [topRowTemplateIdSet]
  );
  const duplicatedRow1 = useMemo(() =>
    [...topRowTemplates, ...topRowTemplates],
    [topRowTemplates]
  );
  const duplicatedRow2 = useMemo(() =>
    [...bottomRowTemplates, ...bottomRowTemplates],
    [bottomRowTemplates]
  );
  const gallerySectionRef = useRef<HTMLElement | null>(null);
  const galleryLeftTrackRef = useRef<HTMLDivElement | null>(null);
  const galleryRightTrackRef = useRef<HTMLDivElement | null>(null);
  const initialDevicePixelRatioRef = useRef(1);
  const [galleryScrollDistance, setGalleryScrollDistance] = useState(0);
  const [galleryZoomCompensation, setGalleryZoomCompensation] = useState(1);
  const [isMobileGalleryViewport, setIsMobileGalleryViewport] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress: galleryScrollProgress } = useScroll({
    target: gallerySectionRef,
    offset: ['start end', 'end start']
  });

  const galleryTravelDistance = galleryScrollDistance * CONFIG.GALLERY_SCROLL_INTENSITY;
  const leftTrackX = useTransform(galleryScrollProgress, [0, 1], [0, -galleryTravelDistance]);
  const rightTrackX = useTransform(galleryScrollProgress, [0, 1], [-galleryTravelDistance, 0]);

  const smoothLeftTrackX = useSpring(leftTrackX, { stiffness: 120, damping: 24, mass: 0.35 });
  const smoothRightTrackX = useSpring(rightTrackX, { stiffness: 120, damping: 24, mass: 0.35 });
  const galleryBaseCardWidth = isMobileGalleryViewport
    ? CONFIG.GALLERY_CARD_BASE_WIDTH_MOBILE
    : CONFIG.GALLERY_CARD_BASE_WIDTH;
  const galleryEffectiveZoomCompensation = isMobileGalleryViewport ? 1 : galleryZoomCompensation;
  const galleryCardWidth = Math.max(
    1,
    Math.round(galleryBaseCardWidth * galleryEffectiveZoomCompensation)
  );

  useEffect(() => {
    const mobileMediaQuery = window.matchMedia(`(max-width: ${CONFIG.GALLERY_MOBILE_BREAKPOINT - 1}px)`);
    const updateMobileViewport = () => {
      setIsMobileGalleryViewport(mobileMediaQuery.matches);
    };

    updateMobileViewport();
    mobileMediaQuery.addEventListener('change', updateMobileViewport);

    return () => {
      mobileMediaQuery.removeEventListener('change', updateMobileViewport);
    };
  }, []);

  useEffect(() => {
    const updateZoomCompensation = () => {
      const baseDpr = initialDevicePixelRatioRef.current || 1;
      const currentDpr = window.devicePixelRatio || baseDpr;
      const rawCompensation = baseDpr / currentDpr;
      const nextCompensation = Math.min(
        CONFIG.GALLERY_ZOOM_COMPENSATION_MAX,
        Math.max(1, rawCompensation)
      );

      setGalleryZoomCompensation((prev) =>
        Math.abs(prev - nextCompensation) > 0.01 ? nextCompensation : prev
      );
    };

    initialDevicePixelRatioRef.current = window.devicePixelRatio || 1;
    updateZoomCompensation();
    const rafId = window.requestAnimationFrame(updateZoomCompensation);
    const settleTimer = window.setTimeout(updateZoomCompensation, 250);

    window.addEventListener('resize', updateZoomCompensation);
    window.visualViewport?.addEventListener('resize', updateZoomCompensation);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(settleTimer);
      window.removeEventListener('resize', updateZoomCompensation);
      window.visualViewport?.removeEventListener('resize', updateZoomCompensation);
    };
  }, []);

  useEffect(() => {
    const calculateGalleryDistance = () => {
      const leftDistance = galleryLeftTrackRef.current ? galleryLeftTrackRef.current.scrollWidth / 2 : 0;
      const rightDistance = galleryRightTrackRef.current ? galleryRightTrackRef.current.scrollWidth / 2 : 0;
      const nextDistance = Math.max(leftDistance, rightDistance);

      setGalleryScrollDistance((prev) =>
        Math.abs(prev - nextDistance) > 1 ? nextDistance : prev
      );
    };

    calculateGalleryDistance();

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(calculateGalleryDistance)
      : null;

    if (resizeObserver) {
      if (galleryLeftTrackRef.current) {
        resizeObserver.observe(galleryLeftTrackRef.current);
      }
      if (galleryRightTrackRef.current) {
        resizeObserver.observe(galleryRightTrackRef.current);
      }
    }

    window.addEventListener('resize', calculateGalleryDistance);

    return () => {
      window.removeEventListener('resize', calculateGalleryDistance);
      resizeObserver?.disconnect();
    };
  }, [galleryCardWidth]);


  return (
    <>
      <main className="bg-black min-h-app-vh">
        <section className="relative z-10 flex flex-col bg-black">
          <div className="relative text-center text-white flex items-center justify-center overflow-hidden py-24 sm:py-32 lg:py-40">
            {/* Plain Black Background */}
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <OptimizedImage
                src="/image/Herosection.webp"
                alt="Hero background"
                type={ImageType.STATIC_BACKGROUND}
                fill
                priority
                className="object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
            <motion.div
              {...ANIMATIONS.heroFadeInUp}
              className="relative z-10 flex flex-col items-center justify-center gap-6 px-4 sm:px-6 lg:px-8"
            >
              <h1
                className={`${inter.className} text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-extrabold text-white tracking-tight leading-none`}
                dangerouslySetInnerHTML={{ __html: hero.title }}
              />
              <p className="text-base sm:text-lg lg:text-xl text-[rgb(150,150,150)] leading-relaxed max-w-xl font-normal text-center"
                dangerouslySetInnerHTML={{ __html: hero.subtitle }} />
              <div className="flex items-center gap-2 lg:gap-3">
                <Link href={`${langPrefix}/login`} className="bg-white text-black py-3 px-6 lg:py-4 lg:px-8 rounded-xl font-bold text-base transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] hover:scale-105">
                  {hero.signupButton} <span className="hidden sm:inline font-normal">{hero.signupFreeText}</span>
                </Link>
                <Link href={`${langPrefix}/templates`} className="bg-white/10 backdrop-blur-md border border-white/20 text-white py-3 px-6 lg:py-4 lg:px-8 rounded-xl transition-all font-semibold text-base hover:bg-white/20 hover:border-white/40">
                  {hero.templatesLink}
                </Link>
              </div>
            </motion.div>
          </div>

          <section ref={gallerySectionRef} className="relative bg-black overflow-hidden space-y-4 py-4">
            <div className="gallery-edge-blur">
              <motion.div
                ref={galleryLeftTrackRef}
                data-gallery-track="left"
                className="flex w-max gallery-scroll-track"
                style={{ x: prefersReducedMotion ? 0 : smoothLeftTrackX }}
              >
                {duplicatedRow1.map((template, index) => (
                  <Link href={`${langPrefix}/templates`} key={`row1-${template.id}-${index}`}>
                    <div
                      className="flex-shrink-0 mx-1.5 sm:mx-2"
                      style={{ width: `${galleryCardWidth}px`, minWidth: `${galleryCardWidth}px` }}
                    >
                      <TemplateCard
                        template={template}
                        index={index}
                        imageWidthPx={galleryCardWidth}
                        handleImageLoad={index < 4 ? handleImageLoad : undefined}
                      />
                    </div>
                  </Link>
                ))}
              </motion.div>
            </div>
            <div className="gallery-edge-blur">
              <motion.div
                ref={galleryRightTrackRef}
                data-gallery-track="right"
                className="flex w-max gallery-scroll-track"
                style={{ x: prefersReducedMotion ? 0 : smoothRightTrackX }}
              >
                {duplicatedRow2.map((template, index) => (
                  <Link href={`${langPrefix}/templates`} key={`row2-${template.id}-${index}`}>
                    <div
                      className="flex-shrink-0 mx-1.5 sm:mx-2"
                      style={{ width: `${galleryCardWidth}px`, minWidth: `${galleryCardWidth}px` }}
                    >
                      <TemplateCard template={template} index={index + 10} imageWidthPx={galleryCardWidth} />
                    </div>
                  </Link>
                ))}
              </motion.div>
            </div>
          </section>

        </section>

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
                className="font-plus-jakarta text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-black mb-4 text-center tracking-[-0.02em] leading-[0.95]"
              >
                {hasInlineSolutionStar ? (
                  <>
                    {solutionTitleBeforeStar}
                    <span className="inline-block text-[0.48em] font-medium mx-[0.24em] align-[0.18em]">✦</span>
                    {solutionTitleAfterStar}
                  </>
                ) : (
                  solution.title
                )}
              </motion.h2>
              {solution.subtitle && (
                <p className="text-center text-lg sm:text-xl text-gray-700 mb-12">
                  {solution.subtitle}
                </p>
              )}
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
              {hasSolutionCta && (
                <div className="mt-20 text-center">
                  {solution.cta_text && (
                    <p className="text-xl lg:text-2xl xl:text-3xl text-gray-800 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
                      {solution.cta_text}
                    </p>
                  )}
                  {solution.cta_button && (
                    <Link href={`${langPrefix}/templates`} className="inline-block px-10 py-5 lg:px-12 lg:py-6 bg-black text-white font-bold rounded-full hover:bg-gray-900 transition-all duration-200 text-lg lg:text-xl shadow-xl hover:scale-105">
                      {solution.cta_button}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        <ScrollingBanner />

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
                      <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          key={`progress-${activeFaqIndex}-${faqProgressCycle}`}
                          className="h-full w-full bg-black animate-progress"
                          style={{
                            animation: `progressBar ${CONFIG.FAQ_ROTATION_INTERVAL}ms linear forwards`,
                            animationPlayState: isPaused || !isFaqInView ? 'paused' : 'running'
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

        {/* Final CTA Section - Minimal & Bold (Apple Style) */}
        <section className="relative bg-black py-24 lg:py-40 border-t border-white/5 overflow-hidden">
          <div className={STYLES.containerClasses}>
            <motion.div
              {...ANIMATIONS.faqFadeInUp}
              className="text-center w-full relative z-10"
            >
              <h2
                className={finalCtaTitleClassName}
                style={{ textShadow: '0 0 30px rgba(255,255,255,0.3), 0 0 60px rgba(255,255,255,0.15)' }}
              >
                {hasInlineFinalCtaStar ? (
                  <>
                    <span className="block sm:hidden">
                      <span className="block">{finalCtaTitleBeforeStar}</span>
                      <span className="block text-[0.48em] font-medium leading-none my-[0.2em]">✦</span>
                      <span className="block">{finalCtaTitleAfterStar}</span>
                    </span>
                    <span className="hidden sm:inline">
                      {finalCtaTitleBeforeStar}
                      <span className="inline-block text-[0.48em] font-medium mx-[0.24em] align-[0.18em]">✦</span>
                      {finalCtaTitleAfterStar}
                    </span>
                  </>
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: finalCta.title }} />
                )}
              </h2>
              <p
                className="text-xl sm:text-2xl text-gray-400 mb-12 leading-relaxed max-w-3xl mx-auto font-light"
                dangerouslySetInnerHTML={{ __html: finalCta.subtitle }}
              />
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                <Link href={`${langPrefix}/login`} className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] hover:scale-105 min-w-[200px] flex justify-center items-center">
                  {finalCta.startButton}
                </Link>
                <Link href={`${langPrefix}/templates`} className="group relative px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-bold text-lg transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-105 min-w-[200px] flex justify-center items-center">
                  {finalCta.browseButton}
                </Link>
              </div>
            </motion.div>

            {/* Subtle background glow effect using CSS animation */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none animate-pulse duration-[5000ms]" />

            {/* Large dot-pattern ✦ logo background */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] sm:text-[30rem] lg:text-[40rem] pointer-events-none select-none font-bold"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)',
                backgroundSize: '8px 8px',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              ✦
            </div>
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
