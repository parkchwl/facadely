import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n/config';
import StatusPageClient from '@/app/components/shared/StatusPageClient';

export default async function StatusPage({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <StatusPageClient dictionary={dictionary.statusPage} />
  );
}
