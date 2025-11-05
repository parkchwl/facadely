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
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20 pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black z-0" />
        <motion.div
          className="relative z-10 max-w-5xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            {dictionary.title}
          </h1>
          <p className="text-xl sm:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            {dictionary.subtitle}
          </p>
        </motion.div>
      </section>

      {/* Brand Story Section */}
      <section className="relative py-20 lg:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="space-y-12"
          >
            <motion.div variants={itemVariants} className="text-center">
              <h2 className="text-4xl sm:text-5xl font-bold mb-8">
                {dictionary.brandStory.heading}
              </h2>
              <div className="space-y-6 text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
                <p className="inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent text-2xl font-bold mb-4">
                  {dictionary.brandStory.intro}
                </p>
                {dictionary.brandStory.description.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-base sm:text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative py-20 lg:py-32 px-6 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl font-bold mb-6">{dictionary.mission.heading}</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                {dictionary.mission.content}
              </p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="relative h-80 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl border border-purple-500/20 backdrop-blur-sm"
            />
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="relative py-20 lg:py-32 px-6 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <motion.div
              variants={itemVariants}
              className="relative h-80 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-2xl border border-blue-500/20 backdrop-blur-sm order-2 md:order-1"
            />
            <motion.div variants={itemVariants} className="order-1 md:order-2">
              <h2 className="text-4xl font-bold mb-6">{dictionary.vision.heading}</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                {dictionary.vision.content}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
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
              {dictionary.values.heading}
            </motion.h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {dictionary.values.items.map((value, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="group relative p-8 rounded-2xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:bg-gradient-to-br hover:from-purple-900/20 hover:to-blue-900/20"
              >
                <div className="text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {valueIcons[value.title] || <Zap className="w-8 h-8" />}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
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
