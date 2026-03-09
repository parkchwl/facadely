import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n/config';
import LoginPageClient from '@/app/components/LoginPageClient';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/server/api-security';
import { resolvePostLoginPath } from '@/lib/auth-redirect';

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const { lang } = await params;
  const resolvedSearchParams = await searchParams;
  const requestHeaders = await headers();
  const authenticatedUser = await getAuthenticatedUser(requestHeaders.get('cookie') || '');
  const postLoginPath = resolvePostLoginPath(lang, resolvedSearchParams.next);

  if (authenticatedUser) {
    redirect(postLoginPath);
  }

  const dictionary = await getDictionary(lang);

  return <LoginPageClient dictionary={dictionary.loginPage} />;
}
