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
    <div className="min-h-screen bg-black flex items-center justify-center py-20 px-6">
      <div className="text-center">
        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Facadely Generate: launching soon.</p>
      </div>
    </div>
  );
}
