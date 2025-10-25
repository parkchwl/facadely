'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'general',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        type: 'general',
        message: ''
      });

      // Reset after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="w-full bg-white">
      {/* Hero + Contact Combined Section */}
      <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden pt-20 pb-24">
        {/* Background Image */}
        <Image
          src="/image/Contact.webp"
          alt="Contact us background"
          fill
          quality={100}
          priority
          sizes="100vw"
          className="object-cover"
          placeholder="empty"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Accent Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          {/* Contact Form in White Rounded Box */}
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 lg:p-16"
          >
            <div className="max-w-5xl mx-auto">
              {/* Home Button - Top Left */}
              <div className="flex justify-start mb-2">
                <Link
                  href="/"
                  className="text-black font-bold text-4xl transition-all duration-300 hover:opacity-70"
                >
                  ✦ facadely
                </Link>
              </div>

              {/* Hero Heading - Inside White Box */}
              <div className="mb-12 pb-8 border-b border-gray-200">
                {/* Left: Hero Heading */}
                <div>
                  <div>
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-black">
                      Get in Touch
                    </h1>
                  </div>

                  <p
                    className="text-xl sm:text-2xl lg:text-2xl text-gray-700 mb-3 leading-relaxed"
                  >
                    We&apos;d love to hear from you. Have a question? Need support? Want to partner with us?
                  </p>
                  <p
                    className="text-lg text-gray-600"
                  >
                    Reach out and let&apos;s chat. We typically respond within 24 hours.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Contact Info */}
            <div
              className="lg:col-span-1 space-y-8"
            >
              {/* Email */}
              <div>
                <div className="flex items-center mb-3">
                  <Mail className="h-7 w-7 text-black mr-3" />
                  <h3 className="text-2xl lg:text-2xl font-bold text-black">Email</h3>
                </div>
                <p className="text-gray-600 text-lg lg:text-xl">
                  <a href="mailto:hello@facadely.com" className="hover:text-black transition-colors">
                    hello@facadely.com
                  </a>
                </p>
                <p className="text-gray-500 text-base lg:text-base mt-2">We usually respond within 24 hours</p>
              </div>

              {/* Quick Response */}
              <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                <h4 className="font-bold text-black mb-3 text-lg">Quick Responses</h4>
                <ul className="space-y-2 text-base lg:text-base text-gray-600">
                  <li>✓ Support issues: 2-4 hours</li>
                  <li>✓ General inquiries: 24 hours</li>
                  <li>✓ Partnership proposals: 48 hours</li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div
              className="lg:col-span-2"
            >
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-base lg:text-lg font-semibold text-black mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-base text-black placeholder-gray-400"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-base lg:text-lg font-semibold text-black mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-base text-black placeholder-gray-400"
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label htmlFor="type" className="block text-base lg:text-lg font-semibold text-black mb-2">
                      Inquiry Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-base text-black"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="support">Customer Support</option>
                      <option value="partnership">Partnership Proposal</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-base lg:text-lg font-semibold text-black mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Tell us how we can help..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-base text-black placeholder-gray-400 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex items-center justify-center px-6 py-4 bg-black text-white font-bold text-lg rounded-lg hover:bg-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  <h3 className="text-3xl font-bold text-black mb-2">Message Sent!</h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for reaching out. We&apos;ll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-3 border-2 border-black text-black font-bold rounded-lg hover:bg-black hover:text-white transition-all duration-300"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              )}
            </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
