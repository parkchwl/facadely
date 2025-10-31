/**
 * AboutPageContent Component
 *
 * Shared implementation for About page across all languages.
 * Used by both (root)/about and [lang]/(main)/about routes.
 */

import type { AboutPageDictionary } from '@/types/dictionary';

interface AboutPageContentProps {
  dictionary: AboutPageDictionary;
}

export default function AboutPageContent({ dictionary }: AboutPageContentProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold text-black mb-6">{dictionary.title}</h1>
        <p className="text-2xl text-gray-600 mb-16">{dictionary.subtitle}</p>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-4">{dictionary.mission.heading}</h2>
          <p className="text-lg text-gray-700">{dictionary.mission.content}</p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-4">{dictionary.vision.heading}</h2>
          <p className="text-lg text-gray-700">{dictionary.vision.content}</p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-black mb-6">{dictionary.values.heading}</h2>
          <ul className="space-y-4">
            {dictionary.values.items.map((value, idx) => (
              <li key={idx} className="text-lg text-gray-700">• {value}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
