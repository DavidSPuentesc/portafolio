import { readFileSync } from 'node:fs';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, it } from 'vitest';
import ProjectCard from '../../src/components/projects/ProjectCard.astro';

const privateProject = {
  slug: 'ptw-digital-signatures',
  visibility: 'private-summary',
  title: 'Permisos de trabajo',
  summary: 'Resumen',
  sector: { es: 'Energía', en: 'Energy' },
  metrics: [{ value: '2', label: { es: 'plantas', en: 'plants' }, context: { es: 'x', en: 'x' } }],
  technologies: ['PHP 8', 'pdf.js'],
};

it('labels private summaries and shows sector and metrics on project cards', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(ProjectCard, { props: { project: privateProject, lang: 'es' } });
  expect(html).toContain('CASO PRIVADO · RESUMEN');
  expect(html).toContain('data-visibility="private-summary"');
  expect(html).toContain('Energía');
  expect(html).toContain('<strong>2</strong><span>plantas</span>');
  expect(html).toContain('href="/es/projects/ptw-digital-signatures/"');
  const english = await container.renderToString(ProjectCard, { props: { project: { ...privateProject, visibility: 'development' }, lang: 'en' } });
  expect(english).toContain('IN DEVELOPMENT');
});

it('renders decisions, metrics with context, lazy images and a private-summary notice on case pages', () => {
  const source = readFileSync('src/pages/[lang]/projects/[slug].astro', 'utf8');
  expect(source).toContain('project.decisions[lang]');
  expect(source).toContain('case-metrics');
  expect(source).toContain('loading="lazy"');
  expect(source).toContain('RESUMEN SIN DATOS PRIVADOS');
  expect(source).toContain('SUMMARY WITHOUT PRIVATE DATA');
  expect(source).toContain('project.seoTitle');
  expect(source).toContain('repositoryLabel');
});
