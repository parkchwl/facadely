'use client';

import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';

interface TermsCheckboxProps {
  label: string;
  linkText: string;
  linkHref: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function TermsCheckbox({ label, linkText, linkHref, checked, onChange }: TermsCheckboxProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="relative flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className={`
          w-5 h-5 border-2 rounded transition-all duration-200
          ${checked
            ? 'bg-black border-black'
            : 'border-gray-300 group-hover:border-gray-400'
          }
        `}>
          {checked && (
            <Check className="w-full h-full text-white p-0.5" strokeWidth={3} />
          )}
        </div>
      </div>
      <span className="text-sm text-gray-600 leading-relaxed">
        {label}{' '}
        <Link
          href={linkHref}
          target="_blank"
          onClick={(e) => e.stopPropagation()}
          className="text-black font-medium underline hover:text-gray-700 transition-colors"
        >
          {linkText}
        </Link>
      </span>
    </label>
  );
}
