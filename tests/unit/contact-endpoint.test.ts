import { describe, expect, it } from 'vitest';
import { resolveContactEndpoint } from '../../src/lib/contact-endpoint';

describe('contact endpoint', () => {
  it('accepts only a secure Formspree form endpoint', () => {
    expect(resolveContactEndpoint('https://formspree.io/f/abcde123')).toBe('https://formspree.io/f/abcde123');
  });

  it.each([
    undefined,
    '',
    'http://formspree.io/f/abcde123',
    'https://example.com/f/abcde123',
    'https://formspree.io/not-a-form/abcde123',
  ])('disables remote submission for an unsafe or missing endpoint: %s', (endpoint) => {
    expect(resolveContactEndpoint(endpoint)).toBeNull();
  });
});
