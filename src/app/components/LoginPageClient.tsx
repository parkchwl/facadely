'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SocialLoginButton from './SocialLoginButton';
import TermsAgreementModal from './TermsAgreementModal';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LoginPageClient({ dictionary }: { dictionary: any }) {
  const router = useRouter();
  const params = useParams() as { lang: string };
  const { lang } = params;
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('');

  const handleSocialLogin = async (provider: string) => {
    const isNewUser = Math.random() > 0.5;
    if (isNewUser) {
      setSelectedProvider(provider);
      setShowTermsModal(true);
    } else {
      alert(`${provider} login successful! (Existing user)`);
      // router.push('/dashboard');
    }
  };

  const handleTermsAgree = () => {
    setShowTermsModal(false);
    alert(`${selectedProvider} signup complete! (New user)`);
    // router.push('/dashboard');
  };

  const termLinks = {
    terms: { href: `/${lang}/terms`, text: dictionary.termsLinkText },
    privacy: { href: `/${lang}/privacy`, text: dictionary.privacyLinkText },
  };

  return (
    <div
      className="min-h-screen flex flex-col"
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
        <div className="w-full max-w-md bg-white p-12 rounded-3xl shadow-2xl">
          <div className="text-center mb-12">
            <div className="text-6xl text-black mb-3 font-montserrat font-bold">✦</div>
            <h1 className="text-4xl font-montserrat font-bold text-gray-900 tracking-tight">
              {dictionary.title}
            </h1>
            <p className="text-sm text-gray-500 mt-2 font-light">
              {dictionary.subtitle}
            </p>
          </div>

          <div className="space-y-3 mb-8">
            <SocialLoginButton
              provider="Google"
              onClick={() => handleSocialLogin('Google')}
            />
            <SocialLoginButton
              provider="Apple"
              onClick={() => handleSocialLogin('Apple')}
            />
            <SocialLoginButton
              provider="Facebook"
              onClick={() => handleSocialLogin('Facebook')}
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

      <TermsAgreementModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAgree={handleTermsAgree}
        provider={selectedProvider}
        dictionary={dictionary.termsModal}
      />
    </div>
  );
}
