import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n/config';
import LoginPageClient from './LoginPageClient';

// Note: For this page to be properly localized, it should be moved to 'src/app/[locale]/login/page.tsx'
// For now, it will render with the default language.

export default async function LoginPage({ params }: { params?: Promise<{ lang: Locale }> }) {
  const lang = params ? (await params).lang : 'en'; // Default to 'en' if no lang param
  const dictionary = await getDictionary(lang);
  
  const pageDictionary = {
    ...dictionary.loginPage,
    termsModal: dictionary.termsModal
  }

  return <LoginPageClient dictionary={pageDictionary} />;
}