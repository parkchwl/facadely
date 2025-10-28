'use client';

import React from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

interface TermsAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
  provider: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dictionary: any;
}

export default function TermsAgreementModal({ isOpen, onClose, onAgree, provider, dictionary }: TermsAgreementModalProps) {
  if (!isOpen) return null;

  // A simple helper to parse the string with placeholders
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parseText = (text: string, replacements: { [key: string]: any }) => {
    let result: (string | React.ReactNode)[] = [text];
    for (const key in replacements) {
      const newResult: (string | React.ReactNode)[] = [];
      result.forEach((part, i) => {
        if (typeof part === 'string') {
          const split = part.split(`{${key}}`);
          split.forEach((textPart, j) => {
            if (textPart) newResult.push(textPart);
            if (j < split.length - 1) {
              newResult.push(React.cloneElement(replacements[key], { key: `${key}-${i}-${j}` }));
            }
          });
        } else {
          newResult.push(part);
        }
      });
      result = newResult;
    }
    return result;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
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
            {parseText(dictionary.agreement, {
              terms: <Link href="/terms" target="_blank" className="text-black font-medium underline hover:text-gray-700" />,
              privacy: <Link href="/privacy" target="_blank" className="text-black font-medium underline hover:text-gray-700" />
            })}
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