import { describe, expect, it } from 'vitest';
import { formatMetric, parseMetric } from '../../src/lib/counter';

describe('parseMetric', () => {
  it.each([
    ['7', { prefix: '', value: 7, decimals: 0, suffix: '', decimalSeparator: '.' }],
    ['987', { prefix: '', value: 987, decimals: 0, suffix: '', decimalSeparator: '.' }],
    ['1,5M+', { prefix: '', value: 1.5, decimals: 1, suffix: 'M+', decimalSeparator: ',' }],
    ['1.5M+', { prefix: '', value: 1.5, decimals: 1, suffix: 'M+', decimalSeparator: '.' }],
    ['51K+', { prefix: '', value: 51, decimals: 0, suffix: 'K+', decimalSeparator: '.' }],
    ['688 m', { prefix: '', value: 688, decimals: 0, suffix: ' m', decimalSeparator: '.' }],
    ['+12,75 %', { prefix: '+', value: 12.75, decimals: 2, suffix: ' %', decimalSeparator: ',' }],
    ['  47  ', { prefix: '', value: 47, decimals: 0, suffix: '', decimalSeparator: '.' }],
  ])('parses %j', (text, expected) => expect(parseMetric(text)).toEqual(expected));

  it.each([['Sin número'], [''], ['N/A'], ['1,500'], ['1.234.567']])('returns null for %j so it is not animated', (text) =>
    expect(parseMetric(text)).toBeNull(),
  );
});

describe('formatMetric', () => {
  it('keeps prefix, suffix and the locale decimal separator', () => {
    const parsed = parseMetric('1,5M+')!;
    expect(formatMetric(parsed, 0)).toBe('0,0M+');
    expect(formatMetric(parsed, 0.87)).toBe('0,9M+');
    expect(formatMetric(parsed, parsed.value)).toBe('1,5M+');
  });
  it('rounds integers without decimals', () => {
    const parsed = parseMetric('688 m')!;
    expect(formatMetric(parsed, 123.6)).toBe('124 m');
    expect(formatMetric(parsed, parsed.value)).toBe('688 m');
  });
  it('round-trips every sample metric', () => {
    for (const text of ['7', '1,5M+', '1.5M+', '51K+', '688 m']) {
      const parsed = parseMetric(text)!;
      expect(formatMetric(parsed, parsed.value)).toBe(text);
    }
  });
});
