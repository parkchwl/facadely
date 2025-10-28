'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Check, Menu, X, Instagram, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cardo } from 'next/font/google';
import { i18n, type Locale } from '@/i18n/config';
import { languageNames } from '@/i18n/utils';

const cardo = Cardo({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
});

interface LayoutProps {
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dictionary: any;
}

export default function Layout({ children, dictionary }: LayoutProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getLocaleFromPath = (path: string): Locale => {
    const segments = path.split('/');
    const locale = segments[1] as Locale;
    return i18n.locales.includes(locale) ? locale : i18n.defaultLocale;
  };

  const currentLocale = getLocaleFromPath(pathname);

  const redirectedPathName = (locale: Locale) => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = locale;
    return segments.join('/');
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
              backgroundImage: 'url(/image/Template.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }
          : undefined
      }
    >
      <header className="w-full top-0 z-50 fixed">
        <div className={`py-3 sm:py-4 flex justify-between items-center transition-all duration-300 ${
          pathname.endsWith('/templates')
            ? `max-w-7xl mx-4 lg:mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 ${isScrolled || isMobileMenuOpen ? 'bg-black text-white shadow-md' : 'bg-white text-black shadow-md'}`
            : `w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 ${isScrolled || isMobileMenuOpen ? 'bg-black text-white shadow-md' : 'bg-white text-black'}`
        }`}>
          {/* Left Side: Logo + Desktop Nav */}
          <div className="flex items-center space-x-8">
            <Link
              href={`/${currentLocale}`}
              className="flex-shrink-0 flex items-center space-x-2 text-xl sm:text-2xl font-bold font-montserrat tracking-tight z-50"
            >
              ✦ {footer.brand.name}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              <Link href={`/${currentLocale}/templates`} className="font-semibold hover:text-blue-400 transition-colors">{navigation.templates}</Link>
              <Link href={`/${currentLocale}/generate`} className="font-semibold hover:text-blue-400 transition-colors">{navigation.generate}</Link>
              <Link href={`/${currentLocale}/service`} className="font-semibold hover:text-blue-400 transition-colors">{navigation.service}</Link>
              <Link href={`/${currentLocale}/pricing`} className="font-semibold hover:text-blue-400 transition-colors">{navigation.pricing}</Link>
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
              href={`/${currentLocale}/login`}
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
                  href={`/${currentLocale}/templates`}
                  className="text-6xl sm:text-7xl font-light tracking-tight text-white/80 hover:text-white hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300"
                >
                  {mobileNav.templates}
                </Link>
                <Link
                  href={`/${currentLocale}/generate`}
                  className="text-6xl sm:text-7xl font-light tracking-tight text-white/80 hover:text-white hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300"
                >
                  {mobileNav.generate}
                </Link>
                <Link
                  href={`/${currentLocale}/service`}
                  className="text-6xl sm:text-7xl font-light tracking-tight text-white/80 hover:text-white hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300"
                >
                  {mobileNav.service}
                </Link>
                <Link
                  href={`/${currentLocale}/pricing`}
                  className="text-6xl sm:text-7xl font-light tracking-tight text-white/80 hover:text-white hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300"
                >
                  {mobileNav.pricing}
                </Link>
              </nav>

              {/* Bottom Section - Language Selector & Sign Up */}
              <div className="flex flex-col space-y-6">
                {/* Divider */}
                <div className="border-t border-white/10"></div>

                {/* Language Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {i18n.locales.map((locale) => {
                    const lang = languageNames[locale];
                    return (
                      <Link
                        key={locale}
                        href={redirectedPathName(locale)}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`px-10 py-4 border-2 text-lg font-medium tracking-wide text-white transition-all duration-300 ${
                          currentLocale === locale
                            ? 'border-white'
                            : 'border-white/30 hover:border-white/50'
                        }`}
                      >
                        {lang.language}
                      </Link>
                    );
                  })}
                </div>

                {/* Sign Up Button */}
                <div className="flex flex-col space-y-3">
                  <Link
                    href={`/${currentLocale}/login`}
                    className="inline-block px-10 py-4 border-2 border-white text-white font-medium text-lg tracking-wide shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:bg-white hover:text-black hover:border-white transition-all duration-300 rounded-none text-center"
                  >
                    {mobileNav.signup}
                  </Link>
                  <p className="text-white/30 text-xs font-light tracking-wide">
                    {mobileNav.signupFree}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className={`flex-grow ${['/', '/pricing', '/templates'].some(p => pathname.endsWith(p)) ? '' : 'pt-20 sm:pt-24'}`}>
        {children}
      </main>

      {/* Footer */}
      <footer className={`relative z-10 w-full text-white ${pathname.endsWith('/templates') ? '' : 'bg-black'}`}>
        <div className={`py-12 ${
          pathname.endsWith('/templates')
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
