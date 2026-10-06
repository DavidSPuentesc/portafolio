import { describe, expect, it } from 'vitest';
import { easeOutExpo, lerp, shouldAnimate } from '../../src/lib/motion';
describe('space animation policy',()=>{it.each([[true,'visible',false],[false,'hidden',false],[false,'visible',true]] as const)('reduced=%s visibility=%s => %s',(reduced,visibility,expected)=>expect(shouldAnimate(reduced,visibility)).toBe(expected));});

describe('easing helpers', () => {
  it('easeOutExpo starts at 0, ends exactly at 1 and decelerates', () => {
    expect(easeOutExpo(0)).toBe(0);
    expect(easeOutExpo(1)).toBe(1);
    expect(easeOutExpo(1.5)).toBe(1);
    expect(easeOutExpo(0.5)).toBeGreaterThan(0.9);
    expect(easeOutExpo(0.25)).toBeLessThan(easeOutExpo(0.5));
  });
  it('lerp interpolates linearly', () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(lerp(-1, 1, 0.25)).toBe(-0.5);
  });
});
