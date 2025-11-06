import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n/config';

export default async function GeneratePage({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-20 px-6">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-black mb-4">{dictionary.generatePage.title}</h1>
        <p className="text-xl text-gray-600">{dictionary.generatePage.subtitle}</p>
        <p className="text-lg text-gray-500 mt-8">Coming soon...</p>
      </div>
    </div>
  );
}
