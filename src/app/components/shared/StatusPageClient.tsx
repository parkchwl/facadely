'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import type { StatusPageDictionary } from '@/types/dictionary';

const dmSerif = { className: 'font-serif' } as const;

// ==================== Configuration Constants ====================

const CONFIG = {
  ANIMATION_DURATION_FAST: 0.3,
  ANIMATION_DURATION_MEDIUM: 0.6,
  ANIMATION_DURATION_SLOW: 0.8,
  STAGGER_DELAY: 0.1,
  STAGGER_CHILDREN_DELAY: 0.2,
  LAST_CHECKED_UPDATE_INTERVAL: 60000, // 1 minute
} as const;

// ==================== Service Status Data ====================

const SERVICES = [
  {
    id: 1,
    name: 'Website Builder',
    description: 'Drag-and-drop editor and template system',
    status: 'operational',
    uptime: 99.98,
    lastUpdated: '2 minutes ago'
  },
  {
    id: 2,
    name: 'API & Integrations',
    description: 'REST APIs and third-party integrations',
    status: 'operational',
    uptime: 99.95,
    lastUpdated: '5 minutes ago'
  },
  {
    id: 3,
    name: 'Domain & SSL',
    description: 'Domain registration and SSL certificates',
    status: 'operational',
    uptime: 100,
    lastUpdated: '3 minutes ago'
  },
  {
    id: 4,
    name: 'Analytics Dashboard',
    description: 'Real-time visitor tracking and analytics',
    status: 'operational',
    uptime: 99.92,
    lastUpdated: '1 minute ago'
  },
  {
    id: 5,
    name: 'Email Services',
    description: 'Email notifications and marketing tools',
    status: 'operational',
    uptime: 99.99,
    lastUpdated: '4 minutes ago'
  },
  {
    id: 6,
    name: 'Storage & CDN',
    description: 'Image hosting and content delivery',
    status: 'operational',
    uptime: 99.97,
    lastUpdated: '2 minutes ago'
  }
] as const;

// ==================== Incident History Data ====================

const INCIDENTS = [
  {
    id: 1,
    title: 'Scheduled Maintenance - Website Builder',
    description: 'We performed scheduled maintenance on the website builder infrastructure.',
    date: 'October 22, 2024',
    time: '02:00 - 02:30 UTC',
    severity: 'info',
    impact: 'Minor - Limited availability'
  },
  {
    id: 2,
    title: 'Analytics Dashboard Slowness',
    description: 'Experienced increased latency in the analytics dashboard due to high traffic.',
    date: 'October 18, 2024',
    time: '14:30 - 15:00 UTC',
    severity: 'warning',
    impact: 'Minor - Slow response times'
  },
  {
    id: 3,
    title: 'CDN Performance Improvement',
    description: 'Successfully upgraded CDN infrastructure for improved performance globally.',
    date: 'October 15, 2024',
    time: '00:00 - 06:00 UTC',
    severity: 'info',
    impact: 'None - Scheduled upgrade'
  }
] as const;

// ==================== Animation Variants ====================

const ANIMATIONS = {
  heroFadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: CONFIG.ANIMATION_DURATION_SLOW }
  },
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
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: CONFIG.ANIMATION_DURATION_MEDIUM }
    }
  },
  sectionFadeIn: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: CONFIG.ANIMATION_DURATION_MEDIUM }
  }
} as const;

// ==================== Style Classes ====================

const STYLES = {
  heroSection: 'relative pt-32 pb-16 px-6 sm:px-8 lg:px-12 overflow-hidden',
  heroBackground: 'absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none',
  heroTitle: `text-6xl sm:text-7xl md:text-8xl font-bold text-white mb-6 ${dmSerif.className}`,
  heroSubtitle: 'text-xl text-gray-300 max-w-3xl mb-8',
  statusSummaryGrid: 'grid grid-cols-1 sm:grid-cols-3 gap-6',
  statusCard: {
    operational: 'bg-gradient-to-br from-green-900/20 via-green-900/10 to-transparent border border-green-500/30 rounded-2xl p-6',
    uptime: 'bg-gradient-to-br from-blue-900/20 via-blue-900/10 to-transparent border border-blue-500/30 rounded-2xl p-6',
    checked: 'bg-gradient-to-br from-gray-900/20 via-gray-900/10 to-transparent border border-gray-500/30 rounded-2xl p-6'
  },
  statusIconGreen: 'w-5 h-5 text-green-400',
  statusIconBlue: 'w-5 h-5 text-blue-400',
  statusIconGray: 'w-5 h-5 text-gray-400',
  sectionHeader: `text-4xl sm:text-5xl font-bold text-white mb-4 ${dmSerif.className}`,
  sectionSubtitle: 'text-gray-400',
  serviceGrid: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
  serviceCard: 'bg-gradient-to-br from-white/5 via-white/3 to-transparent backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300',
  serviceCardTitle: 'text-xl font-bold text-white mb-1',
  serviceCardDescription: 'text-sm text-gray-400',
  statusBadge: 'inline-flex items-center gap-2 px-3 py-1 rounded-full border',
  incidentContainer: 'space-y-4',
  incidentCard: 'rounded-lg p-6 backdrop-blur-sm border border-white/10',
  incidentTitle: 'text-lg font-bold text-white mb-2',
  incidentDescription: 'text-sm text-gray-400 mb-3',
  ctaSection: 'px-6 sm:px-8 lg:px-12 py-20 border-t border-white/10',
  ctaTitle: `text-3xl sm:text-4xl font-bold text-white mb-4 ${dmSerif.className}`,
  ctaSubtitle: 'text-gray-400 mb-8 max-w-2xl mx-auto',
  ctaButton: 'bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition-all duration-200 hover:scale-105'
} as const;

// ==================== Status Badge Component ====================

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = React.memo(({ status }: StatusBadgeProps) => {
  const getStatusColor = useCallback(() => {
    switch (status) {
      case 'operational':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'degraded':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'down':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  }, [status]);

  const getStatusText = useCallback(() => {
    switch (status) {
      case 'operational':
        return 'Operational';
      case 'degraded':
        return 'Degraded';
      case 'down':
        return 'Down';
      default:
        return 'Unknown';
    }
  }, [status]);

  const getStatusIcon = useCallback(() => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-4 h-4" />;
      case 'degraded':
        return <AlertCircle className="w-4 h-4" />;
      case 'down':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  }, [status]);

  return (
    <div className={`${STYLES.statusBadge} ${getStatusColor()}`}>
      {getStatusIcon()}
      <span className="text-sm font-medium">{getStatusText()}</span>
    </div>
  );
});
StatusBadge.displayName = 'StatusBadge';

// ==================== Main Component ====================

interface StatusPageClientProps {
  dictionary: StatusPageDictionary;
}

export default function StatusPageClient({ dictionary }: StatusPageClientProps) {
  const [lastChecked] = useState<string>(() => new Date().toLocaleString());

  // Calculate status statistics
  const operationalCount = SERVICES.filter(s => s.status === 'operational').length;
  const averageUptime = (SERVICES.reduce((sum, s) => sum + s.uptime, 0) / SERVICES.length).toFixed(2);

  // Handler for subscribe button
  const handleSubscribe = useCallback(() => {
    // Placeholder for subscription logic
    alert('Subscribe functionality coming soon!');
  }, []);

  return (
    <div className="w-full bg-black min-h-app-vh">
      {/* Hero Section */}
      <section className={STYLES.heroSection}>
        <div className={STYLES.heroBackground}></div>

        <motion.div
          {...ANIMATIONS.heroFadeIn}
          className="max-w-6xl mx-auto relative z-10"
        >
          <h1 className={STYLES.heroTitle}>
            {dictionary.title}
          </h1>
          <p className={STYLES.heroSubtitle}>
            {dictionary.subtitle}
          </p>

          {/* Status Summary */}
          <div className={STYLES.statusSummaryGrid}>
            {/* Overall Status */}
            <motion.div
              variants={ANIMATIONS.itemVariants}
              initial="hidden"
              animate="show"
              className={STYLES.statusCard.operational}
            >
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className={STYLES.statusIconGreen} />
                <h3 className="text-sm font-semibold text-green-300">Overall Status</h3>
              </div>
              <p className="text-3xl font-bold text-white">All Systems Operational</p>
              <p className="text-sm text-gray-400 mt-2">{operationalCount}/{SERVICES.length} services running</p>
            </motion.div>

            {/* Average Uptime */}
            <motion.div
              variants={ANIMATIONS.itemVariants}
              initial="hidden"
              animate="show"
              className={STYLES.statusCard.uptime}
            >
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className={STYLES.statusIconBlue} />
                <h3 className="text-sm font-semibold text-blue-300">Average Uptime</h3>
              </div>
              <p className="text-3xl font-bold text-white">{averageUptime}%</p>
              <p className="text-sm text-gray-400 mt-2">Last 30 days</p>
            </motion.div>

            {/* Last Checked */}
            <motion.div
              variants={ANIMATIONS.itemVariants}
              initial="hidden"
              animate="show"
              className={STYLES.statusCard.checked}
            >
              <div className="flex items-center gap-3 mb-2">
                <Clock className={STYLES.statusIconGray} />
                <h3 className="text-sm font-semibold text-gray-300">Last Checked</h3>
              </div>
              <p className="text-2xl font-bold text-white">Just now</p>
              <p className="text-sm text-gray-400 mt-2">{lastChecked}</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Services Status Grid */}
      <section className="px-6 sm:px-8 lg:px-12 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            {...ANIMATIONS.sectionFadeIn}
            className="mb-12"
          >
            <h2 className={STYLES.sectionHeader}>
              Service Components
            </h2>
            <p className={STYLES.sectionSubtitle}>Status of individual services and components</p>
          </motion.div>

          <motion.div
            variants={ANIMATIONS.containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className={STYLES.serviceGrid}
          >
            {SERVICES.map((service) => (
              <motion.div
                key={service.id}
                variants={ANIMATIONS.itemVariants}
                className={STYLES.serviceCard}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className={STYLES.serviceCardTitle}>{service.name}</h3>
                    <p className={STYLES.serviceCardDescription}>{service.description}</p>
                  </div>
                  <StatusBadge status={service.status} />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Uptime (30d)</p>
                    <p className="text-lg font-bold text-white">{service.uptime}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                    <p className="text-lg font-bold text-gray-300">{service.lastUpdated}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Incidents & Maintenance */}
      <section className="px-6 sm:px-8 lg:px-12 py-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            {...ANIMATIONS.sectionFadeIn}
            className="mb-12"
          >
            <h2 className={STYLES.sectionHeader}>
              Incidents & Maintenance
            </h2>
            <p className={STYLES.sectionSubtitle}>Historical incidents and scheduled maintenance events</p>
          </motion.div>

          <motion.div
            className={STYLES.incidentContainer}
            variants={ANIMATIONS.containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {INCIDENTS.map((incident) => {
              const getSeverityColor = () => {
                switch (incident.severity) {
                  case 'info':
                    return 'border-l-4 border-l-blue-500 bg-blue-500/5';
                  case 'warning':
                    return 'border-l-4 border-l-yellow-500 bg-yellow-500/5';
                  default:
                    return 'border-l-4 border-l-gray-500 bg-gray-500/5';
                }
              };

              return (
                <motion.div
                  key={incident.id}
                  variants={ANIMATIONS.itemVariants}
                  className={`${STYLES.incidentCard} ${getSeverityColor()}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className={STYLES.incidentTitle}>{incident.title}</h3>
                      <p className={STYLES.incidentDescription}>{incident.description}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <div>
                          <span className="text-gray-600">Date:</span> {incident.date}
                        </div>
                        <div>
                          <span className="text-gray-600">Time:</span> {incident.time}
                        </div>
                        <div>
                          <span className="text-gray-600">Impact:</span> {incident.impact}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className={STYLES.ctaSection}>
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            {...ANIMATIONS.sectionFadeIn}
          >
            <h2 className={STYLES.ctaTitle}>
              Stay Updated
            </h2>
            <p className={STYLES.ctaSubtitle}>
              Subscribe to status updates and get notified about maintenance windows and incidents.
            </p>
            <motion.button
              onClick={handleSubscribe}
              className={STYLES.ctaButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe to Updates
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
