'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PolicyPageHeader() {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-black transition-colors duration-300"
        >
          <ArrowLeft size={18} strokeWidth={1.5} />
          <span className="text-sm font-light tracking-wide">Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
