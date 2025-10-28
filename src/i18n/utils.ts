import { Locale } from './config';

export const languageNames: Record<Locale, { country: string; language: string }> = {
  en: { country: 'Global English', language: 'English' },
  vi: { country: 'Việt Nam', language: 'Tiếng Việt' },
  hi: { country: 'India', language: 'हिंदी' },
  id: { country: 'Indonesia', language: 'Bahasa Indonesia' },
  'zh-TW': { country: '台灣', language: '繁體中文' },
  ko: { country: '대한민국', language: '한국어' },
};
