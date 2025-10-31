import HomePage from '../pages/HomePage';
import { getDictionary } from '@/lib/get-dictionary';
import { i18n } from '@/i18n/config';

export default async function Home() {
  // Always use English for root pages
  const lang = i18n.defaultLocale;
  const dictionary = await getDictionary(lang);
  return <HomePage dictionary={dictionary.homePage} lang={lang} />;
}
