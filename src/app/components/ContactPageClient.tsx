'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import OptimizedImage, { ImageType } from '@/app/components/OptimizedImage';

const dmSerif = { className: 'font-serif' } as const;

interface ContactPageClientProps {
  dictionary: {
    title: string;
    subtitle: string;
    form: {
      name: string;
      email: string;
      subject: string;
      message: string;
      send?: string;
      submit?: string;
    };
    info?: {
      email: string;
      phone: string;
      address: string;
    };
  };
}

export default function ContactPageClient({
  dictionary
}: ContactPageClientProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('Failed to submit form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-gray-800 py-12 sm:py-16 lg:py-20">
        <div className="absolute inset-0">
          <OptimizedImage
            src="/image/Service.avif"
            alt="Contact hero background"
            type={ImageType.STATIC_BACKGROUND}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left Side - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-left text-white"
            >
              <h1
                className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight leading-[0.9] mb-8 ${dmSerif.className}`}
                style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)' }}
              >
                {dictionary.title}
              </h1>
              <p className="text-xl lg:text-2xl text-gray-200 leading-relaxed max-w-xl mb-10">
                {dictionary.subtitle}
              </p>

              {/* Contact Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  <span className="text-lg text-gray-300">contact@facadely.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  <span className="text-lg text-gray-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-lg text-gray-300">123 Innovation Street</p>
                    <p className="text-lg text-gray-300">San Francisco, CA 94105</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 w-full"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-black font-bold mb-2 text-lg">
                      {dictionary.form.name}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                      placeholder={dictionary.form.name}
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-black font-bold mb-2 text-lg">
                      {dictionary.form.email}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                      placeholder={dictionary.form.email}
                    />
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label className="block text-black font-bold mb-2 text-lg">
                      {dictionary.form.subject}
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                      placeholder={dictionary.form.subject}
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-black font-bold mb-2 text-lg">
                      {dictionary.form.message}
                    </label>
                    <textarea
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors resize-none"
                      placeholder={dictionary.form.message}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black text-white font-bold py-4 px-6 rounded-lg hover:bg-gray-800 transition-all duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    {isLoading ? '전송 중...' : (dictionary.form.send || dictionary.form.submit || 'Send Message')}
                  </button>

                  {/* Success Message */}
                  {isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center font-semibold"
                    >
                      ✓ 메시지가 성공적으로 전송되었습니다!
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-20 sm:py-24 lg:py-32 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className={`text-4xl sm:text-5xl font-bold text-black mb-6 ${dmSerif.className}`}>
              We&apos;re Here to Help
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-12">
              Have a question about Facadely? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Mail,
                  title: 'Email Support',
                  description: 'Get help via email. We respond within 24 hours.'
                },
                {
                  icon: Phone,
                  title: 'Phone Support',
                  description: 'Call us during business hours for immediate assistance.'
                },
                {
                  icon: MapPin,
                  title: 'Visit Us',
                  description: 'Stop by our office in San Francisco to meet the team.'
                }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
                  >
                    <Icon className="w-12 h-12 text-black mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-black mb-2">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
