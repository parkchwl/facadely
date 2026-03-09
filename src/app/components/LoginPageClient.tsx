'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SocialLoginButton from './SocialLoginButton';
import { getGoogleAuthUrl, login, me, signup } from '@/lib/api/auth';
import type { LoginPageDictionary } from '@/types/dictionary';
import { resolvePostLoginPath, sanitizeNextPath } from '@/lib/auth-redirect';

// Helper to render text with links
const TextWithLinks = ({ text, links }: { text: string, links: { [key: string]: { href: string, text: string } } }) => {
  const parts = text.split(/(\{.*?\})/g);
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/\{(.*)\}/);
        if (match) {
          const key = match[1];
          const link = links[key];
          if (link) {
            return (
              <Link key={i} href={link.href} className="text-black underline hover:text-gray-700">
                {link.text}
              </Link>
            );
          }
        }
        return part;
      })}
    </>
  );
};

type Mode = 'signin' | 'signup';

export default function LoginPageClient({ dictionary }: { dictionary: LoginPageDictionary }) {
  const router = useRouter();
  const params = useParams() as { lang: string };
  const searchParams = useSearchParams();
  const { lang } = params;
  const postLoginPath = useMemo(
    () => resolvePostLoginPath(lang, searchParams.get('next')),
    [lang, searchParams],
  );

  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const oauthState = searchParams.get('oauth');
  const oauthError = searchParams.get('error');

  const bannerMessage = useMemo(() => {
    if (oauthState === 'success') {
      return dictionary.googleSuccess;
    }
    if (oauthState === 'error') {
      return oauthError ? `${dictionary.googleError}: ${oauthError}` : dictionary.googleError;
    }
    return '';
  }, [oauthError, oauthState, dictionary.googleError, dictionary.googleSuccess]);

  const termLinks = {
    terms: { href: `/${lang}/terms`, text: dictionary.termsLinkText },
    privacy: { href: `/${lang}/privacy`, text: dictionary.privacyLinkText },
  };

  useEffect(() => {
    if (oauthState !== 'success') {
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        await me();
        if (!cancelled) {
          window.location.replace(postLoginPath);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : dictionary.googleError);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dictionary.googleError, oauthState, postLoginPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && password !== confirmPassword) {
      setError(dictionary.passwordMismatch);
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'signup') {
        await signup({
          email,
          password,
          name,
          locale: lang,
          agreeTerms: true,
        });
      } else {
        await login({ email, password });
      }

      router.push(postLoginPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : dictionary.unknownError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    document.cookie = `facadely_lang=${lang}; Path=/; Max-Age=600; SameSite=Lax`;
    const safeNextPath = sanitizeNextPath(searchParams.get('next'));
    if (safeNextPath) {
      document.cookie = `facadely_next=${encodeURIComponent(safeNextPath)}; Path=/; Max-Age=600; SameSite=Lax`;
    } else {
      document.cookie = 'facadely_next=; Path=/; Max-Age=0; SameSite=Lax';
    }
    window.location.href = getGoogleAuthUrl();
  };

  return (
    <div
      className="min-h-app-vh flex flex-col"
      style={{
        backgroundImage: 'url("/image/login.avif")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="flex justify-between items-center p-6 relative z-50">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-3 text-white hover:text-gray-200 border border-white/20 px-6 py-3 rounded-full backdrop-blur-sm transition-colors duration-200 cursor-pointer"
        >
          <ArrowLeft size={20} />
          <span className="text-base font-light tracking-wide">{dictionary.back}</span>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <Link
              href={`/${lang}`}
              className="inline-flex flex-col items-center justify-center mb-6 text-gray-900 hover:text-black transition-colors"
            >
              <span className="text-6xl font-montserrat font-bold animate-pulse-glow-dark hover:animate-none transition-all">
                ✦
              </span>
              <span className="text-4xl font-montserrat font-bold tracking-tight">
                {dictionary.title}
              </span>
            </Link>
            <p className="text-sm text-gray-500 mt-2 font-light">
              {dictionary.subtitle}
            </p>
          </div>

          {bannerMessage && (
            <div className="mb-4 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700">
              {bannerMessage}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 mb-6">
            {mode === 'signup' && (
              <div>
                <label className="mb-1 block text-sm text-gray-700">{dictionary.nameLabel}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm text-gray-700">{dictionary.emailLabel}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-700">{dictionary.passwordLabel}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="mb-1 block text-sm text-gray-700">{dictionary.confirmPasswordLabel}</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-black py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? dictionary.loading
                : mode === 'signup'
                  ? dictionary.signUpButton
                  : dictionary.signInButton}
            </button>
          </form>

          <div className="mb-6 text-center">
            <button
              type="button"
              onClick={() => setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'))}
              className="text-sm text-gray-600 underline underline-offset-2"
            >
              {mode === 'signin' ? dictionary.switchToSignUp : dictionary.switchToSignIn}
            </button>
          </div>

          <div className="relative mb-6 text-center">
            <span className="bg-white px-3 text-xs text-gray-500">{dictionary.orDivider}</span>
            <div className="-mt-2 h-px w-full bg-gray-200" />
          </div>

          <div className="space-y-3 mb-8">
            <SocialLoginButton
              label={dictionary.google}
              onClick={handleGoogleLogin}
            />
          </div>

          <div className="text-center space-y-3 px-4">
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              <TextWithLinks text={dictionary.terms} links={termLinks} />
            </p>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              {dictionary.captcha}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
