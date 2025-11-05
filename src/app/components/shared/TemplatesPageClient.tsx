'use client';
import { useParams } from 'next/navigation';
import type { TemplatesPageDictionary } from '@/types/dictionary';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, Grid3x3, Grid2x2 } from 'lucide-react';

// This is mock data. In a real app, this would be fetched from the server.
const templates = [
  { id: 1, name: 'Modern Business', category: 'Business' },
  { id: 2, name: 'Creative Portfolio', category: 'Portfolio' },
  { id: 3, name: 'Shop Template', category: 'E-commerce' },
  { id: 4, name: 'Minimal Blog', category: 'Blog' },
  { id: 5, name: 'Product Launch', category: 'Landing Page' },
  { id: 6, name: 'Corporate', category: 'Business' },
  { id: 7, name: 'Designer Showcase', category: 'Portfolio' },
  { id: 8, name: 'Online Store', category: 'E-commerce' },
  { id: 9, name: 'Tech Blog', category: 'Blog' },
  { id: 10, name: 'App Landing', category: 'Landing Page' },
  { id: 11, name: 'Startup', category: 'Business' },
  { id: 12, name: 'Photography', category: 'Portfolio' },
];

export default function TemplatesPageClient({ dictionary }: { dictionary: TemplatesPageDictionary }) {
  useParams() as { lang: string };
  const [selectedCategory, setSelectedCategory] = useState(dictionary.categories.all);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState(dictionary.sortOptions.latest);
  const [gridCols, setGridCols] = useState(3);

  const categories = useMemo(() => Object.values(dictionary.categories), [dictionary]);
  const sortOptions = useMemo(() => Object.values(dictionary.sortOptions), [dictionary]);

  const filteredTemplates = useMemo(() => templates.filter((template) => {
    const matchesCategory = selectedCategory === dictionary.categories.all || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }), [selectedCategory, searchQuery, dictionary.categories.all]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen relative">
      <div className="max-w-7xl mx-auto bg-white min-h-screen px-4 sm:px-6 lg:px-12 xl:px-16 pt-20 sm:pt-24 pb-12 sm:pb-16 lg:pb-20 shadow-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-14 lg:mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6">
            {dictionary.title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl leading-relaxed"
             dangerouslySetInnerHTML={{ __html: dictionary.subtitle }}
          />
        </motion.div>

        <div className="mb-8 sm:mb-10 lg:mb-12 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
            <div className="relative flex-1 w-full sm:max-w-md">
              <label htmlFor="template-search" className="sr-only">
                {dictionary.searchPlaceholder}
              </label>
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              <input
                id="template-search"
                type="search"
                placeholder={dictionary.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                aria-label={dictionary.searchPlaceholder}
              />
            </div>

            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <label htmlFor="sort-templates" className="sr-only">
                  {dictionary.searchPlaceholder}
                </label>
                <select
                  id="sort-templates"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none px-3 sm:px-4 py-2.5 sm:py-3 pr-8 sm:pr-10 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors cursor-pointer bg-white"
                  aria-label="Sort templates by"
                >
                  {sortOptions.map((option, idx) => (
                    <option key={idx} value={String(option)}>
                      {String(option)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" aria-hidden="true" />
              </div>

              <div className="flex gap-1 sm:gap-2 border-2 border-gray-200 rounded-lg p-0.5 sm:p-1" role="group" aria-label="Grid view options">
                <button
                  onClick={() => setGridCols(2)}
                  className={`p-1.5 sm:p-2 rounded transition-colors ${
                    gridCols === 2 ? 'bg-black text-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  aria-label="2 column grid view"
                  aria-pressed={gridCols === 2}
                >
                  <Grid2x2 className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                </button>
                <button
                  onClick={() => setGridCols(3)}
                  className={`p-1.5 sm:p-2 rounded transition-colors ${
                    gridCols === 3 ? 'bg-black text-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  aria-label="3 column grid view"
                  aria-pressed={gridCols === 3}
                >
                  <Grid3x3 className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-wrap gap-2 sm:gap-3 flex-1">
              {categories.map((category, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-black text-white shadow-lg shadow-black/20'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {String(category)}
                  {category !== dictionary.categories.all && (
                    <span className="ml-1 sm:ml-2 text-xs opacity-70">
                      ({templates.filter((t) => t.category === String(category)).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="text-sm sm:text-base text-gray-600 font-medium">
            {dictionary.results.replace('{count}', filteredTemplates.length.toString())}
          </div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className={`grid grid-cols-1 ${gridCols === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-4 sm:gap-6 lg:gap-8`}
        >
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              variants={item}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-lg sm:rounded-xl overflow-hidden border-2 border-gray-100 hover:border-gray-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                  <div className="text-gray-300 text-center group-hover:scale-110 transition-transform duration-300">
                    <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">✦</div>
                    <p className="text-xs sm:text-sm font-medium">{dictionary.preview}</p>
                  </div>

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white text-black px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-100 transition-colors transform scale-90 group-hover:scale-100 duration-300">
                      {dictionary.useTemplate}
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-5 lg:p-6">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                    {template.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">{template.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">🔍</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{dictionary.emptyState.title}</h3>
            <p className="text-sm sm:text-base text-gray-600">{dictionary.emptyState.subtitle}</p>
          </div>
        )}
      </div>
    </div>
  );
}
