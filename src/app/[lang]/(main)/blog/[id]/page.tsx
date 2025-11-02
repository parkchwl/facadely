import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n/config';
import BlogPostDetailClient from '../BlogPostDetailClient';

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ lang: Locale; id: string }>
}) {
  const { lang, id } = await params;
  const dictionary = await getDictionary(lang);

  return <BlogPostDetailClient dictionary={dictionary.blogPage} postId={parseInt(id)} />;
}
