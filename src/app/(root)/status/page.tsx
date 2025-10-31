import { getDictionary } from '@/lib/get-dictionary';
import { i18n } from '@/i18n/config';

export default async function Page() {
  const lang = i18n.defaultLocale;
  const dictionary = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-black mb-4">{dictionary.statusPage.title}</h1>
        <p className="text-xl text-gray-600">{dictionary.statusPage.subtitle}</p>
      </div>
    </div>
  );
}
