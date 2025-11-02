import { getDictionary } from '@/lib/get-dictionary';
import { i18n } from '@/i18n/config';
import ServicePageClient from './ServicePageClient';

export default async function Page() {
  const lang = i18n.defaultLocale;
  const dictionary = await getDictionary(lang);
  return <ServicePageClient dictionary={dictionary.servicePage as any} />;
}
