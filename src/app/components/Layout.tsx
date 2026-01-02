'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Check, Menu, X, Instagram, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cardo } from 'next/font/google';
import { i18n, type Locale } from '@/i18n/config';
import { languageNames } from '@/i18n/utils';
import type { Dictionary } from '@/types/dictionary';

const cardo = Cardo({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
});

interface LayoutProps {
  children: ReactNode;
  dictionary: Dictionary;
}

export default function Layout({ children, dictionary }: LayoutProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getLocaleFromPath = (path: string): Locale => {
    const segments = path.split('/');
    const potentialLocale = segments[1] as Locale;
    // If path starts with a known locale (excluding 'en'), return it
    if (potentialLocale && i18n.locales.includes(potentialLocale) && potentialLocale !== 'en') {
      return potentialLocale;
    }
    // Otherwise, it's English (root path)
    return i18n.defaultLocale;
  };

  const currentLocale = getLocaleFromPath(pathname);

  const createLocalizedPath = (locale: Locale, path: string): string => {
    // If English, no prefix
    if (locale === i18n.defaultLocale) {
      return path;
    }
    // Other languages get prefix
    return `/${locale}${path}`;
  };

  const redirectedPathName = (locale: Locale) => {
    if (!pathname) return createLocalizedPath(locale, '/');

    // Remove current locale prefix if exists
    let cleanPath = pathname;
    const segments = pathname.split('/').filter(s => s);
    if (segments[0] && i18n.locales.includes(segments[0] as Locale)) {
      cleanPath = '/' + segments.slice(1).join('/');
    }

    return createLocalizedPath(locale, cleanPath || '/');
  };

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

  const { navigation, mobileNav, languageSelector, footer } = dictionary;

  return (
    <div
      className="min-h-screen text-gray-900 font-sans flex flex-col"
      style={
        pathname.endsWith('/templates')
          ? {
            backgroundImage: 'url(/image/Template.avif)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }
          : undefined
      }
    >
      <header className="w-full top-0 z-50 fixed flex justify-center">
        <div className="py-3 sm:py-4 flex justify-between items-center max-w-7xl w-full mx-4 px-6 sm:px-8 rounded-2xl mt-4 bg-black/60 backdrop-blur-md text-white shadow-lg">
          {/* Left Side: Logo */}
          <div className="flex items-center">
            <Link
              href={createLocalizedPath(currentLocale, '/')}
              className="flex-shrink-0 flex items-center space-x-1 text-lg sm:text-xl font-bold font-montserrat tracking-tight z-50"
            >
              ✦ {footer.brand.name}
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href={createLocalizedPath(currentLocale, '/templates')} className="font-semibold hover:text-blue-400 transition-colors text-sm">{navigation.templates}</Link>
            <Link href={createLocalizedPath(currentLocale, '/generate')} className="font-semibold hover:text-blue-400 transition-colors text-sm">{navigation.generate}</Link>
            <Link href={createLocalizedPath(currentLocale, '/service')} className="font-semibold hover:text-blue-400 transition-colors text-sm">{navigation.service}</Link>
            <Link href={createLocalizedPath(currentLocale, '/pricing')} className="font-semibold hover:text-blue-400 transition-colors text-sm">{navigation.pricing}</Link>
          </nav>

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
                      {languageSelector.title}
                    </div>
                    <div className="grid grid-cols-2 gap-1 p-2">
                      {i18n.locales.map((locale) => {
                        const lang = languageNames[locale];
                        return (
                          <Link
                            key={locale}
                            href={redirectedPathName(locale)}
                            className="flex justify-between items-center px-3 py-2 text-sm hover:bg-gray-100 rounded transition-colors"
                            onClick={() => setIsLanguageDropdownOpen(false)}
                          >
                            <span className="flex flex-col">
                              <span className="font-medium">{lang.country}</span>
                              <span className="text-xs text-gray-500">{lang.language}</span>
                            </span>
                            {currentLocale === locale && <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sign Up Button */}
            <Link
              href={createLocalizedPath(currentLocale, '/login')}
              className="bg-white text-black hover:bg-gray-200 py-2 px-4 rounded-lg transition shadow font-bold"
            >
              {navigation.signup} <span className="font-normal">{navigation.signupFree}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden z-50">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Modern Dropdown Style (Top to Bottom) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop with fade */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden overflow-hidden"
                style={{ height: '100dvh' }}
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Menu Panel */}
              <motion.div
                initial={{ y: "-100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200, mass: 1.2 }}
                className="fixed top-0 left-0 right-0 bg-black z-50 lg:hidden overflow-y-auto"
                style={{ height: '100dvh' }}
              >
                <div className="p-6 pb-8">
                  {/* Header with Close Button */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    className="flex justify-between items-center mb-8"
                  >
                    <Link
                      href={createLocalizedPath(currentLocale, '/')}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="font-bold text-xl text-white hover:text-white/80 transition-colors"
                    >
                      ✦ facadely
                    </Link>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      <X size={28} strokeWidth={1.5} />
                    </button>
                  </motion.div>

                  {/* Navigation Links - Staggered Animation */}
                  <nav className="flex flex-col space-y-1 mb-8">
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.5 }}
                    >
                      <Link
                        href={createLocalizedPath(currentLocale, '/templates')}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-3xl sm:text-4xl font-light tracking-tight text-white/80 hover:text-white hover:pl-4 transition-all duration-300 py-3"
                      >
                        {mobileNav.templates}
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45, duration: 0.5 }}
                    >
                      <Link
                        href={createLocalizedPath(currentLocale, '/generate')}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-3xl sm:text-4xl font-light tracking-tight text-white/80 hover:text-white hover:pl-4 transition-all duration-300 py-3"
                      >
                        {mobileNav.generate}
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55, duration: 0.5 }}
                    >
                      <Link
                        href={createLocalizedPath(currentLocale, '/service')}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-3xl sm:text-4xl font-light tracking-tight text-white/80 hover:text-white hover:pl-4 transition-all duration-300 py-3"
                      >
                        {mobileNav.service}
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.65, duration: 0.5 }}
                    >
                      <Link
                        href={createLocalizedPath(currentLocale, '/pricing')}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-3xl sm:text-4xl font-light tracking-tight text-white/80 hover:text-white hover:pl-4 transition-all duration-300 py-3"
                      >
                        {mobileNav.pricing}
                      </Link>
                    </motion.div>
                  </nav>

                  {/* Divider */}
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.75, duration: 0.5 }}
                    className="border-t border-white/10 mb-6 origin-left"
                  />

                  {/* Language Selector */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.85, duration: 0.5 }}
                    className="mb-6"
                  >
                    <h3 className="text-white/60 text-sm font-medium mb-3 tracking-wide">LANGUAGE</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {i18n.locales.map((locale) => {
                        const lang = languageNames[locale];
                        return (
                          <Link
                            key={locale}
                            href={redirectedPathName(locale)}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`px-4 py-3 border text-sm font-medium tracking-wide text-white transition-all duration-300 text-center ${currentLocale === locale
                              ? 'border-white bg-white/10'
                              : 'border-white/20 hover:border-white/40'
                              }`}
                          >
                            {lang.language}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* Sign Up Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.95, duration: 0.5 }}
                    className="space-y-2"
                  >
                    <Link
                      href={createLocalizedPath(currentLocale, '/login')}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-6 py-4 border-2 border-white text-white font-medium text-base tracking-wide hover:bg-white hover:text-black transition-all duration-300 text-center"
                    >
                      {mobileNav.signup}
                    </Link>
                    <p className="text-white/40 text-xs font-light tracking-wide text-center">
                      {mobileNav.signupFree}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className={`relative z-10 w-full text-white ${pathname.endsWith('/templates') ? '' : 'bg-black'}`}>
        <div className={`py-12 ${pathname.endsWith('/templates')
          ? 'max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 bg-black'
          : 'px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16'
          }`}>
          {/* Adjusted grid to accommodate 4 columns on larger screens */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Logo & Tagline */}
            <div className="col-span-2 md:col-span-1">
              <div className="font-bold text-lg mb-2">✦ {footer.brand.name}</div>
              <p className="text-neutral-400 text-sm">{footer.brand.tagline}</p>
              <p className="text-neutral-500 text-xs mt-4">{footer.brand.copyright}</p>
            </div>

            {/* Platform */}
            <div>
              <h4 className="font-semibold mb-3 text-white">{footer.platform.title}</h4>
              <ul className="space-y-2 text-neutral-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">{footer.platform.generator}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{footer.platform.template}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{footer.platform.domain}</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-3 text-white">{footer.support.title}</h4>
              <ul className="space-y-2 text-neutral-400 text-sm">
                <li><Link href={redirectedPathName(currentLocale).replace(/\/[^/]*$/, '/customer-service')} className="hover:text-white transition-colors">{footer.support.customerService}</Link></li>
                <li><Link href={redirectedPathName(currentLocale).replace(/\/[^/]*$/, '/qa')} className="hover:text-white transition-colors">{footer.support.qa}</Link></li>
                <li><Link href={redirectedPathName(currentLocale).replace(/\/[^/]*$/, '/status')} className="hover:text-white transition-colors">{footer.support.serverStatus}</Link></li>
              </ul>
            </div>

            {/* Company - New Section */}
            <div>
              <h4 className="font-semibold mb-3 text-white">{footer.company.title}</h4>
              <ul className="space-y-2 text-neutral-400 text-sm">
                <li><Link href={redirectedPathName(currentLocale).replace(/\/[^/]*$/, '/about')} className="hover:text-white transition-colors">{footer.company.about}</Link></li>
                <li><Link href={redirectedPathName(currentLocale).replace(/\/[^/]*$/, '/contact')} className="hover:text-white transition-colors">{footer.company.contact}</Link></li>
                <li><Link href={createLocalizedPath(currentLocale, '/blog')} className="hover:text-white transition-colors">{footer.company.blog}</Link></li>
              </ul>
            </div>
          </div>

          {/* BLOOM YOUR DREAM */}
          <div className="mt-16 text-center overflow-hidden">
            <h1
              className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold whitespace-nowrap ${cardo.className}`}
            >
              {footer.headline}
            </h1>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-neutral-400 border-t border-neutral-700">
            <div className="flex flex-col sm:flex-row items-center gap-x-6 gap-y-3 text-xs order-2 sm:order-1 mt-4 sm:mt-0">
              <p className="text-neutral-500">{footer.legal.poweredBy}</p>
              <div className="flex items-center gap-x-6">
                <Link href={redirectedPathName(currentLocale).replace(/\/[^/]*$/, '/terms')} className="hover:text-white transition-colors">{footer.legal.terms}</Link>
                <Link href={redirectedPathName(currentLocale).replace(/\/[^/]*$/, '/privacy')} className="hover:text-white transition-colors">{footer.legal.privacy}</Link>
                <Link href={redirectedPathName(currentLocale).replace(/\/[^/]*$/, '/cookie')} className="hover:text-white transition-colors">{footer.legal.cookie}</Link>
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
