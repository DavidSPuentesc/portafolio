import { existsSync, readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

it('publishes the Astro build directory with Firebase Hosting security headers', () => {
  expect(existsSync('firebase.json')).toBe(true);
  const config = JSON.parse(readFileSync('firebase.json', 'utf8'));
  expect(config.hosting.public).toBe('dist');
  expect(config.hosting.headers[0].headers).toEqual(expect.arrayContaining([
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  ]));
});
