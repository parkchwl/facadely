import { i18n } from '@/i18n/config';
import CookiePageClient from './CookiePageClient';

export default async function Page() {
  const lang = i18n.defaultLocale;
  return <CookiePageClient />;
}
