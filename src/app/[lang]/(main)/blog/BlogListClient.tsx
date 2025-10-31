'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  featured: boolean;
  image: string;
}

interface BlogDictionary {
  hero: {
    title: string;
    subtitle: string;
  };
  categories: Record<string, string>;
  posts: BlogPost[];
  filters: {
    searchPlaceholder: string;
    noResults: string;
  };
  readMore: string;
}

export default function BlogListClient({ dictionary }: { dictionary: BlogDictionary }) {
  const { lang: currentLang } = useParams() as { lang: string };
  const [selectedCategory, setSelectedCategory] = useState(dictionary?.categories?.all || 'All Articles');
  const [searchQuery, setSearchQuery] = useState('');

  const posts = dictionary?.posts || [];
  const categories = dictionary?.categories ? Object.entries(dictionary.categories).map(([, value]) => value) : [];

  // Filter posts based on category and search
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = selectedCategory === dictionary.categories.all ||
        (dictionary.categories[post.category] === selectedCategory);
      const matchesSearch = searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, posts, dictionary.categories]);

  // Featured posts (for hero section)
  const featuredPosts = posts.filter((post) => post.featured).slice(0, 2);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="w-full text-white relative overflow-hidden"
        style={{
          backgroundImage: 'url(/image/Blog.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          height: '500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '-80px',
          paddingTop: '80px'
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight"
            dangerouslySetInnerHTML={{
              __html: dictionary.hero.title.replace('<br />', '<br />')
            }}
          />
          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
            {dictionary.hero.subtitle}
          </p>
        </motion.div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-16 sm:py-20 lg:py-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-black mb-12">Featured Articles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group cursor-pointer"
                >
                  <Link href={`/${currentLang}/blog/${post.id}`}>
                    {post.image && (
                      <div className="overflow-hidden rounded-xl mb-4 h-64 sm:h-72 lg:h-80">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    {!post.image && (
                      <div className="overflow-hidden rounded-xl mb-4 h-64 sm:h-72 lg:h-80 bg-gray-200 flex items-center justify-center">
                        <div className="text-gray-400 text-center">
                          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm">Image coming soon</p>
                        </div>
                      </div>
                    )}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-block px-3 py-1 bg-black text-white text-xs font-semibold rounded-full">
                          {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500">{post.readTime}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-black group-hover:text-gray-700 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center text-black font-semibold group-hover:translate-x-2 transition-transform">
                        {dictionary.readMore}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search and Filter Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 sm:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={dictionary.filters.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-black text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-black'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-16 sm:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
                  viewport={{ once: true }}
                  className="group cursor-pointer"
                >
                  <Link href={`/${currentLang}/blog/${post.id}`}>
                    {post.image && (
                      <div className="overflow-hidden rounded-lg mb-4 h-48 sm:h-56">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    {!post.image && (
                      <div className="overflow-hidden rounded-lg mb-4 h-48 sm:h-56 bg-gray-200 flex items-center justify-center">
                        <div className="text-gray-400 text-center">
                          <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-xs">Coming soon</p>
                        </div>
                      </div>
                    )}
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-block px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                          {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                        </span>
                        <span className="text-xs text-gray-500">{post.readTime}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-black group-hover:text-gray-700 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center text-black text-sm font-semibold group-hover:translate-x-1 transition-transform pt-2">
                        {dictionary.readMore}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">
                {dictionary.filters.noResults}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
