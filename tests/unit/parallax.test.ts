import { describe, expect, it } from 'vitest';
import { parallaxOffset, pointerToUnit } from '../../src/lib/parallax';

describe('parallaxOffset', () => {
  it('scales the scroll position by the layer speed', () => {
    expect(parallaxOffset(0, 0.3)).toBe(0);
    expect(parallaxOffset(100, 0.3)).toBe(30);
    expect(parallaxOffset(100, -0.2)).toBe(-20);
  });
  it('clamps the offset so far-away layers never fly off', () => {
    expect(parallaxOffset(100000, 0.3)).toBe(240);
    expect(parallaxOffset(100000, -0.3)).toBe(-240);
    expect(parallaxOffset(1000, 0.3, 100)).toBe(100);
  });
});

describe('pointerToUnit', () => {
  it('maps a viewport coordinate to [-1, 1] around the centre', () => {
    expect(pointerToUnit(0, 1000)).toBe(-1);
    expect(pointerToUnit(500, 1000)).toBe(0);
    expect(pointerToUnit(1000, 1000)).toBe(1);
  });
  it('clamps values outside the viewport', () => {
    expect(pointerToUnit(-50, 1000)).toBe(-1);
    expect(pointerToUnit(2000, 1000)).toBe(1);
  });
});
