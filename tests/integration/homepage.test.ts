import { readFileSync } from 'node:fs';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, it } from 'vitest';
import MetricStrip from '../../src/components/home/MetricStrip.astro';

it('declares evidence, both audience destinations, enterprise experience and the working process', () => {
  const source = readFileSync('src/pages/[lang]/index.astro', 'utf8');
  expect(source).toContain('MetricStrip');
  expect(source).toContain('AudienceGateway');
  expect(source).toContain('SpaceHero');
  expect(source).toContain('EXPERIENCIA EMPRESARIAL');
  expect(source).toContain('CÓMO TRABAJO');
  expect(source).toContain('commercial-process four');
  expect(source).toMatch(/987.*8 semanas/);
  expect(source).toMatch(/987.*8 weeks/);
});

it('links every headline metric to the case that gives it context', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(MetricStrip, { props: { lang: 'es' } });
  expect(html.match(/<a href="\/es\/projects\/(securapp|ptw-digital-signatures)\/">/g)).toHaveLength(4);
  expect(html).toContain('<strong>7</strong><span>clientes B2B en producción</span>');
  expect(html).toContain('<strong>987</strong>');
  expect(html).toContain('<strong>47</strong>');
  expect(html).toContain('<strong>1</strong><span>planta industrial en operación</span>');
  expect(html).not.toContain('<strong>688 m</strong>');
  expect(html).toMatch(/<small>[^<]*8 semanas[^<]*<\/small>/);
  expect(html).toMatch(/<small>Permisos digitales y OTP[^<]*<\/small>/);
  const english = await container.renderToString(MetricStrip, { props: { lang: 'en' } });
  expect(english).toContain('B2B customers in production');
  expect(english).toContain('industrial plant in live operation');
});

it('keeps the hero positioning concrete and bilingual', () => {
  const source = readFileSync('src/i18n/ui.ts', 'utf8');
  expect(source).toContain('7 clientes B2B en producción');
  expect(source).toContain('7 B2B customers in production');
  expect(source).toMatch(/integración de LLM/);
  expect(source).toMatch(/LLM integration/);
  expect(source).not.toMatch(/desarrollo de IA|AI development/);
});
