import { useEffect, useRef, useState } from 'react';
import { NO_HOVER, REDUCED_MOTION, lerp, shouldAnimate } from '../../lib/motion';
import { pointerToUnit } from '../../lib/parallax';

interface Star { x: number; y: number; r: number; a: number; twinkle: number }
interface Layer { depth: number; stars: Star[] }
interface Meteor { x: number; y: number; vx: number; vy: number; life: number }

const TWO_PI = Math.PI * 2;
const MOBILE_WIDTH = 720;
const TILT = -0.42; // orbit inclination, radians
const SQUASH = 0.36; // ellipse minor/major ratio
const METEOR_LIFE = 900;
const SCROLL_DEPTH = 0.03; // px of star travel per px scrolled, per unit of layer depth
const LAYER_SPECS = [
  { depth: 4, count: 120, radius: [0.35, 0.8], alpha: [0.25, 0.55], twinkle: 0 },
  { depth: 10, count: 55, radius: [0.8, 1.3], alpha: [0.45, 0.85], twinkle: 0.3 },
  { depth: 22, count: 20, radius: [1.3, 2.1], alpha: [0.75, 1], twinkle: 0.6 },
] as const;
// Nebula clouds live in page space (y in viewport heights) and recur every NEBULA_PERIOD viewports as the visitor scrolls,
// so no part of a long page is ever plain black. `speed` is their scroll parallax (1 = pinned to the content).
const NEBULA_PERIOD = 2.6;
const NEBULA_BLOBS = [
  { x: 0.78, y: 0.36, r: 0.42, color: '#2b64d6', alpha: 0.45, speed: 0.35, wobble: 0.00006 },
  { x: 0.6, y: 0.62, r: 0.34, color: '#7c3aed', alpha: 0.32, speed: 0.3, wobble: 0.00004 },
  { x: 0.92, y: 0.18, r: 0.22, color: '#38c6f2', alpha: 0.26, speed: 0.4, wobble: 0.00005 },
  { x: 0.12, y: 1.55, r: 0.38, color: '#6d3fe0', alpha: 0.22, speed: 0.22, wobble: 0.00005 },
  { x: 0.82, y: 2.1, r: 0.32, color: '#1f7fd6', alpha: 0.2, speed: 0.26, wobble: 0.00007 },
] as const;

// ponytail: tiny LCG so every mount draws the same sky (stable screenshots); Math.random would do too.
function makeRandom(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function makeLayers(scale: number): Layer[] {
  const random = makeRandom(7);
  const between = ([min, max]: readonly [number, number]) => min + random() * (max - min);
  return LAYER_SPECS.map(({ depth, count, radius, alpha, twinkle }) => ({
    depth,
    stars: Array.from({ length: Math.round(count * scale) }, () => ({
      x: random(), y: random(), r: between(radius), a: between(alpha), twinkle: random() < twinkle ? 0.8 + random() * 1.6 : 0,
    })),
  }));
}

function orbitPoint(cx: number, cy: number, r: number, angle: number): [number, number] {
  const ex = Math.cos(angle) * r, ey = Math.sin(angle) * r * SQUASH;
  return [cx + ex * Math.cos(TILT) - ey * Math.sin(TILT), cy + ex * Math.sin(TILT) + ey * Math.cos(TILT)];
}

const wrap = (value: number, period: number) => ((value % period) + period) % period;

/** Fixed, full-viewport sky behind every page: layered stars with scroll and cursor parallax, drifting nebula,
 *  the binary system anchored to the hero (when the page has one) and an occasional meteor. */
export default function SpaceCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    const nebula = document.createElement('canvas');
    const nctx = nebula.getContext('2d');
    if (!canvas || !ctx || !nctx) return;

    const reduced = matchMedia(REDUCED_MOTION);
    const random = makeRandom(11);
    let frame = 0, last = 0;
    let width = 0, height = 0, mobile = false, layers: Layer[] = [];
    let targetX = 0, targetY = 0, pointerX = 0, pointerY = 0, scroll = 0;
    let heroTop = -1, heroHeight = 0;
    let meteor: Meteor | null = null, nextMeteorAt = 6000;

    // ponytail: the nebula is painted at 1/8 scale and upscaled; the blur is free and 5 full-size gradients per frame are not.
    const drawNebula = (time: number) => {
      const w = nebula.width, h = nebula.height;
      const period = h * NEBULA_PERIOD;
      nctx.clearRect(0, 0, w, h);
      nctx.globalCompositeOperation = 'lighter';
      for (const blob of NEBULA_BLOBS) {
        const x = (blob.x + 0.015 * Math.sin(time * blob.wobble)) * w;
        const radius = blob.r * w;
        // Wrap in page space with a margin of one radius so a cloud never pops in or out at the viewport edge.
        const y = wrap(blob.y * h - (scroll / 8) * blob.speed + 0.02 * h * Math.cos(time * blob.wobble * 1.3) + radius, period + radius * 2) - radius;
        if (y + radius < 0 || y - radius > h) continue;
        const gradient = nctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(1, 'transparent');
        nctx.globalAlpha = mobile ? blob.alpha * 0.8 : blob.alpha;
        nctx.fillStyle = gradient;
        nctx.fillRect(0, 0, w, h);
      }
      nctx.globalAlpha = 1;
      const pad = 24;
      ctx.drawImage(nebula, -pad + pointerX * 6, -pad + pointerY * 6, width + pad * 2, height + pad * 2);
    };

    const drawStars = (time: number) => {
      for (const { depth, stars } of layers) {
        const ox = pointerX * depth, oy = pointerY * depth - scroll * depth * SCROLL_DEPTH;
        const glow = depth === 22;
        if (glow) { ctx.shadowBlur = 6; ctx.shadowColor = 'rgba(160,220,255,0.8)'; }
        for (const star of stars) {
          const alpha = star.twinkle ? star.a * (0.6 + 0.4 * Math.sin(time * 0.001 * star.twinkle + star.x * 50)) : star.a;
          const x = wrap(star.x * width + ox, width);
          const y = wrap(star.y * height + oy, height);
          ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
          if (star.r < 1) { ctx.fillRect(x, y, 1, 1); continue; }
          ctx.beginPath();
          ctx.arc(x, y, star.r, 0, TWO_PI);
          ctx.fill();
        }
        if (glow) ctx.shadowBlur = 0;
      }
    };

    const drawBinary = (time: number) => {
      if (heroTop < 0) return; // pages without a hero keep only stars and nebula
      // On phones the title spans the full width, so the system sits in the top-right corner instead of mid-height.
      const cx = width * 0.8 + pointerX * 14, cy = heroTop + heroHeight * (mobile ? 0.08 : 0.4) - scroll + pointerY * 14;
      const major = Math.min(width, heroHeight) * (mobile ? 0.14 : 0.13);
      if (cy + major * 1.2 < 0 || cy - major * 1.2 > height) return;
      const angle = time * 0.00022;
      const bodies = [
        { r: major * 0.45, angle, size: mobile ? 11 : 15, color: '#8fe9ff', glow: '#65defe', core: '#ffffff' },
        { r: major * 0.85, angle: angle + Math.PI, size: mobile ? 6 : 8, color: '#ffd59a', glow: '#ffae42', core: '#fff4dc' },
      ];
      for (const body of bodies) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(160,215,255,0.10)';
        ctx.beginPath();
        ctx.ellipse(cx, cy, body.r, body.r * SQUASH, TILT, 0, TWO_PI);
        ctx.stroke();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = `${body.glow}55`;
        ctx.beginPath();
        ctx.ellipse(cx, cy, body.r, body.r * SQUASH, TILT, body.angle - 1.1, body.angle);
        ctx.stroke();
      }
      for (const body of bodies.sort((p, q) => Math.sin(p.angle) - Math.sin(q.angle))) {
        const [x, y] = orbitPoint(cx, cy, body.r, body.angle);
        const halo = ctx.createRadialGradient(x, y, 0, x, y, body.size * 4);
        halo.addColorStop(0, `${body.glow}55`);
        halo.addColorStop(1, 'transparent');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(x, y, body.size * 4, 0, TWO_PI);
        ctx.fill();
        ctx.shadowColor = body.glow;
        ctx.shadowBlur = body.size * 2;
        ctx.fillStyle = body.color;
        ctx.beginPath();
        ctx.arc(x, y, body.size, 0, TWO_PI);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = body.core;
        ctx.beginPath();
        ctx.arc(x - body.size * 0.2, y - body.size * 0.2, body.size * 0.45, 0, TWO_PI);
        ctx.fill();
      }
    };

    const drawMeteor = (time: number, dt: number) => {
      if (mobile) return;
      if (!meteor && time > nextMeteorAt) {
        meteor = { x: width * (0.25 + random() * 0.6), y: height * random() * 0.6, vx: -(0.45 + random() * 0.25), vy: 0.18 + random() * 0.12, life: 0 };
        nextMeteorAt = time + 8000 + random() * 7000;
      }
      if (!meteor) return;
      meteor.life += dt;
      meteor.x += meteor.vx * dt;
      meteor.y += meteor.vy * dt;
      const alpha = Math.sin(Math.PI * Math.min(1, meteor.life / METEOR_LIFE));
      const tailX = meteor.x - meteor.vx * 220, tailY = meteor.y - meteor.vy * 220;
      const gradient = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
      gradient.addColorStop(0, `rgba(255,255,255,${(0.9 * alpha).toFixed(3)})`);
      gradient.addColorStop(1, 'transparent');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(meteor.x, meteor.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();
      if (meteor.life >= METEOR_LIFE) meteor = null;
    };

    const render = (time: number, dt = 0) => {
      scroll = scrollY;
      ctx.clearRect(0, 0, width, height);
      drawNebula(time);
      drawStars(time);
      drawBinary(time);
      drawMeteor(time, dt);
    };

    const loop = (time: number) => {
      const dt = last ? Math.min(50, time - last) : 16;
      last = time;
      pointerX = lerp(pointerX, targetX, 0.05);
      pointerY = lerp(pointerY, targetY, 0.05);
      render(time, dt);
      frame = requestAnimationFrame(loop);
    };

    const update = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      const active = shouldAnimate(reduced.matches, document.visibilityState);
      setRunning(active);
      if (active) {
        last = 0;
        frame = requestAnimationFrame(loop);
      } else {
        pointerX = pointerY = 0;
        render(0);
      }
    };

    const measureHero = () => {
      const hero = document.querySelector<HTMLElement>('.space-hero');
      heroTop = hero ? hero.offsetTop : -1;
      heroHeight = hero?.offsetHeight ?? 0;
    };

    const resize = () => {
      measureHero();
      if (canvas.clientWidth === width && canvas.clientHeight === height) return; // mobile URL-bar bursts fire resize without changing the box
      const dpr = Math.min(devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nebula.width = Math.max(1, Math.round(width / 8));
      nebula.height = Math.max(1, Math.round(height / 8));
      const wasMobile = mobile;
      mobile = width < MOBILE_WIDTH;
      if (!layers.length || wasMobile !== mobile) layers = makeLayers(mobile ? 0.4 : 1);
      if (!frame) render(0);
    };

    // With reduced motion the sky is a still frame, but it must still follow the page when the visitor scrolls.
    const onScroll = () => { if (!frame) render(0); };

    // ponytail: the cursor is tracked twice (here and in parallax.ts) with two independent lerps, so canvas and orbs can
    // disagree by a frame. Improvement: read --px/--py off .space-hero once per frame instead of keeping a second copy.
    const onPointer = (event: PointerEvent) => {
      targetX = pointerToUnit(event.clientX, innerWidth);
      targetY = pointerToUnit(event.clientY, innerHeight);
    };
    const hoverless = matchMedia(NO_HOVER).matches;

    resize();
    update();
    addEventListener('resize', resize, { passive: true });
    addEventListener('scroll', onScroll, { passive: true });
    if (!hoverless) addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', update);
    reduced.addEventListener('change', update);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('resize', resize);
      removeEventListener('scroll', onScroll);
      if (!hoverless) removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', update);
      reduced.removeEventListener('change', update);
    };
  }, []);

  return <canvas ref={ref} className="space-canvas" data-space-animation data-running={String(running)} aria-hidden="true" />;
}
