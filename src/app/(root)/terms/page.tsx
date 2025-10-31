import { getDictionary } from '@/lib/get-dictionary';
import { i18n } from '@/i18n/config';
import TermsPageClient from './TermsPageClient';

export default async function Page() {
  const lang = i18n.defaultLocale;
  const dictionary = await getDictionary(lang);
  return <TermsPageClient />;
}
