import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n/config';
import QAPageClient from './QAPageClient';

export default async function QAPage({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <QAPageClient dictionary={dictionary.qaPage as any} />;
}
