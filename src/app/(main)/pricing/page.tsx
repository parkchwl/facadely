'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const pricingTiers = [
  {
    name: 'Free',
    category: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Perfect for getting started with your first website.',
    features: [
      '1 Website',
      'Basic Templates',
      '500 MB Storage',
      'Standard Support',
      'SSL Certificate',
    ],
    buttonText: 'Start for Free',
    isFeatured: false,
    isGradient: false,
  },
  {
    name: 'Pro',
    category: '$15',
    monthlyPrice: 15,
    yearlyPrice: 12,
    description: 'Everything you need for professional websites.',
    features: [
      'Unlimited Websites',
      'Premium Templates',
      '10 GB Storage',
      'Priority Support',
      'Custom Domain',
      'Advanced Analytics',
      'SEO Tools',
      'Social Media Integration',
    ],
    buttonText: 'Choose Pro',
    isFeatured: true,
    isGradient: true,
  },
  {
    name: 'Business',
    category: '$30',
    monthlyPrice: 30,
    yearlyPrice: 24,
    description: 'Advanced features for growing businesses.',
    features: [
      'Everything in Pro',
      '50 GB Storage',
      'E-commerce Features',
      'Team Collaboration',
      'Dedicated Support',
      'White-label Solution',
      'API Access',
      'Advanced Security',
    ],
    buttonText: 'Choose Business',
    isFeatured: false,
    isGradient: false,
  },
];

const featureCategories = [
    {
      name: 'Basic Features',
      features: [
        { name: 'Pages', free: '5 pages', pro: 'Unlimited pages', business: 'Unlimited pages' },
        { name: 'Custom Domain', free: false, pro: true, business: true },
        { name: 'Storage', free: '500 MB', pro: '10 GB', business: '50 GB' },
        { name: 'Bandwidth', free: '1 GB', pro: '10 GB', business: '100 GB' },
        { name: 'Monthly Visits', free: '1K visits', pro: '25K visits', business: '100K visits' }
      ]
    },
    {
      name: 'Design & Content',
      features: [
        { name: 'Templates', free: 'Basic templates', pro: 'Premium templates', business: 'All templates + Custom' },
        { name: 'Custom Code', free: false, pro: true, business: true },
        { name: 'Font Upload', free: false, pro: true, business: true },
        { name: 'Design Mode', free: false, pro: true, business: true }
      ]
    },
    {
      name: 'E-commerce',
      features: [
        { name: 'Products', free: false, pro: '10 products', business: 'Unlimited products' },
        { name: 'Payment Gateway', free: false, pro: true, business: true },
        { name: 'Inventory Management', free: false, pro: true, business: true },
        { name: 'Coupons & Discounts', free: false, pro: '3 coupons', business: 'Unlimited coupons' },
        { name: 'Order Management', free: false, pro: true, business: true }
      ]
    },
    {
      name: 'Marketing & SEO',
      features: [
        { name: 'SEO Tools', free: 'Basic SEO', pro: 'Advanced SEO', business: 'Premium SEO + Analytics' },
        { name: 'Google Analytics', free: false, pro: true, business: true },
        { name: 'Social Media Integration', free: false, pro: true, business: true },
        { name: 'Email Marketing', free: false, pro: '100 emails/month', business: 'Unlimited emails' }
      ]
    },
    {
      name: 'Support & Security',
      features: [
        { name: 'Support', free: 'Community support', pro: 'Priority support', business: 'Dedicated support' },
        { name: 'SSL Certificate', free: true, pro: true, business: true },
        { name: 'Password Protection', free: false, pro: true, business: true },
        { name: 'Backup & Recovery', free: false, pro: 'Weekly backups', business: 'Daily backups' }
      ]
    }
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);
  const [stickyPlan, setStickyPlan] = useState(false);
  const stickyHeaderRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const featureSection = document.getElementById('feature-comparison');
      const pricingSection = document.getElementById('pricing-cards');
      
      if (featureSection && pricingSection) {
        const featureSectionTop = featureSection.getBoundingClientRect().top;
        const pricingSectionBottom = pricingSection.getBoundingClientRect().bottom;
        
        // 더 부드러운 임계점 설정과 하이스테리시스 적용
        const STICKY_THRESHOLD = 120;
        const UNSTICKY_THRESHOLD = 80;
        
        if (!stickyPlan && featureSectionTop <= STICKY_THRESHOLD && pricingSectionBottom < STICKY_THRESHOLD) {
          setStickyPlan(true);
        } else if (stickyPlan && (featureSectionTop > UNSTICKY_THRESHOLD || pricingSectionBottom >= UNSTICKY_THRESHOLD)) {
          setStickyPlan(false);
        }
      }
    };

    // throttle을 사용해 스크롤 이벤트 최적화
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll);
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [stickyPlan]); // stickyPlan 상태를 dependency에 추가

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

const renderFeatureValue = (value: boolean | string) => {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="h-5 w-5 text-green-400 mx-auto" />
    ) : (
      <X className="h-5 w-5 text-gray-600 mx-auto" />
    );
  }
  return <span className="text-sm text-center">{value}</span>;
};

  return (
    <main className="bg-black min-h-screen text-white">
      {/* Sticky Plan Headers - 높이를 고정하여 점프 방지 */}
      <div 
        ref={stickyHeaderRef}
        className={`fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-b border-gray-800 z-50 transition-transform duration-300 ease-out ${
          stickyPlan ? 'transform translate-y-0' : 'transform -translate-y-full'
        }`}
        style={{ height: '128px' }} // 고정 높이 설정
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4 h-full flex items-center">
          <div className="grid grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-full">
              <div className="col-span-1"></div>
              {pricingTiers.map((tier) => (
                  <div key={tier.name} className="text-center">
                  <div className="text-sm text-gray-400 mb-1">{tier.name}</div>
                  <div className="text-base sm:text-lg font-bold">
                      {isYearly ? `$${tier.yearlyPrice}`: `$${tier.monthlyPrice}`}
                  </div>
                  <button className="mt-2 px-2 sm:px-4 py-1 sm:py-2 text-xs rounded-full transition-all duration-200 bg-white text-black hover:bg-gray-100">
                      {tier.buttonText}
                  </button>
                  </div>
              ))}
          </div>
        </div>
      </div>

      {/* Pricing Cards Section - 패딩 조정 제거 */}
      <motion.section 
        id="pricing-cards"
        className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-32 sm:pt-40 pb-16 sm:pb-20 lg:pb-32"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 xl:gap-16 items-start">
            
            <motion.div variants={fadeIn} className="lg:sticky top-24">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 lg:mb-8 leading-tight">
                Pricing
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 lg:mb-12 leading-relaxed">
                Choose the plan that works for you
              </p>
              
              <div className="flex items-center justify-start">
                <div className="flex items-center bg-gray-900 rounded-full p-1">
                  <button
                      onClick={() => setIsYearly(false)}
                      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                      !isYearly 
                          ? 'bg-white text-black' 
                          : 'text-gray-600 hover:text-white'
                      }`}
                  >
                      MONTHLY
                  </button>
                  <button
                      onClick={() => setIsYearly(true)}
                      className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                      isYearly 
                          ? 'bg-white text-black' 
                          : 'text-gray-600 hover:text-white'
                      }`}
                  >
                      YEARLY
                      <span className="text-xs text-white px-1 py-1 rounded-md bg-gradient-to-r from-purple-800 to-indigo-600">
                          SAVE 20%
                      </span>
                  </button>
                </div>
              </div>
            </motion.div>

            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-12">
              {pricingTiers.map((tier) => (
                  <motion.div
                    key={tier.name}
                    variants={fadeIn}
                    className={`relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 h-full transition-all duration-300 flex flex-col transform hover:scale-105 hover:shadow-2xl ${
                      tier.isGradient 
                        ? 'bg-gradient-to-br from-slate-900 via-purple-950/90 to-indigo-950/80 border border-purple-800/30 ring-2 ring-purple-500/20' 
                        : 'bg-gray-950 border border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="mb-6 sm:mb-8">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-4">{tier.name}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                            {isYearly && tier.yearlyPrice > 0 ? `$${tier.yearlyPrice}`: ''}
                            {!isYearly && tier.monthlyPrice > 0 ? `$${tier.monthlyPrice}`: ''}
                            {tier.monthlyPrice === 0 ? 'Free': ''}
                        </span>
                        {tier.monthlyPrice > 0 && (
                          <span className="text-gray-300 text-lg sm:text-xl">/mo</span>
                        )}
                      </div>
                    </div>

                    <div className="mb-6 sm:mb-8 flex-grow">
                      <h4 className="text-sm sm:text-base font-medium text-gray-300 mb-4 sm:mb-6">
                        {tier.description}
                      </h4>
                      <ul className="space-y-3 sm:space-y-4">
                        {tier.features.map((feature, featureIndex) => (
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
                        className="w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 bg-white text-black hover:bg-gray-100 hover:shadow-lg"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {tier.buttonText}
                      </motion.button>
                    </div>
                  </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Feature Comparison Section */}
      <motion.section 
        id="feature-comparison"
        className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-16 sm:py-20 lg:py-32 bg-black"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
      >
        <div className="w-full">
          <motion.div className="text-left mb-12 sm:mb-16 lg:mb-24" variants={fadeIn}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 sm:mb-6 lg:mb-8 text-white leading-tight">
              Compare Plans
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-400 leading-relaxed">
              See what's included in each plan
            </p>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-black rounded-2xl sm:rounded-3xl border border-gray-800 overflow-hidden">
            {/* Feature Categories */}
            {featureCategories.map((category) => (
              <React.Fragment key={category.name}>
                {/* Category Title Row */}
                <div className="grid grid-cols-1 border-t border-gray-800">
                   <div className="col-span-1 p-4 sm:p-6 bg-gray-950/70">
                       <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{category.name}</h3>
                   </div>
                </div>

                {/* Feature Rows */}
                {category.features.map((feature, featureIndex) => (
                  <div 
                    key={feature.name}
                    className="grid grid-cols-4 gap-0 border-t border-gray-800"
                  >
                    <div className={`p-4 sm:p-6 text-left ${featureIndex % 2 === 0 ? 'bg-black' : 'bg-black'}`}>
                      <span className="text-sm sm:text-base font-medium text-gray-200">{feature.name}</span>
                    </div>
                    <div className={`p-4 sm:p-6 text-center border-l border-gray-800 ${featureIndex % 2 === 0 ? 'bg-black' : 'bg-black'}`}>
                      {renderFeatureValue(feature.free)}
                    </div>
                    <div className="p-4 sm:p-6 text-center border-l border-gray-800 bg-purple-950/40">
                      {renderFeatureValue(feature.pro)}
                    </div>
                    <div className={`p-4 sm:p-6 text-center border-l border-gray-800 ${featureIndex % 2 === 0 ? 'bg-black' : 'bg-black'}`}>
                      {renderFeatureValue(feature.business)}
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            className="text-center mt-12 sm:mt-16 lg:mt-24"
            variants={fadeIn}
          >
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-6 sm:mb-8 lg:mb-12 text-white">Ready to get started?</h3>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center items-center">
              <motion.button 
                className="w-full sm:w-auto px-6 sm:px-8 lg:px-12 py-3 sm:py-4 bg-white text-black font-bold text-sm sm:text-base lg:text-lg rounded-full shadow-lg hover:bg-gray-100 transition-all duration-200 hover:shadow-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Free Trial
              </motion.button>
              <motion.button 
                className="w-full sm:w-auto px-6 sm:px-8 lg:px-12 py-3 sm:py-4 border-2 border-white text-white font-bold text-sm sm:text-base lg:text-lg rounded-full hover:bg-white hover:text-black transition-all duration-200"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Sales
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}