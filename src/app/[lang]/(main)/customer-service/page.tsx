import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n/config';

export default async function CustomerServicePage({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-black mb-4">{dictionary.customerServicePage.title}</h1>
        <p className="text-xl text-gray-600">{dictionary.customerServicePage.subtitle}</p>
      </div>
    </div>
  );
}
