'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Check, Menu, X, Instagram, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cardo } from 'next/font/google';

const cardo = Cardo({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
});

const countryLanguages = [
  { country: 'Global English', language: 'English', code: 'global-en' },
  { country: 'Việt Nam', language: 'Tiếng Việt', code: 'vn-vi' },
  { country: 'India', language: 'हिंदी', code: 'in-hi' },
  { country: 'Indonesia', language: 'Bahasa Indonesia', code: 'id-id' },
  { country: '台灣', language: '繁體中文', code: 'tw-zh' },
  { country: '대한민국', language: '한국어', code: 'kr-ko' },
];

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(countryLanguages.find(lang => lang.code === 'kr-ko')!);
  const pathname = usePathname();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 0);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div
      className="min-h-screen text-gray-900 font-sans flex flex-col"
      style={
        pathname === '/templates'
          ? {
              backgroundImage: 'url(/image/Template.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }
          : undefined
      }
    >
      <header className="w-full top-0 z-50 fixed">
        <div className={`py-3 sm:py-4 flex justify-between items-center transition-all duration-300 ${
          pathname === '/templates'
            ? `max-w-7xl mx-4 lg:mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 ${isScrolled || isMobileMenuOpen ? 'bg-black text-white shadow-md' : 'bg-white text-black shadow-md'}`
            : `w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 ${isScrolled || isMobileMenuOpen ? 'bg-black text-white shadow-md' : 'bg-white text-black'}`
        }`}>
          {/* Left Side: Logo + Desktop Nav */}
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="flex-shrink-0 flex items-center space-x-2 text-xl sm:text-2xl font-bold font-montserrat tracking-tight z-50"
            >
              ✦ facadely
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              <Link href="/templates" className="font-semibold hover:text-blue-400 transition-colors">Templates</Link>
              <Link href="/generate" className="font-semibold hover:text-blue-400 transition-colors">Generate</Link>
              <Link href="/service" className="font-semibold hover:text-blue-400 transition-colors">Service</Link>
              <Link href="/pricing" className="font-semibold hover:text-blue-400 transition-colors">Pricing</Link>
            </nav>
          </div>

          {/* Right Side Actions (Desktop) */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsLanguageDropdownOpen(true)}
              onMouseLeave={() => setIsLanguageDropdownOpen(false)}
            >
              <motion.button
                className="flex items-center font-semibold p-1"
                whileTap={{ scale: 0.95 }}
              >
                <Globe className="h-6 w-6" />
              </motion.button>
              <AnimatePresence>
                {isLanguageDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 bg-white text-black rounded-md shadow-lg z-10 border border-gray-200/50"
                  >
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold">
                      Choose your Country/Region
                    </div>
                    <div className="grid grid-cols-2 gap-1 p-2">
                      {countryLanguages.map((lang) => (
                        <a
                          key={lang.code}
                          href="#"
                          className="flex justify-between items-center px-3 py-2 text-sm hover:bg-gray-100 rounded transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedLanguage(lang);
                            setIsLanguageDropdownOpen(false);
                          }}
                        >
                          <span className="flex flex-col">
                            <span className="font-medium">{lang.country}</span>
                            <span className="text-xs text-gray-500">{lang.language}</span>
                          </span>
                          {selectedLanguage.code === lang.code && <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sign Up Button */}
            <Link
              href="/login"
              className="bg-white text-black hover:bg-gray-200 py-2 px-4 rounded-lg transition shadow font-bold"
            >
              Sign up <span className="font-normal">It&apos;s free!</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden z-50">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Arc Browser Dark Style (Left Slide) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 35, stiffness: 300 }}
              className="fixed inset-0 bg-black z-50 flex flex-col justify-between p-8 lg:hidden"
            >
              {/* Close Button - Top Right */}
              <div className="flex justify-end">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X size={32} strokeWidth={1} />
                </button>
              </div>

              {/* Navigation Links - Huge & Left Aligned */}
              <nav className="flex flex-col space-y-8 flex-1 justify-start pt-16">
                <Link
                  href="/templates"
                  className="text-6xl sm:text-7xl font-light tracking-tight text-white/80 hover:text-white hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300"
                >
                  Templates
                </Link>
                <Link
                  href="/generate"
                  className="text-6xl sm:text-7xl font-light tracking-tight text-white/80 hover:text-white hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300"
                >
                  Generate
                </Link>
                <Link
                  href="/service"
                  className="text-6xl sm:text-7xl font-light tracking-tight text-white/80 hover:text-white hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300"
                >
                  Service
                </Link>
                <Link
                  href="/pricing"
                  className="text-6xl sm:text-7xl font-light tracking-tight text-white/80 hover:text-white hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300"
                >
                  Pricing
                </Link>
              </nav>

              {/* Bottom Section - Language Selector & Sign Up */}
              <div className="flex flex-col space-y-6">
                {/* Divider */}
                <div className="border-t border-white/10"></div>

                {/* Language Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {countryLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-10 py-4 border-2 text-lg font-medium tracking-wide text-white transition-all duration-300 ${
                        selectedLanguage.code === lang.code
                          ? 'border-white'
                          : 'border-white/30 hover:border-white/50'
                      }`}
                    >
                      {lang.language}
                    </button>
                  ))}
                </div>

                {/* Sign Up Button */}
                <div className="flex flex-col space-y-3">
                  <Link
                    href="/login"
                    className="inline-block px-10 py-4 border-2 border-white text-white font-medium text-lg tracking-wide shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:bg-white hover:text-black hover:border-white transition-all duration-300 rounded-none text-center"
                  >
                    SIGN UP
                  </Link>
                  <p className="text-white/30 text-xs font-light tracking-wide">
                    It&apos;s free to get started
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className={`flex-grow ${['/', '/pricing', '/templates'].includes(pathname) ? '' : 'pt-20 sm:pt-24'}`}>
        {children}
      </main>

      {/* Footer */}
      <footer className={`relative z-10 w-full text-white ${pathname === '/templates' ? '' : 'bg-black'}`}>
        <div className={`py-12 ${
          pathname === '/templates'
            ? 'max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 bg-black'
            : 'px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16'
        }`}>
          {/* Adjusted grid to accommodate 4 columns on larger screens */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo & Tagline */}
          <div className="col-span-2 md:col-span-1">
            <div className="font-bold text-lg mb-2">✦ facadely</div>
            <p className="text-neutral-400 text-sm">We focus on essence</p>
            <p className="text-neutral-500 text-xs mt-4">&copy; 2025 facadely, Corp.</p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold mb-3 text-white">Platform</h4>
            <ul className="space-y-2 text-neutral-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Website Generator</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Template</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Domain</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-3 text-white">Support</h4>
            <ul className="space-y-2 text-neutral-400 text-sm">
              <li><Link href="/customer-service" className="hover:text-white transition-colors">Customer Service</Link></li>
              <li><Link href="/qa" className="hover:text-white transition-colors">Q&A</Link></li>
              <li><Link href="/status" className="hover:text-white transition-colors">Server Status</Link></li>
            </ul>
          </div>
          
          {/* Company - New Section */}
          <div>
            <h4 className="font-semibold mb-3 text-white">Company</h4>
            <ul className="space-y-2 text-neutral-400 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* BLOOM YOUR DREAM */}
        <div className="mt-16 text-center overflow-hidden">
          <h1
            className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold whitespace-nowrap ${cardo.className}`}
          >
            BLOOM YOUR DREAM
          </h1>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-neutral-400 border-t border-neutral-700">
          <div className="flex flex-col sm:flex-row items-center gap-x-6 gap-y-3 text-xs order-2 sm:order-1 mt-4 sm:mt-0">
            <p className="text-neutral-500">Powered by facadely ✦ All rights reserved.</p>
            <div className="flex items-center gap-x-6">
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/cookie" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
          <div className="flex items-center gap-x-5 order-1 sm:order-2">
            <a href="#" aria-label="Instagram" className="text-neutral-400 hover:text-white transition-colors"><Instagram size={20} /></a>
            <a href="#" aria-label="Facebook" className="text-neutral-400 hover:text-white transition-colors"><Facebook size={20} /></a>
          </div>
        </div>
        </div>
      </footer>
    </div>
  );
}
