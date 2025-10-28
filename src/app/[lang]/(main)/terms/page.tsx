import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n/config';
import TermsPageClient from './TermsPageClient';

export default async function TermsPage({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return <TermsPageClient />;
}
