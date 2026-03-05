import { redirect } from 'next/navigation';
import { Locale } from '@/i18n/config';

export default async function GeneratePage({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  await params;
  redirect(process.env.NEXT_PUBLIC_BETA_EDITOR_URL?.trim() || '/editor');
}
