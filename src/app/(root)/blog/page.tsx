import { getDictionary } from '@/lib/get-dictionary';
import { i18n } from '@/i18n/config';
import BlogListClient from './BlogListClient';

export default async function Page() {
  const lang = i18n.defaultLocale;
  const dictionary = await getDictionary(lang);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <BlogListClient dictionary={(dictionary as any).blogPage} />;
}
