import { describe, expect, it } from 'vitest';
import { shouldAnimate } from '../../src/lib/motion';
describe('space animation policy',()=>{it.each([[true,'visible',false],[false,'hidden',false],[false,'visible',true]] as const)('reduced=%s visibility=%s => %s',(reduced,visibility,expected)=>expect(shouldAnimate(reduced,visibility)).toBe(expected));});
