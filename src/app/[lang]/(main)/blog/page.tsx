import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n/config';
import BlogListClient from './BlogListClient';

export default async function BlogPage({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <BlogListClient dictionary={(dictionary as any).blogPage} />;
}
