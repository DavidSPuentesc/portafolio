import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { experienceSchema, projectSchema, solutionsSchema } from '../../src/content.config';

const contentRoot = join(process.cwd(), 'src/content');
const readJson = (path: string) => JSON.parse(readFileSync(path, 'utf8'));
const projectFiles = readdirSync(join(contentRoot, 'projects')).filter((file) => file.endsWith('.json'));
const projects = projectFiles.map((file) => readJson(join(contentRoot, 'projects', file)));

const baseProject = {
  slug: 'x', order: 1, featured: true, visibility: 'public',
  title: { es: 'X', en: 'X' }, summary: { es: 'Resumen', en: 'Summary' },
  seoTitle: { es: 'X', en: 'X' }, seoDescription: { es: 'X', en: 'X' },
  role: { es: 'Rol', en: 'Role' }, problem: { es: 'Problema', en: 'Problem' },
  architecture: { es: 'Arquitectura', en: 'Architecture' },
  decisions: { es: ['Decisión'], en: ['Decision'] }, results: { es: ['Resultado'], en: ['Result'] },
  limitations: { es: ['Límite'], en: ['Limit'] }, technologies: ['Astro'], metrics: [],
  evidenceUrl: null, repositoryUrl: null, demoUrl: null,
};

describe('project evidence', () => {
  it('rejects a metric without bilingual context', () => {
    expect(projectSchema.safeParse({ ...baseProject, metrics: [{ value: '51K+' }] }).success).toBe(false);
  });

  it('accepts a fully documented public image', () => {
    const result = projectSchema.parse({
      ...baseProject,
      images: [{ src: '/images/projects/demo.png', alt: { es: 'Diagrama', en: 'Diagram' }, width: 1600, height: 900 }],
    });
    expect(result.images[0].caption).toBeNull();
  });
});

describe('published projects', () => {
  it('validates every project file against the schema', () => {
    for (const project of projects) {
      const result = projectSchema.safeParse(project);
      expect(result.success, `${project.slug}: ${JSON.stringify(result.success ? '' : result.error.issues)}`).toBe(true);
    }
  });

  it('publishes only the approved independent projects', () => {
    const ordered = [...projects].sort((a, b) => a.order - b.order).map((project) => project.slug);
    expect(ordered).toEqual(['smartsense', 'gastronomic-voting-platform', 'project-h', 'sensor-dashboard', 'wifi-sensing', 'gas-dyson']);
    expect(projects.filter((project) => project.featured).map((project) => project.slug).sort()).toEqual(['gastronomic-voting-platform', 'project-h', 'smartsense']);
    expect(new Set(projects.map((project) => project.order)).size).toBe(projects.length);
  });

  it('gives every metric bilingual labels and context', () => {
    for (const project of projects) {
      for (const metric of project.metrics ?? []) {
        expect(metric.label.es && metric.label.en && metric.context.es && metric.context.en, project.slug).toBeTruthy();
      }
    }
  });

  it('ships every referenced image under public', () => {
    for (const project of projects) {
      for (const image of project.images ?? []) expect(existsSync(join(process.cwd(), 'public', image.src)), image.src).toBe(true);
    }
  });

  it('keeps SmartSense evidence and caveats in both languages', () => {
    const smartSense = projects.find((project) => project.slug === 'smartsense');
    expect(smartSense.results.es.join(' ')).toContain('51.338');
    expect(smartSense.results.en.join(' ')).toContain('51,338');
    expect(smartSense.limitations.es.join(' ')).toMatch(/cota inferior/);
    expect(smartSense.repositoryUrl).toBe('https://github.com/jesusabojacal-commits/SmartSense-Monitoring');
  });

  it('publishes the gastronomic prototype as a safe public demo', () => {
    const project = projects.find((item) => item.slug === 'gastronomic-voting-platform');
    expect(project?.visibility).toBe('public');
    expect(project?.demoUrl).toBe('https://jburguer-mu.vercel.app/');
    expect(project?.repositoryUrl).toBeNull();
    expect(project?.evidenceUrl).toBeNull();
    expect(project?.limitations.es.join(' ')).toMatch(/datos ficticios/i);
    expect(project?.limitations.en.join(' ')).toMatch(/fictional data/i);
  });
});

describe('experience and solutions', () => {
  it('validates employment entries and keeps private employment generic', () => {
    for (const file of readdirSync(join(contentRoot, 'experience'))) {
      expect(experienceSchema.safeParse(readJson(join(contentRoot, 'experience', file))).success, file).toBe(true);
    }
    const employer = readJson(join(contentRoot, 'experience', 'software-development.json'));
    expect(employer.summary.es).toMatch(/confidencialidad/i);
    expect(employer.summary.en).toMatch(/confidentiality/i);
    expect(employer.metrics).toEqual([]);
  });

  it('validates evidence-backed offers against remaining projects', () => {
    const data = readJson(join(contentRoot, 'solutions', 'solutions.json'));
    expect(solutionsSchema.safeParse(data).success).toBe(true);
    for (const item of data.items) {
      expect(item.proof.es.length).toBeGreaterThanOrEqual(2);
      expect(item.proof.en.length).toBe(item.proof.es.length);
      expect(projects.some((project) => project.slug === item.evidenceSlug), item.id).toBe(true);
    }
  });
});
