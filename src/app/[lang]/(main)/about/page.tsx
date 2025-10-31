import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n/config';
import AboutPageContent from '@/app/components/pages/AboutPageContent';

export default async function AboutPage({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <AboutPageContent dictionary={dictionary.aboutPage} />;
}
