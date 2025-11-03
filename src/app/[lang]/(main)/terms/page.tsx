import { Locale } from '@/i18n/config';
import TermsPageClient from '@/app/components/shared/TermsPageClient';

export default async function TermsPage({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  await params;
  return <TermsPageClient />;
}
