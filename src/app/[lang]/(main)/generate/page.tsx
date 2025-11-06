import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n/config';
import { Zap } from 'lucide-react';

export default async function GeneratePage({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center py-20 px-6">
      <div className="text-center max-w-2xl">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
            <Zap className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight">
          {dictionary.generatePage.title}
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-gray-300 mb-8 leading-relaxed">
          {dictionary.generatePage.subtitle}
        </p>

        {/* Coming Soon Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 mb-12">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          <span className="text-white font-semibold">Coming Soon</span>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          We&apos;re working on an amazing AI-powered website generator that will create beautiful, professional websites in seconds. Stay tuned!
        </p>
      </div>
    </div>
  );
}
