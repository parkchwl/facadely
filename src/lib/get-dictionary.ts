import 'server-only';
import type { Locale } from '@/i18n/config';

const dictionaries = {
  en: () => import('@/i18n/messages/en.json').then((module) => module.default),
  ko: () => import('@/i18n/messages/ko.json').then((module) => module.default),
  hi: () => import('@/i18n/messages/hi.json').then((module) => module.default),
  id: () => import('@/i18n/messages/id.json').then((module) => module.default),
  vi: () => import('@/i18n/messages/vi.json').then((module) => module.default),
  'zh-TW': () => import('@/i18n/messages/zh-TW.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
