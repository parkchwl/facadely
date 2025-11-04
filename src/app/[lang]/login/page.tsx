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

  const pageDictionary = {
    ...dictionary.loginPage,
    termsModal: dictionary.termsModal
  };

  return <LoginPageClient dictionary={pageDictionary} />;
}
