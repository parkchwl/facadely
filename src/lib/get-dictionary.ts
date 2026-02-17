import 'server-only';
import { cache } from 'react';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/types/dictionary';

const dictionaries = {
  en: () => import('@/i18n/messages/en.json').then((module) => module.default as unknown as Dictionary),
  ko: () => import('@/i18n/messages/ko.json').then((module) => module.default as unknown as Partial<Dictionary>),
  hi: () => import('@/i18n/messages/hi.json').then((module) => module.default as unknown as Partial<Dictionary>),
  id: () => import('@/i18n/messages/id.json').then((module) => module.default as unknown as Partial<Dictionary>),
  vi: () => import('@/i18n/messages/vi.json').then((module) => module.default as unknown as Partial<Dictionary>),
  'zh-TW': () => import('@/i18n/messages/zh-TW.json').then((module) => module.default as unknown as Partial<Dictionary>),
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function mergeWithFallback<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) {
    return base;
  }

  if (Array.isArray(base) && Array.isArray(override)) {
    const maxLength = Math.max(base.length, override.length);
    const merged = Array.from({ length: maxLength }, (_, index) => {
      const baseItem = base[index];
      const overrideItem = override[index];

      if (overrideItem === undefined) {
        return baseItem;
      }

      if (baseItem === undefined) {
        return overrideItem;
      }

      return mergeWithFallback(baseItem, overrideItem);
    });

    return merged as T;
  }

  if (isObject(base) && isObject(override)) {
    const result: Record<string, unknown> = { ...base };

    for (const key of Object.keys(override)) {
      const baseValue = result[key];
      const overrideValue = override[key];

      if (baseValue === undefined) {
        result[key] = overrideValue;
        continue;
      }

      result[key] = mergeWithFallback(baseValue, overrideValue);
    }

    return result as T;
  }

  if (typeof base !== typeof override) {
    return base;
  }

  return override as T;
}

export const getDictionary = cache(async (locale: Locale): Promise<Dictionary> => {
  const english = await dictionaries.en();

  if (locale === 'en') {
    return english;
  }

  const localized = await dictionaries[locale]();
  return mergeWithFallback(english, localized);
});
