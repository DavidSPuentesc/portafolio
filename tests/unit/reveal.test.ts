import { describe, expect, it } from 'vitest';
import { REVEAL_SELECTOR, batchStagger, needsReveal, shouldReveal } from '../../src/lib/reveal';

describe('REVEAL_SELECTOR', () => {
  it('covers the shared class vocabulary used by every page', () => {
    for (const s of ['.section > h2', '.metric-strip > div', '.audience-grid > a', '.project-card', '.solution-card', '.timeline article', '.commercial-process li', '.architecture li', '.tech-list li', '.contact-form'])
      expect(REVEAL_SELECTOR).toContain(s);
  });
});

describe('batchStagger', () => {
  it('numbers siblings revealed together from 0 per parent, in batch order', () => {
    const a = {}, b = {};
    expect(batchStagger([a, a, b, a, b])).toEqual([0, 1, 0, 2, 1]);
  });
  it('gives an element revealed on its own no delay', () => {
    expect(batchStagger([{}])).toEqual([0]);
  });
  it('caps the index so long lists do not wait forever', () => {
    const p = {};
    expect(batchStagger(Array.from({ length: 12 }, () => p), 6).at(-1)).toBe(6);
  });
});

describe('needsReveal', () => {
  it('leaves anything at or above the first viewport visible from the start', () => {
    expect(needsReveal(-200, 900)).toBe(false);
    expect(needsReveal(400, 900)).toBe(false);
    expect(needsReveal(899, 900)).toBe(false);
  });
  it('hides only what is below the fold', () => {
    expect(needsReveal(900, 900)).toBe(true);
    expect(needsReveal(2400, 900)).toBe(true);
  });
});

describe('shouldReveal', () => {
  const entry = (o: Partial<Parameters<typeof shouldReveal>[0]>) => ({ isIntersecting: false, intersectionRatio: 0, boundingClientRect: { height: 200, bottom: 500 }, rootBounds: { height: 810, top: 0 }, ...o });
  it('reveals once 15% of the element is inside the root', () => {
    expect(shouldReveal(entry({ isIntersecting: true, intersectionRatio: 0.15 }))).toBe(true);
    expect(shouldReveal(entry({ isIntersecting: true, intersectionRatio: 0.05 }))).toBe(false);
  });
  it('reveals elements taller than the root as soon as they intersect', () => {
    expect(shouldReveal(entry({ isIntersecting: true, intersectionRatio: 0.04, boundingClientRect: { height: 3000, bottom: 2900 } }))).toBe(true);
  });
  it('reveals elements already scrolled past (anchor jumps, restored scroll)', () => {
    expect(shouldReveal(entry({ boundingClientRect: { height: 200, bottom: -40 } }))).toBe(true);
    expect(shouldReveal(entry({ boundingClientRect: { height: 200, bottom: 1200 } }))).toBe(false);
  });
});
