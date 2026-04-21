'use client';

import { useEffect, useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Check, Menu, X, Instagram, Facebook, ChevronDown, LayoutDashboard, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { i18n, type Locale } from '@/i18n/config';
import { languageNames } from '@/i18n/utils';
import type { Dictionary } from '@/types/dictionary';
import type { AuthenticatedUser } from '@/lib/auth-types';
import { getErrorMessage, logoutWithRetry } from '@/lib/logout';
import { me } from '@/lib/api/auth';

const dmSerif = { className: 'font-serif' } as const;

interface LayoutProps {
  children: ReactNode;
  dictionary: Dictionary;
  authenticatedUser: AuthenticatedUser | null;
}

export default function Layout({ children, dictionary, authenticatedUser }: LayoutProps) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(authenticatedUser);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isMobileAccountMenuOpen, setIsMobileAccountMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const editorHref = process.env.NEXT_PUBLIC_BETA_EDITOR_URL?.trim() || '/editor';

  useEffect(() => {
    let isMounted = true;

    const resolveAuthenticatedUser = async () => {
      if (authenticatedUser) {
        setCurrentUser(authenticatedUser);
        return;
      }

      try {
        const user = await me();
        if (isMounted) {
          setCurrentUser(user);
        }
      } catch {
        if (isMounted) {
          setCurrentUser(null);
        }
      }
    };

    resolveAuthenticatedUser();

    return () => {
      isMounted = false;
    };
  }, [authenticatedUser]);

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

  const { navigation, mobileNav, languageSelector, footer } = dictionary;
  const { accountMenu } = dictionary;
  const homeHref = createLocalizedPath(currentLocale, '/');
  const dashboardHref = createLocalizedPath(currentLocale, '/dashboard');
  const loginHref = createLocalizedPath(currentLocale, '/login');
  
  const isOnDashboard = pathname.endsWith('/dashboard') || pathname.includes('/dashboard/');

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    setLogoutError(null);

    try {
      await logoutWithRetry();
      window.location.assign(homeHref);
    } catch (error) {
      setIsLoggingOut(false);
      setLogoutError(getErrorMessage(error, accountMenu.logoutFailed));
    }
  };

  return (
    <div
      className="min-h-app-vh text-gray-900 font-sans flex flex-col"
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
      {!isOnDashboard && (
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/78 text-white backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 sm:h-[72px] sm:px-8">
          {/* Left Side: Logo */}
          <div className="flex items-center">
            <Link
              href={createLocalizedPath(currentLocale, '/')}
              className="flex-shrink-0 flex items-center space-x-1 text-lg font-bold font-montserrat tracking-tight text-white transition-opacity hover:opacity-80 sm:text-xl"
            >
              ✦ {footer.brand.name}
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href={createLocalizedPath(currentLocale, '/templates')} className="text-sm font-medium text-white/72 transition-colors hover:text-white">{navigation.templates}</Link>
            <Link href={editorHref} className="text-sm font-medium text-white/72 transition-colors hover:text-white">{navigation.generate}</Link>
            <Link href={createLocalizedPath(currentLocale, '/service')} className="text-sm font-medium text-white/72 transition-colors hover:text-white">{navigation.service}</Link>
            <Link href={createLocalizedPath(currentLocale, '/pricing')} className="text-sm font-medium text-white/72 transition-colors hover:text-white">{navigation.pricing}</Link>
          </nav>

          {/* Right Side Actions (Desktop) */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Language Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsLanguageDropdownOpen(true)}
              onMouseLeave={() => setIsLanguageDropdownOpen(false)}
            >
              <motion.button
                className="flex items-center p-1 text-white/72 transition-colors hover:text-white"
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

            {currentUser ? (
              <div
                className="relative"
                onMouseEnter={() => setIsAccountMenuOpen(true)}
                onMouseLeave={() => setIsAccountMenuOpen(false)}
              >
                <motion.button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md border border-white/14 px-3.5 py-2 text-sm font-medium text-white transition hover:border-white/28 hover:bg-white/6"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsAccountMenuOpen((prev) => !prev)}
                >
                  <LayoutDashboard size={16} />
                  {accountMenu.dashboard}
                  <ChevronDown className={`h-4 w-4 transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {isAccountMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 mt-1.5 w-60 overflow-hidden rounded-2xl border border-gray-200/80 bg-white text-black shadow-xl"
                    >
                      <div className="border-b border-gray-200 bg-gray-50 px-3.5 py-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                          {accountMenu.signedInAs}
                        </p>
                        <p className="mt-1.5 truncate text-xs font-medium text-gray-700">{currentUser.email}</p>
                      </div>
                      <div className="p-1.5">
                        <Link
                          href={dashboardHref}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-950"
                          onClick={() => setIsAccountMenuOpen(false)}
                        >
                          <LayoutDashboard size={14} />
                          {accountMenu.dashboard}
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <LogOut size={14} />
                          {isLoggingOut ? accountMenu.loggingOut : accountMenu.logout}
                        </button>
                        {logoutError && (
                          <p className="px-3 pb-2 pt-1 text-[11px] font-medium text-rose-600">
                            {logoutError}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href={loginHref}
                className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-200"
              >
                {navigation.signup} <span className="font-normal">{navigation.signupFree}</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden z-50">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-white/80 transition-colors hover:border-white/20 hover:text-white"
            >
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
                className="fixed inset-0 h-app-vh bg-black/60 backdrop-blur-sm z-40 lg:hidden overflow-hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Menu Panel */}
              <motion.div
                initial={{ y: "-100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200, mass: 1.2 }}
                className="fixed top-0 left-0 right-0 h-app-vh bg-black z-50 lg:hidden overflow-y-auto"
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
                        href={editorHref}
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

                  {/* Account Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.95, duration: 0.5 }}
                    className="space-y-2"
                  >
                    {currentUser ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsMobileAccountMenuOpen((prev) => !prev)}
                          className="flex w-full items-center justify-between border-2 border-white px-5 py-3 text-left text-white transition-all duration-300 hover:bg-white hover:text-black"
                        >
                          <span className="text-sm font-medium tracking-wide">{accountMenu.dashboard}</span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${isMobileAccountMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence initial={false}>
                          {isMobileAccountMenuOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                                  {accountMenu.signedInAs}
                                </p>
                                <p className="mt-1.5 break-all text-xs text-white/70">{currentUser.email}</p>
                                <Link
                                  href={dashboardHref}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="mt-3 block w-full border border-white/25 px-5 py-2.5 text-center text-xs font-medium text-white/85 transition-all duration-300 hover:border-white/50 hover:text-white"
                                >
                                  {accountMenu.dashboard}
                                </Link>
                                <button
                                  type="button"
                                  onClick={handleLogout}
                                  disabled={isLoggingOut}
                                  className="mt-2.5 block w-full border border-white/25 px-5 py-2.5 text-center text-xs font-medium text-white/85 transition-all duration-300 hover:border-red-400 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {isLoggingOut ? accountMenu.loggingOut : accountMenu.logout}
                                </button>
                                {logoutError && (
                                  <p className="mt-2 text-center text-[11px] font-medium text-rose-300">
                                    {logoutError}
                                  </p>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <>
                        <Link
                          href={loginHref}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block w-full px-6 py-4 border-2 border-white text-white font-medium text-base tracking-wide hover:bg-white hover:text-black transition-all duration-300 text-center"
                        >
                          {mobileNav.signup}
                        </Link>
                        <p className="text-white/40 text-xs font-light tracking-wide text-center">
                          {mobileNav.signupFree}
                        </p>
                      </>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
      )}

      {/* Main Content */}
      <main className={isOnDashboard ? "flex-1 w-full h-full" : "flex-grow pt-16 sm:pt-[72px]"}>
        {children}
      </main>

      {/* Footer */}
      {!isOnDashboard && (
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
                <li><Link href={createLocalizedPath(currentLocale, '/customer-service')} className="hover:text-white transition-colors">{footer.support.customerService}</Link></li>
                <li><Link href={createLocalizedPath(currentLocale, '/qa')} className="hover:text-white transition-colors">{footer.support.qa}</Link></li>
                <li><Link href={createLocalizedPath(currentLocale, '/status')} className="hover:text-white transition-colors">{footer.support.serverStatus}</Link></li>
              </ul>
            </div>

            {/* Company - New Section */}
            <div>
              <h4 className="font-semibold mb-3 text-white">{footer.company.title}</h4>
              <ul className="space-y-2 text-neutral-400 text-sm">
                <li><Link href={createLocalizedPath(currentLocale, '/about')} className="hover:text-white transition-colors">{footer.company.about}</Link></li>
                <li><Link href={createLocalizedPath(currentLocale, '/contact')} className="hover:text-white transition-colors">{footer.company.contact}</Link></li>
                <li><Link href={createLocalizedPath(currentLocale, '/blog')} className="hover:text-white transition-colors">{footer.company.blog}</Link></li>
              </ul>
            </div>
          </div>

          {/* BLOOM YOUR DREAM */}
          <div className="mt-16 text-center overflow-hidden">
            <h1
              className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold whitespace-nowrap ${dmSerif.className}`}
            >
              {footer.headline}
            </h1>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-neutral-400 border-t border-neutral-700">
            <div className="flex flex-col sm:flex-row items-center gap-x-6 gap-y-3 text-xs order-2 sm:order-1 mt-4 sm:mt-0">
              <p className="text-neutral-500">{footer.legal.poweredBy}</p>
              <div className="flex items-center gap-x-6">
                <Link href={createLocalizedPath(currentLocale, '/terms')} className="hover:text-white transition-colors">{footer.legal.terms}</Link>
                <Link href={createLocalizedPath(currentLocale, '/privacy')} className="hover:text-white transition-colors">{footer.legal.privacy}</Link>
                <Link href={createLocalizedPath(currentLocale, '/cookie')} className="hover:text-white transition-colors">{footer.legal.cookie}</Link>
              </div>
            </div>
            <div className="flex items-center gap-x-5 order-1 sm:order-2">
              <a href="#" aria-label="Instagram" className="text-neutral-400 hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" aria-label="Facebook" className="text-neutral-400 hover:text-white transition-colors"><Facebook size={20} /></a>
            </div>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
}
