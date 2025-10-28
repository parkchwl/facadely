import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n/config';

export default async function AboutPage({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold text-black mb-6">{dictionary.aboutPage.title}</h1>
        <p className="text-2xl text-gray-600 mb-16">{dictionary.aboutPage.subtitle}</p>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-4">{dictionary.aboutPage.mission.heading}</h2>
          <p className="text-lg text-gray-700">{dictionary.aboutPage.mission.content}</p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-4">{dictionary.aboutPage.vision.heading}</h2>
          <p className="text-lg text-gray-700">{dictionary.aboutPage.vision.content}</p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-black mb-6">{dictionary.aboutPage.values.heading}</h2>
          <ul className="space-y-4">
            {dictionary.aboutPage.values.items.map((value, idx) => (
              <li key={idx} className="text-lg text-gray-700">• {value}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
