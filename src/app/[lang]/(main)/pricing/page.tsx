import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n/config';
import PricingPageClient from '@/app/components/shared/PricingPageClient';

export default async function PricingPage({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return <PricingPageClient dictionary={dictionary.pricingPage} />;
}
