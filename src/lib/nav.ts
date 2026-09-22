const SCROLLED_AFTER = 24;

export function readingProgress(scrollY: number, scrollHeight: number, viewportHeight: number): number {
  const track = scrollHeight - viewportHeight;
  return track > 0 ? Math.max(0, Math.min(1, scrollY / track)) : 0;
}

/** Sticky header state (`is-scrolled`) and the 2px reading-progress bar, one rAF per scroll burst. */
export function initNav(): void {
  const header = document.querySelector('.site-header');
  const bar = document.querySelector<HTMLElement>('.scroll-progress');
  if (!header) return;
  let scheduled = false;
  const update = () => {
    scheduled = false;
    header.classList.toggle('is-scrolled', scrollY > SCROLLED_AFTER);
    if (bar) bar.style.transform = `scaleX(${readingProgress(scrollY, document.documentElement.scrollHeight, innerHeight).toFixed(4)})`;
  };
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  update();
}
