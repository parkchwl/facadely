import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n/config';
import CustomerServicePageClient from '@/app/components/shared/CustomerServicePageClient';

export default async function CustomerServicePage({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <CustomerServicePageClient dictionary={dictionary.customerServicePage} />
  );
}
