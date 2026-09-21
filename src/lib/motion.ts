export function shouldAnimate(reducedMotion: boolean, visibilityState: DocumentVisibilityState): boolean { return !reducedMotion && visibilityState === 'visible'; }
