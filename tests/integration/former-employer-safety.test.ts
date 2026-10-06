import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { expect, it } from 'vitest';

const retiredCases = [
  'b2b-operations-ecosystem',
  'contextual-ai-assistant',
  'gps-telemetry',
  'ptw-digital-signatures',
];

const publishedSources = [
  ...readdirSync(join(process.cwd(), 'src/content/projects')).map((file) => join('src/content/projects', file)),
  ...readdirSync(join(process.cwd(), 'src/content/experience')).map((file) => join('src/content/experience', file)),
  join('src/content/solutions/solutions.json'),
  join('src/i18n/ui.ts'),
  join('src/pages/[lang]/index.astro'),
  join('src/pages/[lang]/profile.astro'),
  join('src/pages/[lang]/solutions.astro'),
  join('src/components/home/MetricStrip.astro'),
  join('scripts/generate-cv-es.mjs'),
  join('scripts/generate-cv-en.mjs'),
];

it('does not publish case studies derived from the former employer', () => {
  for (const slug of retiredCases) {
    expect(existsSync(join(process.cwd(), 'src/content/projects', `${slug}.json`)), slug).toBe(false);
  }
});

it('keeps former-employer operational details out of published surfaces', () => {
  const forbidden = [
    /987\s+(?:commits|production commits)/i,
    /47\s+(?:migraciones|versioned|zero-downtime)/i,
    /7\s+(?:clientes|enterprise customers|instancias)/i,
    /Teltonika|Codec 8\/8E/i,
    /permisos? de trabajo.*(?:OTP|firma digital)/i,
    /work permits?.*(?:OTP|digital signatures?)/i,
    /gesti[oó]n y calificaci[oó]n de contratistas/i,
    /contractor management and evaluation/i,
  ];

  for (const file of publishedSources) {
    const text = readFileSync(join(process.cwd(), file), 'utf8');
    for (const pattern of forbidden) expect(text, `${file} exposes ${pattern}`).not.toMatch(pattern);
    for (const slug of retiredCases) expect(text, `${file} links ${slug}`).not.toContain(slug);
  }
});
