import { prefersReducedMotion } from './motion';

/** Generic hooks shared by every page; new sections reuse this vocabulary instead of data attributes. */
export const REVEAL_SELECTOR = [
  '.section > .eyebrow', '.section > h1', '.section > h2', '.section > p', '.section > a.button',
  '.metric-strip > div', '.audience-grid > a', '.project-card', '.solution-card',
  '.agent-workflow article', '.skills-grid article', '.credential-grid article', '.timeline', '.timeline article',
  '.commercial-process li', '.case-study section', '.architecture li', '.tech-list li',
  '.section article', '.section .field-pair', '.contact-form',
].join(', ');

const THRESHOLD = 0.15;
const STAGGER_CAP = 8;

interface RevealEntry {
  isIntersecting: boolean;
  intersectionRatio: number;
  boundingClientRect: { height: number; bottom: number };
  rootBounds: { height: number; top: number } | null;
}

/** Only content below the first viewport is hidden, so nothing on screen ever flashes. */
export function needsReveal(top: number, viewportHeight: number): boolean {
  return top >= viewportHeight;
}

export function shouldReveal(entry: RevealEntry): boolean {
  if (!entry.isIntersecting) return !!entry.rootBounds && entry.boundingClientRect.bottom < entry.rootBounds.top;
  const tallerThanRoot = !!entry.rootBounds && entry.boundingClientRect.height > entry.rootBounds.height;
  return entry.intersectionRatio >= THRESHOLD || tallerThanRoot;
}

/** Stagger index per element revealed in the same batch: siblings (same parent) count up, capped; a lone element gets 0. */
export function batchStagger<T>(parents: T[], cap = STAGGER_CAP): number[] {
  const seen = new Map<T, number>();
  return parents.map((parent) => {
    const index = seen.get(parent) ?? 0;
    seen.set(parent, index + 1);
    return Math.min(index, cap);
  });
}

export function initReveal(root: ParentNode = document): void {
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;
  const pending = Array.from(root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)).filter((element) => needsReveal(element.getBoundingClientRect().top, innerHeight));
  if (!pending.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      const revealed = entries.filter(shouldReveal).map((entry) => entry.target as HTMLElement);
      const indices = batchStagger(revealed.map((element) => element.parentElement));
      revealed.forEach((element, i) => {
        element.style.setProperty('--i', String(indices[i] ?? 0));
        element.classList.add('is-visible');
        observer.unobserve(element);
      });
    },
    { threshold: [0, THRESHOLD], rootMargin: '0px 0px -10% 0px' },
  );
  for (const element of pending) {
    element.classList.add('reveal');
    observer.observe(element);
  }
}
