import { readFileSync } from 'node:fs';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, it } from 'vitest';
import AgenticWorkflow from '../../src/components/ai/AgenticWorkflow.astro';
import ExperienceTimeline from '../../src/components/profile/ExperienceTimeline.astro';

const source = readFileSync('src/pages/[lang]/profile.astro', 'utf8');

it('uses calibrated agentic-AI language and language-matched CVs', () => {
  expect(source).toContain('AgenticWorkflow');
  expect(source).toContain('validación humana');
  expect(source).not.toContain('experto en arquitecturas multiagente en producción');
  expect(source).toContain('david-puentes-cv-es.pdf');
  expect(source).toContain('david-puentes-cv-en.pdf');
});

it('offers a double call to action and the real location', () => {
  expect(source).toContain('mailto:davidsantiago.puentesc@gmail.com');
  expect(source).toContain('linkedin.com/in/');
  expect(source).toContain('BOGOTÁ, COLOMBIA');
});

it('describes the delivery process truthfully and marks only the smoke-test step as pending', () => {
  expect(source).toMatch(/Cómo entrego a producción/);
  expect(source).toMatch(/How I ship to production/);
  expect(source).toMatch(/staging → main/);
  expect(source).toMatch(/webhook/);
  expect(source).toMatch(/git revert/);
  expect(source).toContain('class:list={{ pending: item.pending }}');
  const pendingSteps = [...source.matchAll(/\{\s*text:\s*'([^']*)',\s*pending:\s*true\s*\}/g)].map((match) => match[1]);
  expect(pendingSteps).toHaveLength(2);
  for (const text of pendingSteps) expect(text).toMatch(/smoke tests/i);
  expect(pendingSteps[0]).toMatch(/no implementado/i);
  expect(pendingSteps[1]).toMatch(/not implemented/i);
  expect(source).not.toMatch(/PHPUnit/);
});

it('reflects the real stack without inflating cloud experience', () => {
  expect(source).toMatch(/PHP 8/);
  expect(source).toMatch(/MySQL\/MariaDB/);
  expect(source).toMatch(/Teltonika/);
  expect(source).toMatch(/Terraform.*fortalecimiento/);
  expect(source).toMatch(/no AWS production/);
  expect(source).not.toMatch(/Django/);
});

it('renders the four real agentic stages and the experience timeline with location and metrics', async () => {
  const container = await AstroContainer.create();
  const workflow = await container.renderToString(AgenticWorkflow, { props: { lang: 'en' } });
  expect(workflow.match(/<article>/g)).toHaveLength(4);
  expect(workflow).toContain('Brainstorm and spec');
  expect(workflow).toContain('MCP');
  expect(workflow).toContain('human validation');

  const entry = {
    data: {
      period: { es: '2025', en: '2025' },
      role: { es: 'Dev', en: 'Dev' },
      company: 'ACME',
      location: 'Bogotá, Colombia',
      summary: { es: 'Resumen', en: 'Summary' },
      highlights: { es: ['Uno'], en: ['One'] },
      metrics: [{ value: '7', label: { es: 'clientes', en: 'customers' } }],
    },
  };
  const timeline = await container.renderToString(ExperienceTimeline, { props: { entries: [entry], lang: 'es' } });
  expect(timeline).toContain('Bogotá, Colombia');
  expect(timeline).toContain('<strong>7</strong><span>clientes</span>');
});
