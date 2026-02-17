'use client';

import React from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import type { TermsModalDictionary } from '@/types/dictionary';

interface TermsAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
  provider: string;
  lang: string;
  dictionary: TermsModalDictionary;
}

export default function TermsAgreementModal({ isOpen, onClose, onAgree, provider, lang, dictionary }: TermsAgreementModalProps) {
  if (!isOpen) return null;

  const renderAgreementText = (text: string) => {
    return text.split(/(\{terms\}|\{privacy\})/g).map((part, idx) => {
      if (part === '{terms}') {
        return (
          <Link
            key={`terms-${idx}`}
            href={`/${lang}/terms`}
            target="_blank"
            rel="noreferrer"
            className="text-black font-medium underline hover:text-gray-700"
          >
            {dictionary.termsLinkText}
          </Link>
        );
      }

      if (part === '{privacy}') {
        return (
          <Link
            key={`privacy-${idx}`}
            href={`/${lang}/privacy`}
            target="_blank"
            rel="noreferrer"
            className="text-black font-medium underline hover:text-gray-700"
          >
            {dictionary.privacyLinkText}
          </Link>
        );
      }

      return <React.Fragment key={`text-${idx}`}>{part}</React.Fragment>;
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 h-app-vh flex items-start sm:items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm overflow-y-auto"
    >
      <div className="bg-white rounded-none max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors duration-200"
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        <h2 className="text-2xl font-light text-black mb-2 tracking-tight">{dictionary.title}</h2>
        <p className="text-sm text-gray-400 mb-8 font-light">
          {dictionary.subtitle.replace('{provider}', provider)}
        </p>

        <div className="mb-8 p-6 bg-gray-50 rounded-none border-l-2 border-black">
          <p className="text-sm text-gray-600 leading-relaxed font-light">
            {renderAgreementText(dictionary.agreement)}
          </p>
        </div>

        <button
          onClick={onAgree}
          className="w-full py-3 rounded-none font-light tracking-wide transition-all duration-300 bg-black text-white hover:bg-gray-900"
        >
          {dictionary.agreeButton}
        </button>

        <p className="text-xs text-gray-400 text-center mt-6 font-light">
          {dictionary.footerNote}
        </p>
      </div>
    </div>
  );
}
