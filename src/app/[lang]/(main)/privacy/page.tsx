import { Locale } from '@/i18n/config';
import PrivacyPageClient from '@/app/components/shared/PrivacyPageClient';

export default async function PrivacyPage({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  await params;
  return <PrivacyPageClient />;
}
