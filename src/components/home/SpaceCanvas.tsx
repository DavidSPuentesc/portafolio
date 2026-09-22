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
const LAYER_SPECS = [
  { depth: 4, count: 120, radius: [0.35, 0.8], alpha: [0.25, 0.55], twinkle: 0 },
  { depth: 10, count: 55, radius: [0.8, 1.3], alpha: [0.45, 0.85], twinkle: 0.3 },
  { depth: 22, count: 20, radius: [1.3, 2.1], alpha: [0.75, 1], twinkle: 0.6 },
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
    let frame = 0, last = 0, inView = true;
    let width = 0, height = 0, mobile = false, layers: Layer[] = [];
    let targetX = 0, targetY = 0, pointerX = 0, pointerY = 0;
    let meteor: Meteor | null = null, nextMeteorAt = 6000;

    // ponytail: the nebula is painted at 1/8 scale and upscaled; the blur is free and 3 full-size gradients per frame are not.
    const drawNebula = (time: number) => {
      const w = nebula.width, h = nebula.height;
      nctx.clearRect(0, 0, w, h);
      nctx.globalCompositeOperation = 'lighter';
      const blobs: [number, number, number, string, number][] = [
        [0.78 + 0.015 * Math.sin(time * 0.00006), 0.36 + 0.02 * Math.cos(time * 0.00005), 0.42, '#2b64d6', 0.45],
        [0.6 + 0.02 * Math.cos(time * 0.00004), 0.62 + 0.015 * Math.sin(time * 0.00007), 0.34, '#7c3aed', 0.32],
        [0.92, 0.18 + 0.02 * Math.sin(time * 0.00005), 0.22, '#38c6f2', 0.26],
      ];
      for (const [x, y, r, color, alpha] of blobs) {
        const gradient = nctx.createRadialGradient(x * w, y * h, 0, x * w, y * h, r * w);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');
        nctx.globalAlpha = mobile ? alpha * 0.8 : alpha;
        nctx.fillStyle = gradient;
        nctx.fillRect(0, 0, w, h);
      }
      nctx.globalAlpha = 1;
      const pad = 24;
      ctx.drawImage(nebula, -pad + pointerX * 6, -pad + pointerY * 6, width + pad * 2, height + pad * 2);
    };

    const drawStars = (time: number) => {
      for (const { depth, stars } of layers) {
        const ox = pointerX * depth, oy = pointerY * depth;
        const glow = depth === 22;
        if (glow) { ctx.shadowBlur = 6; ctx.shadowColor = 'rgba(160,220,255,0.8)'; }
        for (const star of stars) {
          const alpha = star.twinkle ? star.a * (0.6 + 0.4 * Math.sin(time * 0.001 * star.twinkle + star.x * 50)) : star.a;
          const x = (((star.x * width + ox) % width) + width) % width;
          const y = (((star.y * height + oy) % height) + height) % height;
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
      // On phones the title spans the full width, so the system sits in the top-right corner instead of mid-height.
      const cx = width * 0.8 + pointerX * 14, cy = height * (mobile ? 0.08 : 0.4) + pointerY * 14;
      const major = Math.min(width, height) * (mobile ? 0.14 : 0.13);
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
        meteor = { x: width * (0.25 + random() * 0.6), y: height * random() * 0.35, vx: -(0.45 + random() * 0.25), vy: 0.18 + random() * 0.12, life: 0 };
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
      const active = shouldAnimate(reduced.matches, document.visibilityState) && inView;
      setRunning(active);
      if (active) {
        last = 0;
        frame = requestAnimationFrame(loop);
      } else {
        pointerX = pointerY = 0;
        render(0);
      }
    };

    const resize = () => {
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

    // ponytail: the cursor is tracked twice (here and in parallax.ts) with two independent lerps, so canvas and orbs can
    // disagree by a frame. Improvement: read --px/--py off .space-hero once per frame instead of keeping a second copy.
    const onPointer = (event: PointerEvent) => {
      targetX = pointerToUnit(event.clientX, innerWidth);
      targetY = pointerToUnit(event.clientY, innerHeight);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = !!entry?.isIntersecting;
      update();
    });
    const hoverless = matchMedia(NO_HOVER).matches;

    resize();
    update();
    observer.observe(canvas);
    addEventListener('resize', resize, { passive: true });
    if (!hoverless) addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', update);
    reduced.addEventListener('change', update);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      removeEventListener('resize', resize);
      if (!hoverless) removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', update);
      reduced.removeEventListener('change', update);
    };
  }, []);

  return <canvas ref={ref} className="space-canvas" data-space-animation data-running={String(running)} aria-hidden="true" />;
}
