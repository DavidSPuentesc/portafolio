import { describe, expect, it } from 'vitest';
import { REVEAL_SELECTOR, assignStagger, collectRevealTargets, needsReveal, shouldReveal } from '../../src/lib/reveal';

const fake = (parentElement: object) => {
  const vars: Record<string, string> = {};
  return { parentElement, vars, style: { setProperty: (k: string, v: string) => void (vars[k] = v) } };
};

describe('collectRevealTargets', () => {
  it('queries the generic selector list once and returns a plain array', () => {
    const seen: string[] = [];
    const a = {}, b = {};
    const root = { querySelectorAll: (s: string) => { seen.push(s); return [a, b]; } };
    expect(collectRevealTargets(root as never)).toEqual([a, b]);
    expect(seen).toEqual([REVEAL_SELECTOR]);
  });
  it('covers the shared class vocabulary used by every page', () => {
    for (const s of ['.section > h2', '.metric-strip > div', '.audience-grid > a', '.project-card', '.solution-card', '.timeline article', '.commercial-process li', '.architecture li', '.tech-list li', '.contact-form'])
      expect(REVEAL_SELECTOR).toContain(s);
  });
});

describe('assignStagger', () => {
  it('numbers siblings from 0 per parent, restarting for each parent', () => {
    const p1 = {}, p2 = {};
    const els = [fake(p1), fake(p1), fake(p2), fake(p1), fake(p2)];
    expect(assignStagger(els)).toEqual([0, 1, 0, 2, 1]);
    expect(els.map((e) => e.vars['--i'])).toEqual(['0', '1', '0', '2', '1']);
  });
  it('caps the index so long lists do not wait forever', () => {
    const p = {};
    const els = Array.from({ length: 12 }, () => fake(p));
    expect(assignStagger(els, 6).at(-1)).toBe(6);
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
