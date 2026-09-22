import { lacksHover, lerp, prefersReducedMotion } from './motion';

const MAX_OFFSET = 240;
const POINTER_EASE = 0.08;
const SPOTLIGHT_SELECTOR = '.project-card, .solution-card, .audience-grid > a, .skills-grid article, .agent-workflow article, .credential-grid article';

export function parallaxOffset(scrollY: number, speed: number, max = MAX_OFFSET): number {
  return Math.max(-max, Math.min(max, scrollY * speed));
}

/** Viewport coordinate -> [-1, 1] with 0 at the centre. */
export function pointerToUnit(coordinate: number, size: number): number {
  return Math.max(-1, Math.min(1, (coordinate / size - 0.5) * 2));
}

/** Scroll parallax for `[data-parallax][data-speed]` plus cursor drift (`--px/--py`) on the hero; CSS composes both. */
export function initParallax(): void {
  if (prefersReducedMotion() || lacksHover()) return;
  const layers = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]')).map((element) => ({
    element,
    speed: Number(element.dataset.speed ?? 0.25),
  }));
  const hero = document.querySelector<HTMLElement>('.space-hero');
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0, scheduled = false;

  const frame = () => {
    scheduled = false;
    for (const { element, speed } of layers) element.style.setProperty('--sy', `${parallaxOffset(scrollY, speed)}px`);
    if (!hero) return;
    currentX = lerp(currentX, targetX, POINTER_EASE);
    currentY = lerp(currentY, targetY, POINTER_EASE);
    hero.style.setProperty('--px', currentX.toFixed(3));
    hero.style.setProperty('--py', currentY.toFixed(3));
    if (Math.abs(currentX - targetX) + Math.abs(currentY - targetY) > 0.002) schedule();
  };
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(frame);
  };

  if (layers.length) addEventListener('scroll', schedule, { passive: true });
  if (hero) {
    addEventListener('pointermove', (event) => {
      targetX = pointerToUnit(event.clientX, innerWidth);
      targetY = pointerToUnit(event.clientY, innerHeight);
      schedule();
    }, { passive: true });
  }
  schedule();
  initSpotlight();
}

/** One delegated listener moves the `--mx/--my` highlight on whichever card the cursor is over. */
function initSpotlight(): void {
  let pending: { card: HTMLElement; x: number; y: number } | null = null;
  const paint = () => {
    if (!pending) return;
    const { card, x, y } = pending;
    pending = null;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${x - rect.left}px`);
    card.style.setProperty('--my', `${y - rect.top}px`);
  };
  document.addEventListener('pointermove', (event) => {
    const card = (event.target as Element | null)?.closest?.<HTMLElement>(SPOTLIGHT_SELECTOR);
    if (!card) return;
    if (!pending) requestAnimationFrame(paint);
    pending = { card, x: event.clientX, y: event.clientY };
  }, { passive: true });
}
