import { readFileSync } from 'node:fs';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, it } from 'vitest';
import MetricStrip from '../../src/components/home/MetricStrip.astro';

it('presents public evidence, both audience paths, and a general professional profile', () => {
  const source = readFileSync('src/pages/[lang]/index.astro', 'utf8');
  expect(source).toContain('MetricStrip');
  expect(source).toContain('AudienceGateway');
  expect(source).toContain('EVIDENCIA PÚBLICA');
  expect(source).toContain('Experiencia profesional');
  expect(source).toContain('CÓMO TRABAJO');
  expect(source).not.toMatch(/clientes B2B|production commits|migraciones SQL sin downtime/i);
});

it('links headline metrics only to public project evidence', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(MetricStrip, { props: { lang: 'es' } });
  expect(html).toContain('href="/es/projects/smartsense/"');
  expect(html).toContain('href="/es/projects/sensor-dashboard/"');
  expect(html).toContain('<strong>51K+</strong>');
  expect(html).toContain('<strong>32</strong>');
  expect(html).toContain('<strong>3</strong>');
  expect(html).toContain('<strong>E2E</strong>');
});

it('keeps the hero concrete and bilingual without former-employer metrics', () => {
  const source = readFileSync('src/i18n/ui.ts', 'utf8');
  expect(source).toContain('experiencia profesional en aplicaciones empresariales');
  expect(source).toContain('professional experience in business applications');
  expect(source).toMatch(/validación humana/);
  expect(source).toMatch(/human-validation/);
});
