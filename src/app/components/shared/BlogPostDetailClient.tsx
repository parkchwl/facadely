'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User, Calendar, Share2, ChevronRight} from 'lucide-react';
import type { BlogPageDictionary } from '@/types/dictionary';

export default function BlogPostDetailClient({
  dictionary,
  postId
}: {
  dictionary: BlogPageDictionary;
  postId: number;
}) {
  const { lang: currentLang } = useParams() as { lang: string };

  // Find the current post
  const currentPost = useMemo(
    () => dictionary?.posts?.find((post) => post.id === postId),
    [dictionary?.posts, postId]
  );

  // Get related posts (same category, different from current)
  const relatedPosts = useMemo(() => {
    return (dictionary?.posts || [])
      .filter(
        (post) =>
          post.category === currentPost?.category && post.id !== postId
      )
      .slice(0, 3);
  }, [dictionary?.posts, currentPost?.category, postId]);

  if (!currentPost) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Article Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn&apos;t find the article you&apos;re looking for.
          </p>
          <Link href={`/${currentLang}/blog`}>
            <button className="inline-flex items-center px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Format date
  const formattedDate = new Date(currentPost.date).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  );

  // Parse content sections (split by ## for markdown-like formatting)
  const contentSections = currentPost.content
    .split('\n\n')
    .filter((section: string) => section.trim());

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-28 pb-4" style={{ marginTop: '-80px' }}>
        <div className="max-w-4xl mx-auto">
          <Link href={`/${currentLang}/blog`}>
            <button className="inline-flex items-center text-gray-600 hover:text-black transition-colors font-medium">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {dictionary.backToArticles}
            </button>
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      {currentPost.image && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16"
          style={{
            marginTop: '-80px',
            paddingTop: '80px'
          }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-2xl mb-8 h-96 sm:h-[500px]">
              <img
                src={currentPost.image}
                alt={currentPost.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      )}
      {!currentPost.image && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16"
          style={{
            marginTop: '-80px',
            paddingTop: '80px'
          }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-2xl mb-8 h-96 sm:h-[500px] bg-gray-200 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg">Image coming soon</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Article Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8"
      >
        <div className="max-w-4xl mx-auto">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-black text-white text-xs font-semibold rounded-full">
              {currentPost.category.charAt(0).toUpperCase() +
                currentPost.category.slice(1)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
            {currentPost.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-4 sm:gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
            {/* Author */}
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-sm sm:text-base">{currentPost.author}</span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm sm:text-base">{formattedDate}</span>
            </div>

            {/* Read Time */}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm sm:text-base">{currentPost.readTime}</span>
            </div>

            {/* Share Button */}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: currentPost.title,
                    text: currentPost.excerpt,
                    url: window.location.href
                  });
                } else {
                  // Fallback: copy to clipboard
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              }}
              className="flex items-center gap-2 hover:text-black transition-colors ml-auto"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm sm:text-base hidden sm:inline">
                {dictionary.shareArticle}
              </span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Article Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12"
      >
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            {contentSections.map((section: string, index: number) => {
              // Check if section is a heading (starts with ##)
              if (section.startsWith('##')) {
                const headingText = section.replace(/^##\s*/, '').trim();
                return (
                  <h2
                    key={index}
                    className="text-2xl sm:text-3xl font-bold text-black mt-12 mb-6 first:mt-0"
                  >
                    {headingText}
                  </h2>
                );
              }

              // Regular paragraph
              return (
                <p
                  key={index}
                  className="text-gray-700 text-lg leading-relaxed mb-6 last:mb-0"
                >
                  {section}
                </p>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Author Bio Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 bg-gray-50"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-black mb-2">
                {currentPost.author}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {currentPost.author === 'facadely Team'
                  ? 'The facadely team is dedicated to helping entrepreneurs and small businesses succeed online.'
                  : 'Expert contributor to the facadely blog, sharing insights and best practices.'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-16 sm:py-20 lg:py-24"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-black mb-12">
              {dictionary.relatedArticles}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((post, index) => (
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
                          {post.category.charAt(0).toUpperCase() +
                            post.category.slice(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {post.readTime}
                        </span>
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
          </div>
        </motion.div>
      )}

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-black via-gray-900 to-black text-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using facadely to build beautiful,
            professional websites that drive results.
          </p>
          <Link href={`/${currentLang}#signup`}>
            <button className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Start Building Free
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
