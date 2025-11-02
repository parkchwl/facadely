import { getDictionary } from '@/lib/get-dictionary';
import { i18n } from '@/i18n/config';
import QAPageClient from './QAPageClient';

export default async function Page() {
  const lang = i18n.defaultLocale;
  const dictionary = await getDictionary(lang);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <QAPageClient dictionary={dictionary.qaPage as any} />;
}
