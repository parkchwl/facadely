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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <BlogPostDetailClient dictionary={(dictionary as any).blogPage} postId={parseInt(id)} />;
}
