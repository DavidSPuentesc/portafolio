import { readFileSync } from 'node:fs';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, it } from 'vitest';
import SolutionCard from '../../src/components/commercial/SolutionCard.astro';

const page = readFileSync('src/pages/[lang]/solutions.astro', 'utf8');
const data = JSON.parse(readFileSync('src/content/solutions/solutions.json', 'utf8'));

it('publishes only offers backed by independent public evidence', () => {
  const raw = JSON.stringify(data);
  expect(page).toContain('SolutionCard');
  expect(raw).toContain('Monitoreo IoT y sensórica');
  expect(raw).toContain('Seguridad de activos con electrónica');
  expect(raw).toContain('Aplicaciones web e IA asistida');
  expect(raw).not.toMatch(/clientes|work permits|Teltonika|OTP/i);
});

it('labels target sectors and drives to the contact form', () => {
  expect(data.sectors.es).toContain('Industria y manufactura');
  expect(data.sectors.en).toContain('Small and medium-sized businesses');
  expect(page).toContain('href="#contact"');
  expect(page).toContain('SECTORES OBJETIVO');
  expect(page).toContain('Confidencialidad desde el diseño');
});

it('renders public proof on each solution card', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(SolutionCard, { props: { solution: data.items[2], lang: 'es' } });
  expect(html).toContain('Ya construido');
  expect(html).toContain('Sensor Dashboard');
  expect(html).toContain('href="/es/projects/sensor-dashboard/"');
  const english = await container.renderToString(SolutionCard, { props: { solution: data.items[0], lang: 'en' } });
  expect(english).toContain('Already built');
  expect(english).toContain('SmartSense');
});
