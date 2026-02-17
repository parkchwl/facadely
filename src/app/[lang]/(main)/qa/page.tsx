import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n/config';
import QAPageClient from '@/app/components/shared/QAPageClient';

export default async function QAPage({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return <QAPageClient dictionary={dictionary.qaPage} />;
}
