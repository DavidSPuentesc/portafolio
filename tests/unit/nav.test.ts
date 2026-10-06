import { describe, expect, it } from 'vitest';
import { readingProgress } from '../../src/lib/nav';

describe('readingProgress', () => {
  it('goes from 0 at the top to 1 at the bottom', () => {
    expect(readingProgress(0, 3000, 900)).toBe(0);
    expect(readingProgress(1050, 3000, 900)).toBe(0.5);
    expect(readingProgress(2100, 3000, 900)).toBe(1);
  });
  it('clamps overscroll and short pages', () => {
    expect(readingProgress(5000, 3000, 900)).toBe(1);
    expect(readingProgress(-10, 3000, 900)).toBe(0);
    expect(readingProgress(0, 800, 900)).toBe(0);
  });
});
