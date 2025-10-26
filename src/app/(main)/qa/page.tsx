'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DM_Serif_Display } from 'next/font/google';
import { Search, ChevronDown, Tag } from 'lucide-react';

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

// Q&A Data
const QA_DATA = [
  {
    id: 1,
    category: 'Getting Started',
    question: 'How do I sign up for facadely?',
    answer: 'Signing up is simple! Click the "Sign up" button on our homepage, enter your email address, create a password, and verify your email. You\'ll have instant access to all our templates and the builder.'
  },
  {
    id: 2,
    category: 'Getting Started',
    question: 'Do I need a credit card to start?',
    answer: 'No! You can create an account and start building for free without providing any credit card information. You only need to add payment details if you want to upgrade to a paid plan or publish your site.'
  },
  {
    id: 3,
    category: 'Getting Started',
    question: 'How long does it take to build a website?',
    answer: 'You can have a professional website live in as little as 5 minutes! Our pre-designed templates are ready to customize, and you can publish immediately. The time depends on how much customization you want to do.'
  },
  {
    id: 4,
    category: 'Features',
    question: 'Can I use my own domain name?',
    answer: 'Yes! You can connect your existing domain or purchase a new one directly through facadely. We handle all the technical setup including DNS configuration and SSL certificates automatically.'
  },
  {
    id: 5,
    category: 'Features',
    question: 'Are the templates mobile-responsive?',
    answer: 'Absolutely! All our templates are fully responsive and optimized for mobile, tablet, and desktop. Your website will look perfect on any device, and we automatically handle responsive design for you.'
  },
  {
    id: 6,
    category: 'Features',
    question: 'Can I add e-commerce functionality?',
    answer: 'Yes! Our Pro and Business plans include full e-commerce capabilities with payment processing, inventory management, order tracking, and customer management tools built-in.'
  },
  {
    id: 7,
    category: 'Customization',
    question: 'Do I need coding skills to customize my site?',
    answer: 'No! Our visual editor is designed for everyone. You can customize colors, fonts, layouts, and content by simply dragging and dropping elements. No coding knowledge required.'
  },
  {
    id: 8,
    category: 'Customization',
    question: 'Can I change templates after launching?',
    answer: 'Yes! You can switch templates anytime without losing your content. Your text, images, and settings will transfer seamlessly to the new template.'
  },
  {
    id: 9,
    category: 'Customization',
    question: 'How can I add custom CSS or HTML?',
    answer: 'Our Pro and Business plans include custom code functionality. You can add custom CSS, JavaScript, or HTML to specific sections of your website for advanced customization.'
  },
  {
    id: 10,
    category: 'Support',
    question: 'What kind of support do you offer?',
    answer: 'We provide 24/7 customer support via chat and email. Our extensive help center includes video tutorials, guides, and FAQs. Pro and Business plans get priority support.'
  },
  {
    id: 11,
    category: 'Support',
    question: 'How long does it take to get a response from support?',
    answer: 'Standard support typically responds within 24 hours. Priority support (available on Pro and Business plans) responds within 2 hours during business hours.'
  },
  {
    id: 12,
    category: 'Billing',
    question: 'How do I upgrade to a paid plan?',
    answer: 'You can upgrade anytime from your account settings. Go to Billing > Plans, choose your desired plan, and complete the payment. Your upgrade takes effect immediately.'
  },
  {
    id: 13,
    category: 'Billing',
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes! You can cancel your subscription anytime from your account settings. If you cancel mid-cycle, you won\'t be charged again, but you can use the service until your current period ends.'
  },
  {
    id: 14,
    category: 'Security',
    question: 'Is my website secure?',
    answer: 'Yes! All facadely websites include SSL certificates, automatic backups, and 99.9% uptime SLA. We also provide DDoS protection and regular security audits.'
  },
  {
    id: 15,
    category: 'Security',
    question: 'Where is my data stored?',
    answer: 'Your data is stored on secure, redundant servers in multiple geographic locations. We use enterprise-grade encryption and comply with GDPR and other data protection regulations.'
  }
];

// Get unique categories
const CATEGORIES = Array.from(new Set(QA_DATA.map(item => item.category))).sort();

// Accordion Item Component
const AccordionItem = ({ item, isOpen, onToggle }: { item: typeof QA_DATA[0], isOpen: boolean, onToggle: () => void }) => {
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

export default function QAPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);

  // Filter Q&A based on search and category
  const filteredQA = useMemo(() => {
    return QA_DATA.filter(item => {
      const matchesSearch =
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !selectedCategory || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 sm:px-8 lg:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto relative z-10"
        >
          <h1 className={`text-6xl sm:text-7xl md:text-8xl font-bold text-white mb-6 ${dmSerif.className}`}>
            Questions & Answers
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mb-12">
            Find answers to common questions about facadely, our features, pricing, and support. Can&apos;t find what you&apos;re looking for? Contact our support team.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search questions..."
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
            <p className="text-sm font-semibold text-gray-400 mb-4">Filter by Category</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-2 rounded-full transition-all duration-300 font-medium ${
                  selectedCategory === null
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                All
              </button>
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full transition-all duration-300 font-medium ${
                    selectedCategory === category
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  {category}
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
              Showing <span className="font-semibold text-white">{filteredQA.length}</span> of <span className="font-semibold text-white">{QA_DATA.length}</span> questions
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
              <motion.div
                variants={itemVariants}
                className="text-center py-12"
              >
                <p className="text-gray-400 text-lg">No questions found matching your search.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                  }}
                  className="mt-4 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  Clear filters
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
              Still Have Questions?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
              Our support team is here to help. Get in touch and we&apos;ll respond as quickly as we can.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:support@facadely.com" className="px-8 py-4 bg-white text-black rounded-lg font-bold hover:bg-gray-100 transition-all duration-200 hover:scale-105">
                Email Support
              </a>
              <a href="/contact" className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-black transition-all duration-200">
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
