'use client';

import { motion } from 'framer-motion';
import { DM_Serif_Display } from 'next/font/google';
import type { CustomerServicePageDictionary } from '@/types/dictionary';

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

interface CustomerServicePageClientProps {
  dictionary: CustomerServicePageDictionary;
}

export default function CustomerServicePageClient({
  dictionary
}: CustomerServicePageClientProps) {
  return (
    <div className="w-full bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 sm:px-8 lg:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto relative z-10"
        >
          <h1 className={`text-6xl sm:text-7xl md:text-8xl font-bold text-white mb-6 ${dmSerif.className}`}>
            {dictionary.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            {dictionary.subtitle}
          </p>
        </motion.div>
      </section>

      {/* Content Coming Soon */}
      <section className="px-6 sm:px-8 lg:px-12 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg text-gray-400">Coming soon...</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
