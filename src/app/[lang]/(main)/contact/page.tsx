import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n/config';

export default async function ContactPage({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold text-black mb-4">{dictionary.contactPage.title}</h1>
        <p className="text-xl text-gray-600 mb-12">{dictionary.contactPage.subtitle}</p>

        <form className="space-y-6">
          <div>
            <label className="block text-black font-bold mb-2">{dictionary.contactPage.form.name}</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              placeholder={dictionary.contactPage.form.name}
            />
          </div>

          <div>
            <label className="block text-black font-bold mb-2">{dictionary.contactPage.form.email}</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              placeholder={dictionary.contactPage.form.email}
            />
          </div>

          <div>
            <label className="block text-black font-bold mb-2">{dictionary.contactPage.form.subject}</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              placeholder={dictionary.contactPage.form.subject}
            />
          </div>

          <div>
            <label className="block text-black font-bold mb-2">{dictionary.contactPage.form.message}</label>
            <textarea
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              placeholder={dictionary.contactPage.form.message}
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {dictionary.contactPage.form.send}
          </button>
        </form>
      </div>
    </div>
  );
}
