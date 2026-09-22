import { easeOutExpo, prefersReducedMotion } from './motion';

export interface ParsedMetric {
  prefix: string;
  value: number;
  decimals: number;
  suffix: string;
  decimalSeparator: '.' | ',';
}

/**
 * Splits a metric label such as "1,5M+" or "688 m" into prefix / number / suffix.
 * Returns null when there is nothing to count so the caller leaves the text alone.
 * ponytail: a separator followed by 3+ digits ("1,500") is ambiguous (thousands vs decimals) and is not animated.
 */
export function parseMetric(text: string): ParsedMetric | null {
  const match = /^(\D*?)(\d[\d.,]*)(.*)$/s.exec(text.trim());
  if (!match) return null;
  const [, prefix, number, suffix] = match;
  const parts = /^(\d+)(?:([.,])(\d{1,2}))?$/.exec(number);
  if (!parts) return null;
  const [, integer, separator, fraction] = parts;
  return {
    prefix,
    value: Number(fraction ? `${integer}.${fraction}` : integer),
    decimals: fraction?.length ?? 0,
    suffix,
    decimalSeparator: separator === ',' ? ',' : '.',
  };
}

export function formatMetric({ prefix, decimals, suffix, decimalSeparator }: ParsedMetric, current: number): string {
  return prefix + current.toFixed(decimals).replace('.', decimalSeparator) + suffix;
}

const DURATION = 1400;

function countUp(element: HTMLElement): void {
  const original = element.textContent ?? '';
  const parsed = parseMetric(original);
  if (!parsed) return;
  const start = performance.now();
  const tick = (now: number) => {
    const progress = Math.min(1, (now - start) / DURATION);
    element.textContent = progress < 1 ? formatMetric(parsed, parsed.value * easeOutExpo(progress)) : original;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/** Animates every metric figure the first time it scrolls into view. */
export function initCounters(root: ParentNode = document): void {
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        countUp(entry.target as HTMLElement);
      }
    },
    { threshold: 0.15 },
  );
  for (const element of root.querySelectorAll<HTMLElement>('.metric-strip strong')) {
    if (parseMetric(element.textContent ?? '')) observer.observe(element);
  }
}
