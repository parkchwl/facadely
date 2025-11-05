'use client';
import { useParams } from 'next/navigation';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DM_Serif_Display } from 'next/font/google';
import Link from 'next/link';
import { Search, ChevronDown, Tag } from 'lucide-react';

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

// Accordion Item Component
const AccordionItem = ({
  item,
  isOpen,
  onToggle,
}: {
  item: {
    id: number;
    category: string;
    question: string;
    answer: string;
  };
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <motion.div
      layout
      className="border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors duration-300"
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-start justify-between gap-4 hover:bg-white/5 transition-colors duration-200"
      >
        <div className="flex-1 text-left">
          <p className="text-lg font-semibold text-white">{item.question}</p>
          <div className="flex items-center gap-2 mt-2">
            <Tag className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-500">{item.category}</span>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 mt-1"
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden border-t border-white/10 bg-white/5"
      >
        <p className="px-6 py-5 text-gray-300 leading-relaxed">{item.answer}</p>
      </motion.div>
    </motion.div>
  );
};

interface QAPageClientProps {
  dictionary: {
    hero: {
      title: string;
      subtitle: string;
      searchPlaceholder: string;
    };
    filterLabel: string;
    allCategories: string;
    results: string;
    noResults: string;
    clearFilters: string;
    categories: Record<string, string>;
    questions: Array<{
      id: number;
      category: string;
      question: string;
      answer: string;
    }>;
    stillHaveQuestions: {
      title: string;
      subtitle: string;
      emailSupport: string;
      contactUs: string;
    };
  };
}

export default function QAPageClient({ dictionary }: QAPageClientProps) {
  const { lang } = useParams() as { lang: string };
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);

  // Get unique categories from questions
  const categories = useMemo(() => {
    const categorySet = new Set(dictionary.questions.map((q) => q.category));
    return Array.from(categorySet).sort();
  }, [dictionary.questions]);

  // Filter Q&A based on search and category
  const filteredQA = useMemo(() => {
    return dictionary.questions.filter((item) => {
      const matchesSearch =
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !selectedCategory || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, dictionary.questions]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 pb-20 px-6 sm:px-8 lg:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto relative z-10"
        >
          <h1 className={`text-6xl sm:text-7xl md:text-8xl font-bold text-white mb-6 ${dmSerif.className}`}>
            {dictionary.hero.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mb-12">
            {dictionary.hero.subtitle}
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder={dictionary.hero.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/40 transition-colors duration-300"
            />
          </div>
        </motion.div>
      </section>

      {/* Category Filter and Q&A Section */}
      <section className="px-6 sm:px-8 lg:px-12 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Category Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-sm font-semibold text-gray-400 mb-4">{dictionary.filterLabel}</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-2 rounded-full transition-all duration-300 font-medium ${
                  selectedCategory === null
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                {dictionary.allCategories}
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full transition-all duration-300 font-medium ${
                    selectedCategory === category
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  {dictionary.categories[category] || category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results Counter */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <p className="text-gray-400 text-sm">
              {dictionary.results
                .replace('{count}', filteredQA.length.toString())
                .replace('{total}', dictionary.questions.length.toString())}
            </p>
          </motion.div>

          {/* Q&A Accordion */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-3"
          >
            {filteredQA.length > 0 ? (
              filteredQA.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <AccordionItem
                    item={item}
                    isOpen={openId === item.id}
                    onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div variants={itemVariants} className="text-center py-12">
                <p className="text-gray-400 text-lg">{dictionary.noResults}</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                  }}
                  className="mt-4 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  {dictionary.clearFilters}
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 sm:px-8 lg:px-12 py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-4xl sm:text-5xl font-bold text-white mb-6 ${dmSerif.className}`}>
              {dictionary.stillHaveQuestions.title}
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
              {dictionary.stillHaveQuestions.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@facadely.com"
                className="px-8 py-4 bg-white text-black rounded-lg font-bold hover:bg-gray-100 transition-all duration-200 hover:scale-105"
              >
                {dictionary.stillHaveQuestions.emailSupport}
              </a>
              <Link
                href={`/${lang}/contact`}
                className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-black transition-all duration-200"
              >
                {dictionary.stillHaveQuestions.contactUs}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
