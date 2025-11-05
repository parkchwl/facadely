'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Zap, Award, Users, Lightbulb, Heart, Shield } from 'lucide-react';
import type { AboutPageDictionary } from '@/types/dictionary';

interface AboutPageContentProps {
  dictionary: AboutPageDictionary;
}

// Icon mapping for values
const valueIcons: Record<string, React.ReactNode> = {
  'Simplicity': <Zap className="w-8 h-8" />,
  'Quality': <Award className="w-8 h-8" />,
  'Empowerment': <Users className="w-8 h-8" />,
  'Support': <Heart className="w-8 h-8" />,
  'Innovation': <Lightbulb className="w-8 h-8" />,
  'Trust': <Shield className="w-8 h-8" />,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function AboutPageContent({ dictionary }: AboutPageContentProps) {
  const params = useParams() as { lang: string };
  const { lang } = params;

  return (
    <main className="relative bg-black text-white overflow-hidden">
      {/* Hero Section - Brand Story + Mission + Vision + Values */}
      <section className="relative px-6 py-20 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black z-0" />
        <motion.div
          className="relative z-10 max-w-5xl mx-auto space-y-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Brand Story */}
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-7xl sm:text-8xl lg:text-9xl font-bold text-white"
            >
              ✦
            </motion.div>
            <p className="text-white text-2xl sm:text-3xl font-bold">
              {dictionary.brandStory.intro}
            </p>
            <div className="space-y-4 text-gray-300 leading-relaxed max-w-3xl mx-auto">
              {dictionary.brandStory.description.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-sm sm:text-base leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Mission */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 text-center"
          >
            <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-bold">
              {dictionary.mission.heading}
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-300 leading-relaxed max-w-3xl mx-auto">
              {dictionary.mission.content}
            </motion.p>
          </motion.div>

          {/* Vision */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 text-center"
          >
            <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-bold">
              {dictionary.vision.heading}
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-300 leading-relaxed max-w-3xl mx-auto">
              {dictionary.vision.content}
            </motion.p>
          </motion.div>

          {/* Values */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-bold text-center mb-8">
              {dictionary.values.heading}
            </motion.h2>
            <motion.div
              variants={containerVariants}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {dictionary.values.items.map((value, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="group relative p-6 rounded-xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:bg-gradient-to-br hover:from-purple-900/20 hover:to-blue-900/20"
                >
                  <div className="text-purple-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                    {valueIcons[value.title] || <Zap className="w-6 h-6" />}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-400">{value.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Impact Stats Section */}
      <section className="relative py-20 lg:py-32 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-bold mb-6">
              {dictionary.impact.heading}
            </motion.h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {dictionary.impact.stats.map((stat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-800 hover:border-gray-700 transition-all duration-300"
              >
                <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-3">
                  {stat.number}
                </div>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative py-20 lg:py-32 px-6 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center"
          >
            <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-bold mb-6">
              {dictionary.team.heading}
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-400 max-w-2xl mx-auto">
              {dictionary.team.subtitle}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 lg:py-32 px-6 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center space-y-8"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">{dictionary.cta.heading}</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                {dictionary.cta.subtitle}
              </p>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link
                href={`/${lang}/login`}
                className="inline-block px-8 sm:px-12 py-4 sm:py-5 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 text-lg"
              >
                {dictionary.cta.button}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
