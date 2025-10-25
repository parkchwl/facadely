'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { DM_Serif_Display } from 'next/font/google';
import {
  Zap,
  Palette,
  Smartphone,
  Search,
  TrendingUp,
  Globe,
  Lock,
  Monitor,
  ChevronDown,
  Check,
  ArrowRight,
  Users,
  Award
} from 'lucide-react';

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

// Hero Features - Extended
const heroFeatures = [
  {
    icon: Palette,
    title: 'Professional Design',
    description: 'Designer-made templates optimized for conversion'
  },
  {
    icon: Search,
    title: 'Built-in SEO',
    description: 'Rank higher on Google with advanced SEO tools'
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description: 'SSL certificates, auto-backups, 99.9% uptime'
  },
  {
    icon: Globe,
    title: 'Custom Domain',
    description: 'Connect your domain or get a free one'
  },
  {
    icon: Smartphone,
    title: 'Mobile Responsive',
    description: 'Perfect on all devices automatically'
  },
  {
    icon: TrendingUp,
    title: 'Real-time Analytics',
    description: 'Track visitors and make data-driven decisions'
  }
];

// Features Data - Reduced to 4 key features
const features = [
  {
    icon: Zap,
    title: 'Lightning Fast Setup',
    description: 'Launch your website in just 5 minutes. No installation, no setup headaches. Choose a template and start editing immediately.',
    highlights: ['5-minute launch', 'Instant start', 'Zero setup required'],
    image: '/image/Generate.webp'
  },
  {
    icon: Palette,
    title: 'Professional Design',
    description: 'Every template is crafted by professional designers. Modern, trendy, and conversion-optimized designs that make your brand shine.',
    highlights: ['Designer-made templates', 'Trendy & modern', 'Brand customization'],
    image: '/image/Matters.webp'
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Responsive',
    description: 'All websites are fully responsive by default. Your site looks perfect on every device - desktop, tablet, and mobile.',
    highlights: ['100% responsive', 'Perfect on all devices', 'Mobile optimized'],
    image: '/image/Generate.webp'
  },
  {
    icon: Lock,
    title: '24/7 Security & Support',
    description: 'SSL certificates, automatic backups, and 99.9% uptime guaranteed. Our support team is here to help anytime.',
    highlights: ['SSL included', 'Auto backups', '24/7 support'],
    image: '/image/Matters.webp'
  }
];

// How It Works Steps
const steps = [
  {
    number: '01',
    title: 'Choose Template',
    description: 'Browse 500+ professional templates and pick the one that fits your vision.',
    icon: Palette
  },
  {
    number: '02',
    title: 'Customize Your Site',
    description: 'Use our drag & drop editor to personalize every element. No coding needed.',
    icon: Monitor
  },
  {
    number: '03',
    title: 'Launch & Grow',
    description: 'Hit publish and your website goes live instantly. Start growing your business today.',
    icon: Zap
  }
];

// FAQ Data
const faqs = [
  {
    question: 'How quickly can I launch my website?',
    answer: 'You can launch a professional website in as little as 5 minutes. Simply choose a template, customize it with our drag & drop editor, and hit publish. No technical knowledge required.'
  },
  {
    question: 'Do I need coding skills?',
    answer: 'Absolutely not! facadely is designed for everyone. Our intuitive visual editor lets you create stunning websites without writing a single line of code.'
  },
  {
    question: 'Can I use my own domain name?',
    answer: 'Yes! You can connect your existing domain or purchase a new one directly through facadely. We handle all the technical setup automatically.'
  },
  {
    question: 'Are websites mobile-responsive?',
    answer: 'Every template is fully responsive and optimized for all devices. Your website will look perfect on desktop, tablet, and mobile automatically.'
  },
  {
    question: 'What kind of support do you offer?',
    answer: 'We provide 24/7 customer support via chat and email. Our extensive help center includes video tutorials, guides, and documentation to help you succeed.'
  },
  {
    question: 'Can I add e-commerce functionality?',
    answer: 'Yes! Our Pro and Business plans include full e-commerce capabilities with payment processing, inventory management, and order tracking.'
  }
];

export default function ServicePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // SEO - Update document metadata
  useEffect(() => {
    // Update title
    document.title = 'Our Services - Professional Website Builder | facadely';

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Build a professional website in minutes with facadely. No coding required. Lightning fast setup, premium templates, mobile-responsive design, and 24/7 support.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Build a professional website in minutes with facadely. No coding required. Lightning fast setup, premium templates, mobile-responsive design, and 24/7 support.';
      document.head.appendChild(meta);
    }

    // Update keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'website builder, no code website, professional website design, responsive websites, website templates, web design service');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = 'website builder, no code website, professional website design, responsive websites, website templates, web design service';
      document.head.appendChild(meta);
    }

    // Open Graph tags
    const updateOgTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (tag) {
        tag.setAttribute('content', content);
      } else {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        tag.setAttribute('content', content);
        document.head.appendChild(tag);
      }
    };

    updateOgTag('og:title', 'Our Services - Professional Website Builder | facadely');
    updateOgTag('og:description', 'Create stunning websites in 5 minutes. No coding skills needed. 500+ templates, built-in SEO, and enterprise security.');
    updateOgTag('og:type', 'website');
    updateOgTag('og:url', 'https://facadely.com/service');
    updateOgTag('og:image', 'https://facadely.com/image/Service.webp');
    updateOgTag('og:image:width', '1200');
    updateOgTag('og:image:height', '630');
    updateOgTag('og:image:alt', 'facadely Website Builder Services');

    // Twitter Card tags
    const updateTwitterTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (tag) {
        tag.setAttribute('content', content);
      } else {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        tag.setAttribute('content', content);
        document.head.appendChild(tag);
      }
    };

    updateTwitterTag('twitter:card', 'summary_large_image');
    updateTwitterTag('twitter:title', 'Our Services - Professional Website Builder | facadely');
    updateTwitterTag('twitter:description', 'Build a professional website in minutes. No coding required.');
    updateTwitterTag('twitter:image', 'https://facadely.com/image/Service.webp');

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'facadely';
    };
  }, []);

  return (
    <div className="min-h-screen bg-white -mt-16 sm:-mt-20 lg:-mt-24">
      {/* Hero Section - Option 2 Layout with Option 4 Headline Style */}
      <section className="relative min-h-[80vh] max-h-[1000px] flex items-center justify-center overflow-hidden bg-black py-12 sm:py-16 lg:py-20 xl:py-24">
        <div className="absolute inset-0">
          <Image
            src="/image/Service.webp"
            alt="Service hero background"
            fill
            priority
            quality={75}
            sizes="100vw"
            className="object-cover opacity-30"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-left"
            >
              {/* Main Headline */}
              <h1 className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[100px] font-extrabold text-white tracking-tight leading-[0.9] mb-8 ${dmSerif.className}`}
                  style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)' }}>
                We Service<br />for your Dream
              </h1>

              {/* Sub Headline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl sm:text-2xl lg:text-3xl text-gray-200 leading-relaxed mb-10 font-light"
              >
                Build a professional website in minutes — No code, No hassle
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-start gap-4 mb-10"
              >
                <Link href="/generate">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Start building your website for free"
                    className="bg-white text-black px-8 py-4 lg:px-10 lg:py-5 rounded-full font-bold text-lg shadow-2xl hover:bg-gray-100 transition-all duration-200 w-full sm:w-auto"
                  >
                    Start Building Free
                  </motion.button>
                </Link>
                <Link href="/templates">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Browse website templates"
                    className="border-2 border-white/30 text-white px-8 py-4 lg:px-10 lg:py-5 rounded-full font-bold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-200 backdrop-blur-sm w-full sm:w-auto"
                  >
                    Browse Templates
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
                <span>No credit card required</span>
                <span className="text-gray-600">•</span>
                <span>500+ templates</span>
                <span className="text-gray-600">•</span>
                <span>Launch in 5 minutes</span>
              </motion.div>
            </motion.div>

            {/* Right Side - Visual/Features */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 w-full"
            >
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-5 lg:gap-6">
                {heroFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
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
              Powerful Features, Simple Interface
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create, launch, and grow your online presence
            </p>
          </motion.div>

          <div className="space-y-16 lg:space-y-24">
            {features.map((feature, index) => (
              <motion.div
                key={index}
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
                        <Image
                          src={feature.image}
                          alt={`${feature.title} feature screenshot`}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
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
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about facadely
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
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
            <Link href="/contact" className="text-black font-bold underline hover:text-gray-700 transition-colors">
              Contact our support team
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/image/InMatters.webp"
            alt="Final CTA background"
            fill
            quality={75}
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
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 ${dmSerif.className}`}>
              Ready to Build Your<br />Dream Website?
            </h2>
            <p className="text-xl lg:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of successful businesses who trust facadely.<br />
              Start for free. No credit card required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/generate">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Start building your website for free"
                  className="bg-white text-black px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
                >
                  Start Building Free <ArrowRight size={20} aria-hidden="true" />
                </motion.button>
              </Link>
              <Link href="/templates">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Browse all website templates"
                  className="border-2 border-white text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white hover:text-black transition-all duration-200"
                >
                  Browse Templates
                </motion.button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>No Credit Card</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>100K+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>Award Winning</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
