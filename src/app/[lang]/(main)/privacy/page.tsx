import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n/config';
import PrivacyPageClient from '@/app/components/shared/PrivacyPageClient';

export default async function PrivacyPage({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return <PrivacyPageClient />;
}
