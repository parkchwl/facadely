import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n/config';
import TemplatesPageClient from '@/app/components/shared/TemplatesPageClient';

// In a real application, you would fetch the templates from a database here.
// For this example, we pass them as a prop to the client component.

export default async function TemplatesPage({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return <TemplatesPageClient dictionary={dictionary.templatesPage} />;
}