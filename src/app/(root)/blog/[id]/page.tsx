import { getDictionary } from '@/lib/get-dictionary';
import { i18n } from '@/i18n/config';
import BlogPostDetailClient from '../BlogPostDetailClient';

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const lang = i18n.defaultLocale;
  const dictionary = await getDictionary(lang);

  return <BlogPostDetailClient dictionary={dictionary.blogPage} postId={parseInt(id)} />;
}
