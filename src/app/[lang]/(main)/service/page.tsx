import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n/config';
import ServicePageClient from '@/app/components/shared/ServicePageClient';

export default async function ServicePage({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return <ServicePageClient dictionary={dictionary.servicePage} />;
}
