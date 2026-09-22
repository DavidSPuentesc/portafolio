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

interface StaggerTarget { parentElement: unknown; style: { setProperty(name: string, value: string): void } }
interface RevealEntry {
  isIntersecting: boolean;
  intersectionRatio: number;
  boundingClientRect: { height: number; bottom: number };
  rootBounds: { height: number; top: number } | null;
}

/** querySelectorAll already returns each element once, in document order, even when several selectors match it. */
export function collectRevealTargets(root: ParentNode): Element[] {
  return Array.from(root.querySelectorAll(REVEAL_SELECTOR));
}

/** Writes `--i` (index among revealed siblings, capped) so CSS can stagger the entrance. Returns the indices for tests. */
export function assignStagger(elements: StaggerTarget[], cap = STAGGER_CAP): number[] {
  const perParent = new Map<unknown, number>();
  return elements.map((element) => {
    const index = perParent.get(element.parentElement) ?? 0;
    perParent.set(element.parentElement, index + 1);
    const capped = Math.min(index, cap);
    element.style.setProperty('--i', String(capped));
    return capped;
  });
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

export function initReveal(root: ParentNode = document): void {
  const targets = collectRevealTargets(root);
  if (!targets.length) return;
  assignStagger(targets as unknown as StaggerTarget[]);
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;
  const pending = targets.filter((element) => needsReveal(element.getBoundingClientRect().top, innerHeight));
  if (!pending.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!shouldReveal(entry)) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { threshold: [0, THRESHOLD], rootMargin: '0px 0px -10% 0px' },
  );
  for (const element of pending) {
    element.classList.add('reveal');
    observer.observe(element);
  }
}
