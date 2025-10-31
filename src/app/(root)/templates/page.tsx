import { getDictionary } from '@/lib/get-dictionary';
import { i18n } from '@/i18n/config';
import TemplatesPageClient from './TemplatesPageClient';

// In a real application, you would fetch the templates from a database here.
// For this example, we pass them as a prop to the client component.

export default async function Page() {
  const lang = i18n.defaultLocale;
  const dictionary = await getDictionary(lang);
  return <TemplatesPageClient dictionary={dictionary.templatesPage} />;
}