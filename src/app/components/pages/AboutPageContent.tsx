'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Zap, Award, Users, Lightbulb, Heart, Shield, Target, Eye } from 'lucide-react';
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

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function AboutPageContent({ dictionary }: AboutPageContentProps) {
  const params = useParams() as { lang: string };
  const { lang } = params;

  return (
    <main className="relative bg-black text-white overflow-hidden">
      {/* Hero Section - Brand Story + Mission + Vision + Values */}
      <section className="relative px-6 pt-24 sm:pt-32 pb-20 lg:pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black z-0" />
        <motion.div
          className="relative z-10 max-w-5xl mx-auto space-y-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Brand Story */}
          <div className="space-y-6">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-7xl sm:text-8xl lg:text-9xl font-bold text-white"
              >
                ✦
              </motion.div>
            </div>
            <div className="text-center">
              <p className="text-white text-2xl sm:text-3xl font-bold">
                {dictionary.brandStory.intro}
              </p>
            </div>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="relative p-8 sm:p-10 rounded-2xl border border-gray-700 bg-gradient-to-br from-indigo-900/10 via-black to-black hover:border-white/50 transition-all duration-300 hover:shadow-lg hover:shadow-white/20"
            >
              <div className="space-y-4 text-gray-300 leading-relaxed">
                {dictionary.brandStory.description.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-sm sm:text-base leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </div>

          {/* Mission & Vision Cards Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-6 mt-8"
          >
            {/* Mission Card */}
            <motion.div
              variants={cardVariants}
              className="relative p-8 rounded-2xl border border-gray-700 bg-gradient-to-br from-blue-900/10 via-black to-black hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Target className="w-8 h-8 text-blue-400 mt-1" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4">{dictionary.mission.heading}</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {dictionary.mission.content}
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 via-transparent to-transparent pointer-events-none" />
            </motion.div>

            {/* Vision Card */}
            <motion.div
              variants={cardVariants}
              className="relative p-8 rounded-2xl border border-gray-700 bg-gradient-to-br from-purple-900/10 via-black to-black hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Eye className="w-8 h-8 text-purple-400 mt-1" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4">{dictionary.vision.heading}</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {dictionary.vision.content}
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </motion.div>

          {/* Values Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-12 pt-12 border-t border-gray-700 space-y-8"
          >
            <motion.div variants={itemVariants} className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">{dictionary.values.heading}</h2>
              <p className="text-gray-400 text-lg">Our core principles that guide everything we do</p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {dictionary.values.items.map((value, idx) => (
                <motion.div
                  key={idx}
                  variants={cardVariants}
                  className="group relative p-6 rounded-xl border border-gray-800 hover:border-emerald-500/50 transition-all duration-300 hover:bg-gradient-to-br hover:from-emerald-900/15 hover:to-teal-900/10 hover:shadow-lg hover:shadow-emerald-500/10"
                >
                  <div className="text-emerald-400 mb-3">
                    {valueIcons[value.title] || <Zap className="w-6 h-6" />}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-400">{value.description}</p>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/3 via-transparent to-transparent pointer-events-none" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
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
