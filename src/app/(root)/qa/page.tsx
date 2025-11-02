import { getDictionary } from '@/lib/get-dictionary';
import { i18n } from '@/i18n/config';
import QAPageClient from './QAPageClient';

export default async function Page() {
  const lang = i18n.defaultLocale;
  const dictionary = await getDictionary(lang);
  return <QAPageClient dictionary={dictionary.qaPage as any} />;
}
