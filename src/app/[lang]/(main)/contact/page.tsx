import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n/config';
import ContactPageClient from '@/app/components/shared/ContactPageClient';

export default async function ContactPage({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <ContactPageClient dictionary={dictionary.contactPage} />;
}
