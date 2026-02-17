'use client';
import { useParams } from 'next/navigation';
import type { PricingPageDictionary } from '@/types/dictionary';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

// FeatureValue component remains the same as it's a presentational utility
const FeatureValue = React.memo(({ value }: { value: boolean | string }) => {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="h-5 w-5 text-green-400 mx-auto" />
    ) : (
      <X className="h-5 w-5 text-gray-600 mx-auto" />
    );
  }
  return <span className="text-sm text-center">{value}</span>;
});
FeatureValue.displayName = 'FeatureValue';

// Configuration Constants
const CONFIG = {
  STICKY_HEADER_HEIGHT: '128px',
  ANIMATION_DURATION_FAST: 0.3,
  ANIMATION_DURATION_MEDIUM: 0.6,
  STAGGER_DELAY: 0.1,
  STAGGER_CHILDREN_DELAY: 0.2,
  BACKGROUND_IMAGE: '/image/Pricing.avif',
  BACKGROUND_OPACITY: 0.6,
  INTERSECTION_THRESHOLD: 0,
  INTERSECTION_ROOT_MARGIN: '-120px 0px 0px 0px',
  INTERSECTION_AMOUNT: 0.1,
} as const;

// Animation Variants
const ANIMATIONS = {
  fadeIn: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: CONFIG.ANIMATION_DURATION_MEDIUM } },
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: CONFIG.STAGGER_DELAY,
        delayChildren: CONFIG.STAGGER_CHILDREN_DELAY
      }
    }
  },
  buttonHover: { scale: 1.02, y: -2 },
  buttonTap: { scale: 0.98 },
  cardHover: { scale: 1.02 },
  cardTap: { scale: 0.95 },
} as const;

// Style Classes
const STYLES = {
  stickyHeader: 'fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-b border-gray-800 z-50 transition-transform duration-300 ease-out',
  pricingCard: 'relative group rounded-3xl p-8 sm:p-10 lg:p-12 h-full transition-all duration-300 flex flex-col cursor-pointer overflow-hidden hover:-translate-y-2 hover:scale-[1.02]',
  pricingCardPro: 'bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-transparent backdrop-blur-xl lg:scale-105 lg:-mt-8 lg:mb-8',
  pricingCardBusiness: 'bg-gradient-to-br from-slate-800/50 via-gray-800/40 to-transparent backdrop-blur-xl lg:scale-102 lg:-mt-4 lg:mb-4',
  pricingCardFree: 'bg-gradient-to-br from-white/5 via-white/3 to-transparent backdrop-blur-lg',
  buttonPrimary: 'w-full sm:w-auto px-6 sm:px-8 lg:px-12 py-3 sm:py-4 bg-white text-black font-bold text-sm sm:text-base lg:text-lg rounded-full shadow-lg hover:bg-gray-100 transition-all duration-200 hover:shadow-xl',
  buttonSecondary: 'w-full sm:w-auto px-6 sm:px-8 lg:px-12 py-3 sm:py-4 border-2 border-white text-white font-bold text-sm sm:text-base lg:text-lg rounded-full hover:bg-white hover:text-black transition-all duration-200',
} as const;

export default function PricingPageClient({ dictionary }: { dictionary: PricingPageDictionary }) {
  useParams() as { lang: string };
  const [isYearly, setIsYearly] = useState(true);
  const [stickyPlan, setStickyPlan] = useState(false);
  const stickyHeaderRef = useRef(null);
  const pricingSectionRef = useRef<HTMLDivElement>(null);

  // Data is now from the dictionary
  const pricingTiers = useMemo(() => [dictionary.tiers.free, dictionary.tiers.pro, dictionary.tiers.business], [dictionary]);
  const featureCategories = useMemo(() => Object.values(dictionary.featureComparison.categories), [dictionary]);

  useEffect(() => {
    const pricingSection = pricingSectionRef.current;
    if (!pricingSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setStickyPlan(!entry.isIntersecting);
      },
      {
        threshold: CONFIG.INTERSECTION_THRESHOLD,
        rootMargin: CONFIG.INTERSECTION_ROOT_MARGIN
      }
    );

    observer.observe(pricingSection);
    return () => observer.disconnect();
  }, []);

  const fadeIn = ANIMATIONS.fadeIn;
  const staggerContainer = ANIMATIONS.staggerContainer;

  const handleMonthlyToggle = useCallback(() => {
    setIsYearly(false);
  }, []);

  const handleYearlyToggle = useCallback(() => {
    setIsYearly(true);
  }, []);

  return (
    <main className="relative bg-black min-h-app-vh text-white">
      <div
        className="fixed inset-0 h-app-vh overflow-hidden"
        style={{
          backgroundImage: `url(${CONFIG.BACKGROUND_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: CONFIG.BACKGROUND_OPACITY,
          zIndex: 0
        }}
      ></div>
      <div
        ref={stickyHeaderRef}
        className={`${STYLES.stickyHeader} ${
          stickyPlan ? 'transform translate-y-0' : 'transform -translate-y-full'
        }`}
        style={{ height: CONFIG.STICKY_HEADER_HEIGHT }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4 h-full flex items-center">
          <div className="grid grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-full">
              <div className="col-span-1"></div>
              {pricingTiers.map((tier) => (
                  <div key={tier.name} className="text-center">
                  <div className="text-sm text-gray-400 mb-1">{tier.name}</div>
                  <div className="text-base sm:text-lg font-bold">
                      {isYearly ? tier.yearlyPrice : tier.monthlyPrice}
                  </div>
                  <button className="mt-2 px-2 sm:px-4 py-1 sm:py-2 text-xs rounded-full transition-all duration-200 bg-white text-black hover:bg-gray-100">
                      {tier.buttonText}
                  </button>
                  </div>
              ))}
          </div>
        </div>
      </div>

      <motion.section
        ref={pricingSectionRef}
        id="pricing-cards"
        className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-32 sm:pt-40 pb-20 sm:pb-28 lg:pb-40"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 xl:gap-16 items-start">
            <motion.div variants={fadeIn} className="lg:sticky top-24">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 lg:mb-8 leading-tight bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                {dictionary.title}
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 lg:mb-12 leading-relaxed">
                {dictionary.subtitle}
              </p>

              <div className="flex items-center justify-start">
                <div className="flex items-center bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-lg rounded-full p-1.5 border-2 border-white/20 shadow-xl">
                  <button
                      onClick={handleMonthlyToggle}
                      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                      !isYearly
                          ? 'bg-white text-black shadow-lg'
                          : 'text-gray-400 hover:text-white'
                      }`}
                  >
                      {dictionary.toggle.monthly}
                  </button>
                  <button
                      onClick={handleYearlyToggle}
                      className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                      isYearly
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                          : 'text-gray-400 hover:text-white'
                      }`}
                  >
                      {dictionary.toggle.yearly}
                      <span className="text-xs text-white px-1 py-1 rounded-md bg-black/30">
                          {dictionary.toggle.save}
                      </span>
                  </button>
                </div>
              </div>
            </motion.div>

            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-12">
              {pricingTiers.map((tier) => {
                  const isPro = tier.name === dictionary.tiers.pro.name;
                  const isBusiness = tier.name === dictionary.tiers.business.name;
                  return (
                  <motion.div
                    key={tier.name}
                    variants={fadeIn}
                    className={`${STYLES.pricingCard} ${
                      isPro
                        ? STYLES.pricingCardPro
                        : isBusiness
                        ? STYLES.pricingCardBusiness
                        : STYLES.pricingCardFree
                    } ${
                      isPro ? 'pricing-card-pro' : isBusiness ? 'pricing-card-business' : 'pricing-card-free'
                    }`}
                  >
                    <div className="absolute top-0 left-0 w-0 h-0 border-t-2 border-l-2 border-white/40 rounded-tl-3xl opacity-0 group-hover:w-full group-hover:h-full group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>
                    <div className="absolute bottom-0 right-0 w-0 h-0 border-b-2 border-r-2 border-white/40 rounded-br-3xl opacity-0 group-hover:w-full group-hover:h-full group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col h-full">
                      {tier.badge && (
                        <div className="absolute -top-6 sm:-top-8 -right-6 sm:-right-8 px-4 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-full shadow-lg">
                          {tier.badge}
                        </div>
                      )}

                      <div className="mb-6 sm:mb-8">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-4">{tier.name}</h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                              {isYearly ? tier.yearlyPrice : tier.monthlyPrice}
                          </span>
                          {tier.perMonth && (
                            <span className="text-gray-300 text-lg sm:text-xl">{tier.perMonth}</span>
                          )}
                        </div>
                      </div>

                      <div className="mb-6 sm:mb-8 flex-grow">
                        <h4 className="text-sm sm:text-base font-medium text-gray-300 mb-4 sm:mb-6">
                          {tier.description}
                        </h4>
                        <ul className="space-y-3 sm:space-y-4">
                          {tier.features.map((feature: string, featureIndex: number) => (
                            <li key={featureIndex} className="flex items-start gap-3">
                              <span className="text-green-400 flex-shrink-0 mt-0.5">✔️</span>
                              <span className="text-sm sm:text-base text-gray-200 leading-relaxed">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-auto pt-6">
                        <motion.button
                          className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 ${
                            isPro
                              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                              : isBusiness
                              ? 'bg-gradient-to-r from-slate-700 to-gray-700 text-white hover:from-slate-800 hover:to-gray-800 shadow-lg hover:shadow-xl'
                              : 'bg-white text-black hover:bg-gray-100 shadow-lg hover:shadow-xl'
                          }`}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {tier.buttonText}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                  )}
              )}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="feature-comparison"
        className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-16 sm:py-20 lg:py-32 bg-black"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
      >
        <div className="w-full">
          <motion.div className="text-left mb-12 sm:mb-16 lg:mb-24" variants={fadeIn}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 sm:mb-6 lg:mb-8 text-white leading-tight">
              {dictionary.featureComparison.title}
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-400 leading-relaxed">
              {dictionary.featureComparison.subtitle}
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="bg-black rounded-2xl sm:rounded-3xl border border-gray-800 overflow-hidden">
            {featureCategories.map((category) => (
              <React.Fragment key={category.name}>
                <div className="grid grid-cols-1 border-t border-gray-800">
                   <div className="col-span-1 p-4 sm:p-6 bg-gray-950/70">
                       <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{category.name}</h3>
                   </div>
                </div>

                {Object.values(category.features).map((feature, featureIndex: number) => (
                  <div
                    key={feature.name}
                    className="grid grid-cols-4 gap-0 border-t border-gray-800"
                  >
                    <div className={`p-4 sm:p-6 text-left ${featureIndex % 2 === 0 ? 'bg-black' : 'bg-black'}`}>
                      <span className="text-sm sm:text-base font-medium text-gray-200">{feature.name}</span>
                    </div>
                    <div className={`p-4 sm:p-6 text-center border-l border-gray-800 ${featureIndex % 2 === 0 ? 'bg-black' : 'bg-black'}`}>
                      <FeatureValue value={feature.free} />
                    </div>
                    <div className="p-4 sm:p-6 text-center border-l border-gray-800 bg-purple-950/40">
                      <FeatureValue value={feature.pro} />
                    </div>
                    <div className={`p-4 sm:p-6 text-center border-l border-gray-800 ${featureIndex % 2 === 0 ? 'bg-black' : 'bg-black'}`}>
                      <FeatureValue value={feature.business} />
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-12 sm:mt-16 lg:mt-24"
            variants={fadeIn}
          >
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-6 sm:mb-8 lg:mb-12 text-white">{dictionary.cta.title}</h3>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center items-center">
              <motion.button
                className={STYLES.buttonPrimary}
                whileHover={ANIMATIONS.buttonHover}
                whileTap={ANIMATIONS.buttonTap}
              >
                {dictionary.cta.startTrial}
              </motion.button>
              <motion.button
                className={STYLES.buttonSecondary}
                whileHover={ANIMATIONS.buttonHover}
                whileTap={ANIMATIONS.buttonTap}
              >
                {dictionary.cta.contactSales}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}
