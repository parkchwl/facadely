'use client';

import React from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

interface TermsAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
  provider: string;
}

export default function TermsAgreementModal({ isOpen, onClose, onAgree, provider }: TermsAgreementModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-none max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors duration-200"
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        <h2 className="text-2xl font-light text-black mb-2 tracking-tight">Welcome to Facadely</h2>
        <p className="text-sm text-gray-400 mb-8 font-light">
          Complete your {provider} signup
        </p>

        <div className="mb-8 p-6 bg-gray-50 rounded-none border-l-2 border-black">
          <p className="text-sm text-gray-600 leading-relaxed font-light">
            By creating an account,
            <br />
            you agree to our{' '}
            <Link
              href="/terms"
              target="_blank"
              className="text-black font-medium underline hover:text-gray-700"
            >
              Terms of Service
            </Link>
            <br />
            and have read and understood the{' '}
            <Link
              href="/privacy"
              target="_blank"
              className="text-black font-medium underline hover:text-gray-700"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <button
          onClick={onAgree}
          className="w-full py-3 rounded-none font-light tracking-wide transition-all duration-300 bg-black text-white hover:bg-gray-900"
        >
          Complete Signup
        </button>

        <p className="text-xs text-gray-400 text-center mt-6 font-light">
          You can review our policies anytime in the footer
        </p>
      </div>
    </div>
  );
}
