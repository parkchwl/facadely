'use client';
import { useParams } from 'next/navigation';
import React, { useState, useMemo, useCallback, memo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import OptimizedImage, { ImageType } from '@/app/components/OptimizedImage';
import { DM_Serif_Display } from 'next/font/google';
import {
  Zap,
  Palette,
  Smartphone,
  Search,
  TrendingUp,
  Globe,
  Lock,
  Check,
  ChevronDown,
  ArrowRight,
  Users,
  Award
} from 'lucide-react';

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

// Pre-compile regex patterns for SafeHtmlRenderer
const BR_REGEX = /<br\s*\/?>/gi;
const STRONG_REGEX = /(<strong>.*?<\/strong>)/gi;
const STRONG_TAG_REGEX = /^<strong>/i;
const REMOVE_STRONG_REGEX = /<\/?strong>/gi;

// Animation constants to prevent recreation
const HERO_ANIMATIONS = {
  leftContent: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8 }
  },
  rightContent: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, delay: 0.2 }
  }
};

const BUTTON_ANIMATIONS = {
  primary: {
    whileHover: { scale: 1.05, y: -2 },
    whileTap: { scale: 0.95 }
  },
  secondary: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 }
  }
};

// Icon arrays
const HERO_FEATURE_ICONS = [Palette, Search, Lock, Globe, Smartphone, TrendingUp];
const FEATURE_ICONS = [Zap, Palette, Smartphone, Lock];
const FEATURE_IMAGES = ['/image/Generate.avif', '/image/Matters.avif', '/image/Generate.avif', '/image/Matters.avif'];

// Type definitions
interface HeroSection {
  title: string;
  subtitle: string;
  startBuildingFree: string;
  browseTemplates: string;
  noCreditCard: string;
  templates: string;
  launchTime: string;
}

interface HeroFeature {
  title: string;
  description: string;
}

interface Feature {
  title: string;
  description: string;
  highlights: string[];
}

interface FeaturesSection {
  title: string;
  subtitle: string;
  items: Feature[];
}

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSection {
  title: string;
  subtitle: string;
  items: FaqItem[];
}

interface CtaSection {
  title: string;
  subtitle: string;
  startBuilding: string;
  browseTemplates: string;
  sslSecured: string;
  noCreditCardRequired: string;
  users: string;
  awardWinning: string;
}

interface ServicePageClientProps {
  dictionary: {
    hero: HeroSection;
    heroFeatures: HeroFeature[];
    features: FeaturesSection;
    faq: FaqSection;
    cta: CtaSection;
  };
}

/**
 * Safely renders text that may contain simple HTML-like formatting.
 * Only handles <br> and <strong> tags for safety.
 * Strips any other HTML tags.
 * Memoized for performance optimization.
 */
const SafeHtmlRenderer = memo(function SafeHtmlRenderer({ text }: { text: string }): React.ReactNode {
  return useMemo(() => {
    // Split by <br> and render with line breaks
    const textParts = text.split(BR_REGEX);
    const parts = textParts.map((part, index) => {
      // Handle <strong> tags
      const strongParts = part.split(STRONG_REGEX);

      return (
        <React.Fragment key={index}>
          {strongParts.map((p, idx) => {
            if (p.match(STRONG_TAG_REGEX)) {
              return (
                <strong key={idx}>
                  {p.replace(REMOVE_STRONG_REGEX, '')}
                </strong>
              );
            }
            return p || null;
          })}
          {index < textParts.length - 1 && <br />}
        </React.Fragment>
      );
    });

    return <>{parts}</>;
  }, [text]);
});

interface HeroFeatureCardProps {
  feature: {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  };
  index: number;
}

/**
 * Memoized hero feature card component
 * Prevents re-render when parent state changes
 */
const HeroFeatureCard = memo(function HeroFeatureCard({ feature, index }: HeroFeatureCardProps) {
  return (
    <motion.div
      key={`hero-${feature.title}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 + index * 0.08 }}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      className="flex flex-col items-center text-center gap-3 sm:gap-4 p-4 sm:p-6 lg:p-7 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group"
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
        <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-black" />
      </div>
      <div className="w-full">
        <h3 className="text-sm sm:text-lg font-bold text-white mb-1 sm:mb-2 break-words">
          {feature.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed break-words">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
});

interface FeatureCardProps {
  feature: {
    title: string;
    description: string;
    highlights: string[];
    image: string;
    icon: React.ComponentType<{ className?: string }>;
  };
  index: number;
}

/**
 * Memoized feature showcase card component
 * Prevents re-render when parent state changes
 */
const FeatureCard = memo(function FeatureCard({ feature, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 hover:shadow-2xl transition-shadow duration-300 border border-gray-200"
    >
      <div className={`flex flex-col ${
        index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
      } gap-12 lg:gap-16 items-center`}>
        {/* Image */}
        <div className="flex-1 w-full">
          <div className="relative rounded-2xl overflow-hidden shadow-lg bg-white p-4">
            <div className="relative w-full aspect-video">
              <OptimizedImage
                src={feature.image}
                alt={`${feature.title} feature screenshot`}
                type={ImageType.STATIC_BACKGROUND}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mb-6">
            <feature.icon className="w-8 h-8 text-white" />
          </div>
          <h3 className={`text-3xl lg:text-4xl font-bold text-gray-900 mb-4 ${dmSerif.className}`}>
            {feature.title}
          </h3>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            {feature.description}
          </p>
          <ul className="space-y-3">
            {feature.highlights.map((highlight, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 font-medium">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
});

export default function ServicePageClient({ dictionary }: ServicePageClientProps) {
  const { lang } = useParams() as { lang: string };
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Memoize hero features - only recalculate when dictionary.heroFeatures changes
  const heroFeatures = useMemo(() =>
    dictionary.heroFeatures.map((feature, index) => ({
      ...feature,
      icon: HERO_FEATURE_ICONS[index % HERO_FEATURE_ICONS.length]
    })),
    [dictionary.heroFeatures]
  );

  // Memoize features - only recalculate when dictionary.features.items changes
  const features = useMemo(() =>
    dictionary.features.items.map((item, idx) => ({
      ...item,
      image: FEATURE_IMAGES[idx % FEATURE_IMAGES.length],
      icon: FEATURE_ICONS[idx % FEATURE_ICONS.length]
    })),
    [dictionary.features.items]
  );

  // Memoize FAQ toggle handler - created once per component lifetime
  const handleFaqToggle = useCallback((index: number) => {
    setActiveFaq(prev => prev === index ? null : index);
  }, []);

  return (
    <div className="min-h-screen bg-white -mt-16 sm:-mt-20 lg:-mt-24">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] max-h-[1000px] flex items-center justify-center overflow-hidden bg-black py-12 sm:py-16 lg:py-20 xl:py-24">
        <div className="absolute inset-0">
          <OptimizedImage
            src="/image/Service.avif"
            alt="Service hero background"
            type={ImageType.STATIC_BACKGROUND}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left Side - Content */}
            <motion.div
              {...HERO_ANIMATIONS.leftContent}
              className="flex-1 text-left pt-30 sm:pt-16 lg:pt-20"
            >
              {/* Main Headline */}
              <h1
                className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[100px] font-extrabold text-white tracking-tight leading-[0.9] mb-8 ${dmSerif.className}`}
                style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)' }}
              >
                <SafeHtmlRenderer text={dictionary.hero.title} />
              </h1>

              {/* Sub Headline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl sm:text-2xl lg:text-3xl text-gray-200 leading-relaxed mb-10 font-light"
              >
                {dictionary.hero.subtitle}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-start gap-4 mb-10"
              >
                <Link href={`/${lang}/generate`}>
                  <motion.button
                    {...BUTTON_ANIMATIONS.primary}
                    aria-label="Start building your website for free"
                    className="bg-white text-black px-8 py-4 lg:px-10 lg:py-5 rounded-full font-bold text-lg shadow-2xl hover:bg-gray-100 transition-all duration-200 w-full sm:w-auto"
                  >
                    {dictionary.hero.startBuildingFree}
                  </motion.button>
                </Link>
                <Link href={`/${lang}/templates`}>
                  <motion.button
                    {...BUTTON_ANIMATIONS.secondary}
                    aria-label="Browse website templates"
                    className="border-2 border-white/30 text-white px-8 py-4 lg:px-10 lg:py-5 rounded-full font-bold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-200 backdrop-blur-sm w-full sm:w-auto"
                  >
                    {dictionary.hero.browseTemplates}
                  </motion.button>
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-wrap items-center gap-3 text-sm text-gray-400"
              >
                <Check className="w-4 h-4 text-green-400" />
                <span>{dictionary.hero.noCreditCard}</span>
                <span className="text-gray-600">•</span>
                <span>{dictionary.hero.templates}</span>
                <span className="text-gray-600">•</span>
                <span>{dictionary.hero.launchTime}</span>
              </motion.div>
            </motion.div>

            {/* Right Side - Visual/Features */}
            <motion.div
              {...HERO_ANIMATIONS.rightContent}
              className="flex-1 w-full"
            >
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-5 lg:gap-6">
                {heroFeatures.map((feature, index) => (
                  <HeroFeatureCard key={`hero-${feature.title}`} feature={feature} index={index} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section className="py-20 sm:py-24 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16 lg:mb-20"
          >
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 ${dmSerif.className}`}>
              {dictionary.features.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {dictionary.features.subtitle}
            </p>
          </motion.div>

          <div className="space-y-16 lg:space-y-24">
            {features.map((feature, index) => (
              <FeatureCard key={`feature-${feature.title}`} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 sm:py-24 lg:py-32 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 ${dmSerif.className}`}>
              {dictionary.faq.title}
            </h2>
            <p className="text-xl text-gray-600">
              {dictionary.faq.subtitle}
            </p>
          </motion.div>

          <div className="space-y-4">
            {dictionary.faq.items.map((faq, index) => (
              <motion.div
                key={`faq-${faq.question}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
              >
                <button
                  onClick={() => handleFaqToggle(index)}
                  aria-expanded={activeFaq === index}
                  aria-controls={`faq-answer-${index}`}
                  className="w-full px-6 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="text-lg font-bold text-gray-900 pr-8">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-6 h-6 text-gray-600 flex-shrink-0 transition-transform duration-300 ${
                      activeFaq === index ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                <motion.div
                  id={`faq-answer-${index}`}
                  initial={false}
                  animate={{
                    height: activeFaq === index ? 'auto' : 0,
                    opacity: activeFaq === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                  role="region"
                >
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Link href={`/${lang}/contact`} className="text-black font-bold underline hover:text-gray-700 transition-colors">
              Contact our support team
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <OptimizedImage
            src="/image/Matters.avif"
            alt="Final CTA background"
            type={ImageType.STATIC_BACKGROUND}
            fill
            sizes="100vw"
            className="object-cover opacity-10"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2
              className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 ${dmSerif.className}`}
            >
              <SafeHtmlRenderer text={dictionary.cta.title} />
            </h2>
            <p
              className="text-xl lg:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              <SafeHtmlRenderer text={dictionary.cta.subtitle} />
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href={`/${lang}/generate`}>
                <motion.button
                  {...BUTTON_ANIMATIONS.primary}
                  aria-label="Start building your website for free"
                  className="bg-white text-black px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
                >
                  {dictionary.cta.startBuilding} <ArrowRight size={20} aria-hidden="true" />
                </motion.button>
              </Link>
              <Link href={`/${lang}/templates`}>
                <motion.button
                  {...BUTTON_ANIMATIONS.primary}
                  aria-label="Browse all website templates"
                  className="border-2 border-white text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white hover:text-black transition-all duration-200"
                >
                  {dictionary.cta.browseTemplates}
                </motion.button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                <span>{dictionary.cta.sslSecured}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>{dictionary.cta.noCreditCardRequired}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{dictionary.cta.users}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>{dictionary.cta.awardWinning}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
