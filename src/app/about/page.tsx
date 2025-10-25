'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { DM_Serif_Display } from 'next/font/google';
import { ArrowRight, Target, Lightbulb, Heart } from 'lucide-react';

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

export default function AboutPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
    viewport: { once: true }
  };

  const values = [
    {
      icon: Target,
      title: 'Simplicity',
      description: 'We believe great design is invisible. Our tools should feel intuitive, not complicated.'
    },
    {
      icon: Lightbulb,
      title: 'Empowerment',
      description: 'Everyone deserves the tools to bring their ideas to life, regardless of technical skills.'
    },
    {
      icon: Heart,
      title: 'Excellence',
      description: 'We obsess over details because small things matter. Quality is non-negotiable.'
    }
  ];

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
        {/* Background Image */}
        <Image
          src="/image/About.webp"
          alt="About us background"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmQAAA//9k="
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          {/* About Label */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center justify-center gap-3"
          >
            <div className="h-px w-8 bg-white/60"></div>
            <span className="text-sm sm:text-base font-semibold text-white/80 tracking-widest uppercase">About facadely</span>
            <div className="h-px w-8 bg-white/60"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className={`${dmSerif.className} text-6xl sm:text-7xl lg:text-8xl font-bold leading-tight mb-8`}>
              We focus on essence
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-200 mb-12 leading-relaxed max-w-3xl mx-auto"
          >
            At facadely, we believe that everyone should have the power to create <span className="text-white font-semibold">beautiful, professional websites</span> without needing to code.
          </motion.p>

          {/* Button Decorative Line */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8 flex justify-center"
          >
            <div className="h-px w-12 bg-white/40"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-10 py-4 bg-white text-black font-bold text-lg rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105"
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-4 border-2 border-white text-white font-bold text-lg rounded-lg hover:bg-white hover:text-black transition-all duration-300"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Mission */}
            <motion.div {...fadeInUp}>
              <h2 className="text-4xl font-bold text-black mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                To democratize web design and development by providing intuitive, powerful tools that empower individuals and businesses to create stunning digital experiences without barriers to entry.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-4xl font-bold text-black mb-4">Our Vision</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                A world where ideas transform into reality instantly. Where the only limit is imagination, not technical knowledge. Where everyone can build, create, and share their unique voice online.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Story Section */}
      <section className="py-24 px-6 sm:px-8 lg:px-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="mb-12">
            <h2 className="text-5xl font-bold text-black mb-8">The Story</h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                Facadely was born from a simple frustration. Our founder noticed something obvious yet overlooked: talented individuals with incredible ideas were being held back by the complexity of web development.
              </p>
              <p>
                Whether you&apos;re an artist, entrepreneur, freelancer, or business owner, you shouldn&apos;t need to spend months learning to code just to get your vision online. That gap between imagination and execution was too wide.
              </p>
              <p>
                So we asked ourselves: What if building a website was as easy as telling a story? What if design and functionality could be intuitive, beautiful, and powerful all at once?
              </p>
              <p>
                That question led us here. We&apos;re building the tools we wished existed. Tools that respect your time, honor your creativity, and turn ideas into reality—faster than ever before.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            {...fadeInUp}
            className="text-5xl font-bold text-black text-center mb-16"
          >
            Our Values
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  {...fadeInUp}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="p-8 rounded-2xl border-2 border-gray-200 hover:border-black hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="mb-4">
                    <Icon className="h-12 w-12 text-black group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-black to-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-5xl font-bold mb-6">Ready to bloom your dream?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of creators, entrepreneurs, and business owners building beautiful websites with Facadely.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-10 py-5 bg-white text-black font-bold text-lg rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105"
            >
              Get Started Free <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
