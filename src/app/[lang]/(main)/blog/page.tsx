import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n/config';
import BlogListClient from '@/app/components/shared/BlogListClient';

export default async function BlogPage({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <BlogListClient dictionary={dictionary.blogPage} />;
}
