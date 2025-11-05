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
      {/* Hero Section with Contact Form */}
      <section
        className="relative min-h-screen flex items-center justify-center text-white overflow-hidden bg-cover bg-center bg-no-repeat pt-20 sm:pt-24"
        style={{
          backgroundImage: 'url(/image/Contact.avif)'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
          {/* Contact Info & Form - White Card */}
          <motion.div
            {...fadeInUp}
            className="bg-white rounded-xl p-12 shadow-lg"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {/* Contact Info */}
              <div className="lg:col-span-1 space-y-8">
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
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
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
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
