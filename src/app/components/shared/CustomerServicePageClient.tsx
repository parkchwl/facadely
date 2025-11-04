'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { DM_Serif_Display } from 'next/font/google';
import { Mail, MessageCircle, Phone, Clock, CheckCircle, Send } from 'lucide-react';
import Link from 'next/link';
import type { CustomerServicePageDictionary } from '@/types/dictionary';

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

// ================================================================================
// CONFIGURATION CONSTANTS
// ================================================================================
const CONFIG = {
  ANIMATION_DURATION_FAST: 0.3,
  ANIMATION_DURATION_MEDIUM: 0.6,
  ANIMATION_DURATION_SLOW: 0.8,
  STAGGER_DELAY: 0.1,
  STAGGER_CHILDREN_DELAY: 0.2,
  FORM_SUBMISSION_SUCCESS_DURATION: 3000,
} as const;

// Support Channels Data
const SUPPORT_CHANNELS = [
  {
    id: 1,
    icon: Mail,
    title: 'Email Support',
    description: 'Get detailed responses to your questions',
    responseTime: '24 hours',
    availability: '24/7',
    contact: 'support@facadely.com',
    features: ['Detailed responses', 'File attachments', 'Complete history']
  },
  {
    id: 2,
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Chat with our support team in real-time',
    responseTime: '< 2 minutes',
    availability: '9 AM - 6 PM (UTC)',
    contact: 'Available on website',
    features: ['Instant responses', 'Quick solutions', 'Human support']
  },
  {
    id: 3,
    icon: Phone,
    title: 'Phone Support',
    description: 'Speak directly with our support experts',
    responseTime: '< 5 minutes',
    availability: '9 AM - 6 PM (UTC)',
    contact: '+1 (555) 123-4567',
    features: ['Direct support', 'Voice communication', 'Complex issues']
  },
  {
    id: 4,
    icon: MessageCircle,
    title: 'Community Forum',
    description: 'Connect with other facadely users',
    responseTime: 'Variable',
    availability: '24/7',
    contact: 'community.facadely.com',
    features: ['Peer support', 'Tips & tricks', 'Network building']
  }
];

// Support Tiers
const SUPPORT_TIERS = [
  {
    name: 'Free',
    price: 'Free',
    responseTime: '24-48 hours',
    channels: ['Email'],
    features: [
      'Email support',
      'Help center access',
      'Community forum',
      'Basic troubleshooting'
    ]
  },
  {
    name: 'Pro',
    price: '$15/mo',
    responseTime: '< 8 hours',
    channels: ['Email', 'Chat'],
    features: [
      'Email & live chat support',
      'Help center access',
      'Community forum',
      'Priority queue',
      'Advanced troubleshooting',
      'Video tutorials'
    ],
    highlight: true
  },
  {
    name: 'Business',
    price: '$30/mo',
    responseTime: '< 2 hours',
    channels: ['Email', 'Chat', 'Phone'],
    features: [
      'Phone support',
      'Email & live chat support',
      'Help center access',
      'Community forum',
      'Priority queue',
      'Advanced troubleshooting',
      'Video tutorials',
      'Dedicated account manager'
    ]
  }
];

// Support Hours
const SUPPORT_HOURS = [
  { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM (UTC)' },
  { day: 'Saturday', hours: '10:00 AM - 4:00 PM (UTC)' },
  { day: 'Sunday', hours: 'Closed' },
  { day: 'Holidays', hours: 'Limited support' }
];

// ================================================================================
// ANIMATION VARIANTS
// ================================================================================
const ANIMATIONS = {
  containerVariants: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: CONFIG.STAGGER_DELAY
      }
    }
  },
  itemVariants: {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  },
  heroFadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: CONFIG.ANIMATION_DURATION_SLOW }
  },
  sectionFadeIn: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: CONFIG.ANIMATION_DURATION_MEDIUM }
  }
} as const;

// ================================================================================
// STYLE CLASSES
// ================================================================================
const STYLES = {
  // Hero Section
  heroSection: 'relative pt-32 pb-20 px-6 sm:px-8 lg:px-12 overflow-hidden',
  heroBackground: 'absolute inset-0 bg-gradient-to-b from-green-900/10 to-transparent pointer-events-none',
  heroTitle: `text-6xl sm:text-7xl md:text-8xl font-bold text-white mb-6 ${dmSerif.className}`,
  heroSubtitle: 'text-xl text-gray-300 max-w-3xl mb-8',

  // Stats
  statsGrid: 'grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12',
  statItem: 'flex items-center gap-3',
  statLabel: 'text-sm text-gray-400',
  statValue: 'text-lg font-bold text-white',

  // Sections
  sectionContainer: 'px-6 sm:px-8 lg:px-12 py-16',
  sectionBorder: 'border-t border-white/10',
  maxWidth: 'max-w-6xl mx-auto',

  // Cards
  channelCard: 'bg-gradient-to-br from-white/5 via-white/3 to-transparent backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300',
  tierCard: 'rounded-2xl p-8 backdrop-blur-lg transition-all duration-300',
  tierCardHighlight: 'bg-gradient-to-br from-green-900/30 via-green-900/10 to-transparent border-2 border-green-500/50 lg:scale-105',
  tierCardDefault: 'bg-gradient-to-br from-white/5 via-white/3 to-transparent border border-white/10 hover:border-white/20',

  // Icons
  iconBackground: 'w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center',
  iconColor: 'w-6 h-6 text-green-400',
  iconSmall: 'w-5 h-5 text-green-400',

  // Form
  formContainer: 'bg-gradient-to-br from-white/5 via-white/3 to-transparent backdrop-blur-lg border border-white/10 rounded-2xl p-8',
  formInput: 'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/40 transition-colors duration-300',
  formButton: 'w-full py-4 px-6 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2',

  // Lists
  featureList: 'space-y-3 mb-8',
  featureItem: 'flex items-start gap-3',
  featureIcon: 'w-4 h-4 text-green-400 flex-shrink-0 mt-1',
  featureText: 'text-gray-300 text-sm',

  // Divider
  divider: 'py-4 border-b border-white/10 last:border-0'
} as const;

interface CustomerServicePageClientProps {
  dictionary: CustomerServicePageDictionary;
}

export default function CustomerServicePageClient({ dictionary }: CustomerServicePageClientProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, CONFIG.FORM_SUBMISSION_SUCCESS_DURATION);
  }, []);

  return (
    <div className="w-full bg-black min-h-screen">
      {/* Hero Section */}
      <section className={STYLES.heroSection}>
        <div className={STYLES.heroBackground}></div>

        <motion.div
          {...ANIMATIONS.heroFadeIn}
          className={`${STYLES.maxWidth} relative z-10`}
        >
          <h1 className={STYLES.heroTitle}>
            {dictionary.title}
          </h1>
          <p className={STYLES.heroSubtitle}>
            {dictionary.subtitle}
          </p>

          {/* Quick Stats */}
          <div className={STYLES.statsGrid}>
            <motion.div variants={ANIMATIONS.itemVariants} className={STYLES.statItem}>
              <Clock className={STYLES.iconSmall} />
              <div>
                <p className={STYLES.statLabel}>Average Response</p>
                <p className={STYLES.statValue}>2 hours</p>
              </div>
            </motion.div>
            <motion.div variants={ANIMATIONS.itemVariants} className={STYLES.statItem}>
              <CheckCircle className={STYLES.iconSmall} />
              <div>
                <p className={STYLES.statLabel}>Resolution Rate</p>
                <p className={STYLES.statValue}>98%</p>
              </div>
            </motion.div>
            <motion.div variants={ANIMATIONS.itemVariants} className={STYLES.statItem}>
              <MessageCircle className={STYLES.iconSmall} />
              <div>
                <p className={STYLES.statLabel}>Support Channels</p>
                <p className={STYLES.statValue}>4 Options</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Support Channels */}
      <section className={STYLES.sectionContainer}>
        <div className={STYLES.maxWidth}>
          <motion.div {...ANIMATIONS.sectionFadeIn} className="mb-12">
            <h2 className={`text-4xl sm:text-5xl font-bold text-white mb-4 ${dmSerif.className}`}>
              Support Channels
            </h2>
            <p className="text-gray-400">Multiple ways to reach our support team</p>
          </motion.div>

          <motion.div
            variants={ANIMATIONS.containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {SUPPORT_CHANNELS.map((channel) => {
              const Icon = channel.icon;
              return (
                <motion.div
                  key={channel.id}
                  variants={ANIMATIONS.itemVariants}
                  className={STYLES.channelCard}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={STYLES.iconBackground}>
                      <Icon className={STYLES.iconColor} />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">{channel.title}</h3>
                  <p className="text-gray-400 mb-6">{channel.description}</p>

                  <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Response Time</span>
                      <span className="text-sm font-semibold text-white">{channel.responseTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Availability</span>
                      <span className="text-sm font-semibold text-white">{channel.availability}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 mb-4">Contact:</p>
                  <p className="text-lg font-semibold text-blue-400 break-all">{channel.contact}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Support Tiers */}
      <section className={`${STYLES.sectionContainer} ${STYLES.sectionBorder}`}>
        <div className={STYLES.maxWidth}>
          <motion.div {...ANIMATIONS.sectionFadeIn} className="mb-12">
            <h2 className={`text-4xl sm:text-5xl font-bold text-white mb-4 ${dmSerif.className}`}>
              Support Plans
            </h2>
            <p className="text-gray-400">Different support levels for different needs</p>
          </motion.div>

          <motion.div
            variants={ANIMATIONS.containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {SUPPORT_TIERS.map((tier) => (
              <motion.div
                key={tier.name}
                variants={ANIMATIONS.itemVariants}
                className={`${STYLES.tierCard} ${
                  tier.highlight ? STYLES.tierCardHighlight : STYLES.tierCardDefault
                }`}
              >
                {tier.highlight && (
                  <div className="mb-4">
                    <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-3xl font-bold text-white mb-2">{tier.price}</p>
                <p className="text-sm text-gray-400 mb-6">Response time: {tier.responseTime}</p>

                <div className="mb-6 pb-6 border-b border-white/10">
                  <p className="text-xs font-semibold text-gray-400 mb-3">Support Channels</p>
                  <div className="flex gap-2 flex-wrap">
                    {tier.channels.map((channel, idx) => (
                      <span key={idx} className="bg-white/10 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {channel}
                      </span>
                    ))}
                  </div>
                </div>

                <ul className={STYLES.featureList}>
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className={STYLES.featureItem}>
                      <CheckCircle className={STYLES.featureIcon} />
                      <span className={STYLES.featureText}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/pricing" className="block w-full py-3 px-4 bg-green-500 text-white rounded-lg font-semibold text-center hover:bg-green-600 transition-colors duration-200">
                  View Pricing
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Support Hours */}
      <section className={`${STYLES.sectionContainer} ${STYLES.sectionBorder}`}>
        <div className={STYLES.maxWidth}>
          <motion.div {...ANIMATIONS.sectionFadeIn} className="mb-12">
            <h2 className={`text-4xl sm:text-5xl font-bold text-white mb-4 ${dmSerif.className}`}>
              Support Hours
            </h2>
            <p className="text-gray-400">When our team is available to help</p>
          </motion.div>

          <motion.div
            variants={ANIMATIONS.containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className={STYLES.formContainer}>
              <div className="space-y-4">
                {SUPPORT_HOURS.map((item, idx) => (
                  <motion.div
                    key={idx}
                    variants={ANIMATIONS.itemVariants}
                    className={STYLES.divider}
                  >
                    <span className="font-semibold text-white">{item.day}</span>
                    <span className="text-gray-400 ml-4">{item.hours}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-300">
                  <strong>Note:</strong> Response times guaranteed during business hours. Emergency issues may receive support outside these hours.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section className={`${STYLES.sectionContainer} ${STYLES.sectionBorder}`}>
        <div className="max-w-2xl mx-auto">
          <motion.div {...ANIMATIONS.sectionFadeIn} className="mb-12">
            <h2 className={`text-4xl sm:text-5xl font-bold text-white mb-4 ${dmSerif.className}`}>
              {dictionary.contactForm.title}
            </h2>
            <p className="text-gray-400">Fill out the form below and we will get back to you as soon as possible</p>
          </motion.div>

          <motion.form
            {...ANIMATIONS.sectionFadeIn}
            onSubmit={handleSubmit}
            className={STYLES.formContainer}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">{dictionary.contactForm.name}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className={STYLES.formInput}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">{dictionary.contactForm.email}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className={STYLES.formInput}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-white mb-2">{dictionary.contactForm.subject}</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="What is this about?"
                className={STYLES.formInput}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-white mb-2">{dictionary.contactForm.message}</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Tell us how we can help..."
                className={STYLES.formInput}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitted}
              className={STYLES.formButton}
            >
              {isSubmitted ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Message Sent!
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {dictionary.contactForm.submit}
                </>
              )}
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
