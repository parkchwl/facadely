/**
 * ContactPageContent Component
 *
 * Shared implementation for Contact page across all languages.
 */

import type { ContactPageDictionary } from '@/types/dictionary';

interface ContactPageContentProps {
  dictionary: ContactPageDictionary;
}

export default function ContactPageContent({ dictionary }: ContactPageContentProps) {
  const submitText = dictionary.form.submit || dictionary.form.send || 'Submit';

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold text-black mb-4">{dictionary.title}</h1>
        <p className="text-xl text-gray-600 mb-12">{dictionary.subtitle}</p>

        <form className="space-y-6">
          <div>
            <label className="block text-black font-bold mb-2">{dictionary.form.name}</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              placeholder={dictionary.form.name}
            />
          </div>

          <div>
            <label className="block text-black font-bold mb-2">{dictionary.form.email}</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              placeholder={dictionary.form.email}
            />
          </div>

          <div>
            <label className="block text-black font-bold mb-2">{dictionary.form.subject}</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              placeholder={dictionary.form.subject}
            />
          </div>

          <div>
            <label className="block text-black font-bold mb-2">{dictionary.form.message}</label>
            <textarea
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              placeholder={dictionary.form.message}
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {submitText}
          </button>
        </form>
      </div>
    </div>
  );
}
