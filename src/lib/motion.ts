export function shouldAnimate(reducedMotion: boolean, visibilityState: DocumentVisibilityState): boolean { return !reducedMotion && visibilityState === 'visible'; }

export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
export const NO_HOVER = '(hover: none)';

/** True when the browser asks for less motion (or cannot tell us, e.g. no matchMedia). */
export const prefersReducedMotion = (): boolean => typeof matchMedia !== 'function' || matchMedia(REDUCED_MOTION).matches;

/** Touch / coarse pointer: cursor-driven effects would only cost battery there. */
export const lacksHover = (): boolean => typeof matchMedia !== 'function' || matchMedia(NO_HOVER).matches;

export const easeOutExpo = (t: number): number => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

export const lerp = (from: number, to: number, amount: number): number => from + (to - from) * amount;
