import { Locale } from '@/i18n/config';
import CookiePageClient from '@/app/components/shared/CookiePageClient';

export default async function CookiePage({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params;
  return <CookiePageClient />;
}
