import HomePage from '../../pages/HomePage';
import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n/config';

export default async function Home({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return <HomePage dictionary={dictionary.homePage} lang={lang} />;
}
