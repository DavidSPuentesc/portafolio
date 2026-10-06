export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];
export type LocalizedText = Record<Locale, string>;
export type LocalizedList = Record<Locale, string[]>;

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && locales.includes(value as Locale);
}

export function localizedPath(locale: Locale, path = '/'): string {
  const normalized = `/${path}`.replace(/\/+/g, '/').replace(/^\/(?:es|en)(?=\/)/, '');
  return `/${locale}${normalized === '/' ? '/' : normalized}`;
}
