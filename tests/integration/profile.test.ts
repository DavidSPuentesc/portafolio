import { readFileSync } from 'node:fs';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, it } from 'vitest';
import AgenticWorkflow from '../../src/components/ai/AgenticWorkflow.astro';
import ExperienceTimeline from '../../src/components/profile/ExperienceTimeline.astro';

const source = readFileSync('src/pages/[lang]/profile.astro', 'utf8');

it('uses calibrated agentic-AI language and language-matched CVs', () => {
  expect(source).toContain('AgenticWorkflow');
  expect(source).toContain('validación humana');
  expect(source).toContain('david-puentes-cv-es.pdf');
  expect(source).toContain('david-puentes-cv-en.pdf');
  expect(source).not.toMatch(/clientes empresariales|customer instances|Teltonika/i);
});

it('offers contact actions and states that employment details are confidential', () => {
  expect(source).toContain('mailto:davidsantiago.puentesc@gmail.com');
  expect(source).toContain('linkedin.com/in/');
  expect(source).toContain('obligaciones de confidencialidad');
  expect(source).toContain('confidentiality obligations');
});

it('describes a generic, testable delivery process', () => {
  expect(source).toMatch(/Cómo trabajo/);
  expect(source).toMatch(/How I work/);
  expect(source).toMatch(/criterio de aceptación/);
  expect(source).toMatch(/critical paths/);
  expect(source).toMatch(/revisión humana/);
});

it('reflects the public stack without disclosing private systems', () => {
  expect(source).toMatch(/MySQL\/MariaDB/);
  expect(source).toMatch(/PostgreSQL/);
  expect(source).toMatch(/ESP32/);
  expect(source).toMatch(/Astro/);
  expect(source).not.toMatch(/Gemini API|webhook|staging por cliente/i);
});

it('renders agentic stages and the experience timeline', async () => {
  const container = await AstroContainer.create();
  const workflow = await container.renderToString(AgenticWorkflow, { props: { lang: 'en' } });
  expect(workflow.match(/<article>/g)).toHaveLength(4);
  expect(workflow).toContain('MCP');
  expect(workflow).toContain('human validation');

  const entry = { data: { period: { es: '2025', en: '2025' }, role: { es: 'Dev', en: 'Dev' }, company: 'Empresa privada', location: 'Colombia', summary: { es: 'Resumen', en: 'Summary' }, highlights: { es: ['Uno'], en: ['One'] }, metrics: [] } };
  const timeline = await container.renderToString(ExperienceTimeline, { props: { entries: [entry], lang: 'es' } });
  expect(timeline).toContain('Empresa privada');
  expect(timeline).toContain('Colombia');
});
