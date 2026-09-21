import { describe, expect, it } from 'vitest';
import { isLocale, localizedPath } from '../../src/i18n/locales';

describe('locale helpers', () => {
  it('accepts only supported locales', () => {
    expect(isLocale('es')).toBe(true);
    expect(isLocale('en')).toBe(true);
    expect(isLocale('fr')).toBe(false);
  });

  it('preserves a detail path when switching locale', () => {
    expect(localizedPath('en', '/projects/smartsense/')).toBe('/en/projects/smartsense/');
  });
});
