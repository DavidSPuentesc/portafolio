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

it('describes the delivery process truthfully, marking automated tests as a next step', () => {
  expect(source).toContain('Cómo entrego a producción');
  expect(source).toContain('How I ship to production');
  expect(source).toMatch(/PR staging → main/);
  expect(source).toMatch(/webhook/);
  expect(source).toMatch(/git revert/);
  expect(source).toMatch(/Siguiente paso, todavía no implementado: smoke tests/);
  expect(source).toMatch(/Next step, not implemented yet: automated post-deploy smoke tests/);
  expect(source).not.toMatch(/PHPUnit/);
});

it('reflects the real stack without inflating cloud experience', () => {
  expect(source).toMatch(/PHP 8, MySQL\/MariaDB/);
  expect(source).toMatch(/Teltonika Codec 8\/8E/);
  expect(source).toMatch(/Terraform, en fortalecimiento; sin producción en AWS/);
  expect(source).toMatch(/still strengthening; no AWS production experience/);
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
