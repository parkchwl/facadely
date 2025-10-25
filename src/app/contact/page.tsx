'use client';

import { useState } from 'react';
import Image from 'next/image';
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

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
    viewport: { once: true }
  };

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
          src="/image/Contact.jpg"
          alt="Contact us background"
          fill
          quality={85}
          priority
          className="object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Accent Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          {/* Contact Form in White Rounded Box */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 lg:p-16"
          >
            <div className="max-w-5xl mx-auto">
              {/* Hero Heading - Inside White Box */}
              <div className="text-center mb-12 pb-8 border-b border-gray-200">
                <motion.div {...fadeInUp}>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-black">
                    Get in Touch
                  </h1>
                </motion.div>

                <motion.p
                  {...fadeInUp}
                  className="text-lg sm:text-xl text-gray-700 mb-3 leading-relaxed"
                >
                  We'd love to hear from you. Have a question? Need support? Want to partner with us?
                </motion.p>
                <motion.p
                  {...fadeInUp}
                  className="text-gray-600"
                >
                  Reach out and let's chat. We typically respond within 24 hours.
                </motion.p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Contact Info */}
            <motion.div
              {...fadeInUp}
              className="lg:col-span-1 space-y-8"
            >
              {/* Email */}
              <div>
                <div className="flex items-center mb-3">
                  <Mail className="h-6 w-6 text-black mr-3" />
                  <h3 className="text-xl font-bold text-black">Email</h3>
                </div>
                <p className="text-gray-600 text-lg">
                  <a href="mailto:hello@facadely.com" className="hover:text-black transition-colors">
                    hello@facadely.com
                  </a>
                </p>
                <p className="text-gray-500 text-sm mt-2">We usually respond within 24 hours</p>
              </div>

              {/* Quick Response */}
              <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                <h4 className="font-bold text-black mb-2">Quick Responses</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Support issues: 2-4 hours</li>
                  <li>✓ General inquiries: 24 hours</li>
                  <li>✓ Partnership proposals: 48 hours</li>
                </ul>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2"
            >
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-black mb-2">
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
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-black placeholder-gray-400"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-black mb-2">
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
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-black placeholder-gray-400"
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label htmlFor="type" className="block text-sm font-semibold text-black mb-2">
                      Inquiry Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-black"
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
                    <label htmlFor="message" className="block text-sm font-semibold text-black mb-2">
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
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-black placeholder-gray-400 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex items-center justify-center px-6 py-4 bg-black text-white font-bold rounded-lg hover:bg-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    Thank you for reaching out. We'll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-3 border-2 border-black text-black font-bold rounded-lg hover:bg-black hover:text-white transition-all duration-300"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              )}
            </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Preview Section */}
      <section className="py-24 px-6 sm:px-8 lg:px-12 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            {...fadeInUp}
            className="text-5xl font-bold text-black text-center mb-16"
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                q: 'How long does it take to build a website on facadely?',
                a: 'Most users create their first website in under 30 minutes. Our intuitive interface gets you up and running fast.'
              },
              {
                q: 'Do I need coding skills?',
                a: 'Not at all! facadely is designed for everyone. No coding knowledge required.'
              },
              {
                q: 'Can I use my own domain?',
                a: 'Yes! You can connect your custom domain or purchase a new one directly through facadely.'
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes, we offer a 14-day free trial. No credit card required to get started.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                {...fadeInUp}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 bg-white rounded-lg border-2 border-gray-200"
              >
                <h3 className="font-bold text-black text-lg mb-3">{item.q}</h3>
                <p className="text-gray-600 leading-relaxed">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
