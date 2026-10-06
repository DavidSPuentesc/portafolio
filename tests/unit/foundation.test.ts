import { describe, expect, it } from 'vitest';
import pkg from '../../package.json';

describe('project foundation', () => {
  it('exposes the required quality commands', () => {
    expect(pkg.scripts).toMatchObject({
      check: 'astro check',
      test: 'vitest run',
      'test:e2e': 'playwright test',
      build: 'astro build',
    });
  });
});
