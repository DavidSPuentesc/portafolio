import { readFileSync } from 'node:fs';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, it } from 'vitest';
import SolutionCard from '../../src/components/commercial/SolutionCard.astro';

const page = readFileSync('src/pages/[lang]/solutions.astro', 'utf8');
const data = JSON.parse(readFileSync('src/content/solutions/solutions.json', 'utf8'));

it('publishes only evidence-backed initial offers', () => {
  const raw = JSON.stringify(data);
  expect(page).toContain('SolutionCard');
  expect(raw).toContain('Monitoreo IoT industrial');
  expect(raw).toContain('trazabilidad de activos');
  expect(raw).toContain('Automatizaci');
  expect(raw).not.toMatch(/producto antifraude listo|predicción logística disponible|ROI garantizado|guaranteed ROI/i);
});

it('names served sectors without naming customers and drives to the contact form', () => {
  expect(data.sectors.es).toContain('Manufactura de alimentos');
  expect(data.sectors.en).toContain('Oil and gas');
  expect(page).toContain('href="#contact"');
  expect(page).toContain('SECTORES ATENDIDOS');
  expect(page).toMatch(/no escalamos/);
  expect(page).toMatch(/we do not scale/);
});

it('renders proof of delivered work on each solution card', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(SolutionCard, { props: { solution: data.items[2], lang: 'es' } });
  expect(html).toContain('Ya construido');
  expect(html).toContain('proof-list');
  expect(html).toMatch(/dos plantas industriales/);
  expect(html).toContain('href="/es/projects/ptw-digital-signatures/"');
  const english = await container.renderToString(SolutionCard, { props: { solution: data.items[0], lang: 'en' } });
  expect(english).toContain('Already built');
  expect(english).toMatch(/51,338 samples/);
});
