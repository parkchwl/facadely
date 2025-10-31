import { getDictionary } from '@/lib/get-dictionary';
import { i18n } from '@/i18n/config';
import AboutPageContent from '@/app/components/pages/AboutPageContent';

export default async function AboutPage() {
  const lang = i18n.defaultLocale;
  const dictionary = await getDictionary(lang);

  return <AboutPageContent dictionary={dictionary.aboutPage} />;
}
