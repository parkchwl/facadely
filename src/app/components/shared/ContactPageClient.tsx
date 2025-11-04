'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle } from 'lucide-react';

interface ContactPageClientProps {
  dictionary: {
    title: string;
    subtitle: string;
    description: string;
    emailLabel: string;
    emailAddress: string;
    emailHint: string;
    inquiryLabel: string;
    inquiryOptions: {
      general: string;
      support: string;
      partnership: string;
      feedback: string;
      other: string;
    };
    messageLabel: string;
    messagePlaceholder: string;
    sendButton: string;
    successTitle: string;
    successMessage: string;
    sendAnother: string;
    faqTitle: string;
    faqItems: Array<{
      question: string;
      answer: string;
    }>;
  };
}

export default function ContactPageClient({ dictionary }: ContactPageClientProps) {
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
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden pt-20">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center py-24">
          <motion.div {...fadeInUp}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Touch</span>
            </h1>
          </motion.div>

          <motion.p
            {...fadeInUp}
            className="text-xl sm:text-2xl text-gray-300 mb-4 leading-relaxed"
          >
            {dictionary.subtitle}
          </motion.p>
          <motion.p
            {...fadeInUp}
            className="text-lg text-gray-400"
          >
            {dictionary.description}
          </motion.p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
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
                    {dictionary.emailAddress}
                  </a>
                </p>
                <p className="text-gray-500 text-sm mt-2">{dictionary.emailHint}</p>
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
                      {dictionary.emailLabel}
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
                      {dictionary.inquiryLabel}
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors bg-white text-black"
                    >
                      <option value="general">{dictionary.inquiryOptions.general}</option>
                      <option value="support">{dictionary.inquiryOptions.support}</option>
                      <option value="partnership">{dictionary.inquiryOptions.partnership}</option>
                      <option value="feedback">{dictionary.inquiryOptions.feedback}</option>
                      <option value="other">{dictionary.inquiryOptions.other}</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-black mb-2">
                      {dictionary.messageLabel}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder={dictionary.messagePlaceholder}
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
                        {dictionary.sendButton}
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
                  <h3 className="text-3xl font-bold text-black mb-2">{dictionary.successTitle}</h3>
                  <p className="text-gray-600 mb-6">
                    {dictionary.successMessage}
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-3 border-2 border-black text-black font-bold rounded-lg hover:bg-black hover:text-white transition-all duration-300"
                  >
                    {dictionary.sendAnother}
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Preview Section */}
      <section className="py-24 px-6 sm:px-8 lg:px-12 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            {...fadeInUp}
            className="text-5xl font-bold text-black text-center mb-16"
          >
            {dictionary.faqTitle}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dictionary.faqItems.map((item, index) => (
              <motion.div
                key={index}
                {...fadeInUp}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 bg-white rounded-lg border-2 border-gray-200"
              >
                <h3 className="font-bold text-black text-lg mb-3">{item.question}</h3>
                <p className="text-gray-600 leading-relaxed">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
