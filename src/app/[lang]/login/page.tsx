import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n/config';
import LoginPageClient from '@/app/components/LoginPageClient';

export default async function LoginPage({
  params
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <LoginPageClient dictionary={dictionary.loginPage} />;
}
