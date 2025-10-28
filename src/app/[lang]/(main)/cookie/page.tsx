import { Locale } from '@/i18n/config';
import CookiePageClient from './CookiePageClient';

export default async function CookiePage({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params;
  return <CookiePageClient />;
}
