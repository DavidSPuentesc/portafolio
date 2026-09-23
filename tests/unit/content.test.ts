import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { experienceSchema, projectSchema, solutionsSchema } from '../../src/content.config';

const contentRoot = join(process.cwd(), 'src/content');
const readJson = (path: string) => JSON.parse(readFileSync(path, 'utf8'));
const projectFiles = readdirSync(join(contentRoot, 'projects')).filter((file) => file.endsWith('.json'));
const projects = projectFiles.map((file) => readJson(join(contentRoot, 'projects', file)));

const baseProject = {
  slug: 'x',
  order: 1,
  featured: true,
  visibility: 'public',
  title: { es: 'X', en: 'X' },
  summary: { es: 'Resumen', en: 'Summary' },
  seoTitle: { es: 'X', en: 'X' },
  seoDescription: { es: 'X', en: 'X' },
  role: { es: 'Rol', en: 'Role' },
  problem: { es: 'Problema', en: 'Problem' },
  architecture: { es: 'Arquitectura', en: 'Architecture' },
  decisions: { es: ['Decisión'], en: ['Decision'] },
  results: { es: ['Resultado'], en: ['Result'] },
  limitations: { es: ['Límite'], en: ['Limit'] },
  technologies: ['Astro'],
  metrics: [],
  evidenceUrl: null,
  repositoryUrl: null,
  demoUrl: null,
};

describe('project evidence', () => {
  it('rejects a metric without context in either language', () => {
    const result = projectSchema.safeParse({ ...baseProject, metrics: [{ value: '51K+' }] });
    expect(result.success).toBe(false);
  });

  it('accepts sector, period, images and a repository label with bilingual descriptions', () => {
    const result = projectSchema.parse({
      ...baseProject,
      sector: { es: 'Energía', en: 'Energy' },
      period: { es: '2026', en: '2026' },
      images: [{ src: '/images/projects/demo.png', alt: { es: 'Diagrama', en: 'Diagram' }, width: 1600, height: 900 }],
      repositoryLabel: { es: 'Repositorio del equipo', en: 'Team repository' },
    });
    expect(result.images[0].caption).toBeNull();
    expect(result.sector?.en).toBe('Energy');
  });

  it('rejects images outside the public projects folder, without alt text, or without dimensions', () => {
    const alt = { es: 'a', en: 'a' };
    expect(projectSchema.safeParse({ ...baseProject, images: [{ src: 'https://cdn.example.com/x.png', alt, width: 1, height: 1 }] }).success).toBe(false);
    expect(projectSchema.safeParse({ ...baseProject, images: [{ src: '/images/projects/x.png', width: 1, height: 1 }] }).success).toBe(false);
    expect(projectSchema.safeParse({ ...baseProject, images: [{ src: '/images/projects/x.png', alt }] }).success).toBe(false);
  });
});

describe('published projects', () => {
  it('validates every project file against the schema', () => {
    for (const project of projects) {
      const result = projectSchema.safeParse(project);
      expect(result.success, `${project.slug}: ${JSON.stringify(result.success ? '' : result.error.issues)}`).toBe(true);
    }
  });

  it('publishes the agreed order and the six featured cases', () => {
    const ordered = [...projects].sort((a, b) => a.order - b.order).map((p) => p.slug);
    expect(ordered).toEqual(['smartsense', 'securapp', 'ptw-digital-signatures', 'contextual-ai-assistant', 'gps-telemetry', 'project-h', 'sensor-dashboard', 'wifi-sensing', 'gas-dyson']);
    expect(projects.filter((p) => p.featured).map((p) => p.slug).sort()).toEqual(['gps-telemetry', 'contextual-ai-assistant', 'project-h', 'ptw-digital-signatures', 'securapp', 'smartsense'].sort());
    expect(new Set(projects.map((p) => p.order)).size).toBe(projects.length);
  });

  it('presents the contextual AI assistant under a descriptive name and attributes it to PRLCOL', () => {
    const assistant = projects.find((project) => project.slug === 'contextual-ai-assistant');
    expect(assistant?.title.es).toBe('Asistente contextual con IA para plataforma B2B');
    expect(assistant?.title.en).toBe('Contextual AI assistant for a B2B platform');
    expect(assistant?.role.es).toContain('PRLCOL');
    expect(JSON.stringify(assistant)).not.toMatch(/magIA/i);
  });

  it('keeps private summaries free of code, demos and screenshots', () => {
    for (const project of projects.filter((p) => p.visibility === 'private-summary')) {
      expect(project.repositoryUrl, project.slug).toBeNull();
      expect(project.demoUrl, project.slug).toBeNull();
      expect(project.evidenceUrl, project.slug).toBeNull();
      expect(project.images ?? [], project.slug).toEqual([]);
    }
  });

  it('gives every metric a bilingual label and context', () => {
    for (const project of projects) {
      for (const metric of project.metrics ?? []) {
        expect(metric.label.es && metric.label.en && metric.context.es && metric.context.en, `${project.slug}: ${metric.value}`).toBeTruthy();
      }
    }
  });

  it('ships every referenced image under public/', () => {
    for (const project of projects) {
      for (const image of project.images ?? []) {
        expect(existsSync(join(process.cwd(), 'public', image.src)), `${project.slug}: ${image.src}`).toBe(true);
      }
    }
  });

  it('states the SmartSense evidence with its caveats in both languages', () => {
    const smartsense = projects.find((p) => p.slug === 'smartsense');
    expect(smartsense.results.es.join(' ')).toContain('51.338');
    expect(smartsense.results.en.join(' ')).toContain('51,338');
    expect(smartsense.limitations.es.join(' ')).toMatch(/cota inferior/);
    expect(smartsense.limitations.en.join(' ')).toMatch(/lower bound/);
    expect(smartsense.limitations.es.join(' ')).toMatch(/estimaci/);
    expect(smartsense.repositoryUrl).toBe('https://github.com/jesusabojacal-commits/SmartSense-Monitoring');
    expect(smartsense.images.length).toBeGreaterThan(0);
  });

  it('frames the 987 commits as an eight-week figure and the platform as multi-instance', () => {
    const securapp = projects.find((p) => p.slug === 'securapp');
    const text = JSON.stringify(securapp);
    expect(text).toMatch(/987[^"]*8 semanas/);
    expect(text).toMatch(/987[^"]*(8|eight) weeks/);
    expect(text).not.toMatch(/multi-?tenant(?! estricto| strict)/i);
    expect(text).not.toMatch(/desarrollo de IA/i);
  });
});

describe('confidentiality', () => {
  /**
   * The denylist never lives in this public repository. It comes from CONTENT_DENYLIST
   * (case-insensitive regex patterns separated by "|"), set in the environment or in the
   * gitignored .env file. Without it the check is skipped, not silently passed.
   */
  function loadDenylist(): RegExp[] {
    let raw = process.env.CONTENT_DENYLIST ?? '';
    if (!raw) {
      const envPath = join(process.cwd(), '.env');
      if (existsSync(envPath)) {
        const line = readFileSync(envPath, 'utf8').split(/\r?\n/).find((entry) => entry.startsWith('CONTENT_DENYLIST='));
        raw = line?.slice('CONTENT_DENYLIST='.length).trim().replace(/^(['"])(.*)\1$/, '$2') ?? '';
      }
    }
    return raw.split('|').map((pattern) => pattern.trim()).filter(Boolean).map((pattern) => new RegExp(pattern, 'i'));
  }
  const forbidden = loadDenylist();
  const files = [
    ...projectFiles.map((f) => join(contentRoot, 'projects', f)),
    ...readdirSync(join(contentRoot, 'experience')).map((f) => join(contentRoot, 'experience', f)),
    join(contentRoot, 'solutions', 'solutions.json'),
    join(process.cwd(), 'src/i18n/ui.ts'),
    join(process.cwd(), 'src/pages/[lang]/index.astro'),
    join(process.cwd(), 'src/pages/[lang]/profile.astro'),
    join(process.cwd(), 'src/pages/[lang]/solutions.astro'),
    join(process.cwd(), 'scripts/generate-cv-en.mjs'),
  ];

  it.skipIf(!forbidden.length)('never names denylisted customers or partners (CONTENT_DENYLIST)', () => {
    for (const file of files) {
      const text = readFileSync(file, 'utf8');
      for (const pattern of forbidden) expect(text, `${file} matches ${pattern}`).not.toMatch(pattern);
    }
  });
});

describe('experience and solutions', () => {
  it('requires a location and validates the published experience entries', () => {
    expect(experienceSchema.safeParse({ order: 1, company: 'X', period: { es: 'a', en: 'a' }, role: { es: 'a', en: 'a' }, summary: { es: 'a', en: 'a' }, highlights: { es: ['a'], en: ['a'] } }).success).toBe(false);
    for (const file of readdirSync(join(contentRoot, 'experience'))) {
      const result = experienceSchema.safeParse(readJson(join(contentRoot, 'experience', file)));
      expect(result.success, `${file}: ${JSON.stringify(result.success ? '' : result.error.issues)}`).toBe(true);
    }
  });

  it('describes production ownership and the granted patent honestly', () => {
    const prlcol = readJson(join(contentRoot, 'experience', 'prlcol.json'));
    const ceintecci = readJson(join(contentRoot, 'experience', 'ceintecci.json'));
    expect(prlcol.highlights.es.length).toBeGreaterThanOrEqual(8);
    expect(prlcol.highlights.en.length).toBe(prlcol.highlights.es.length);
    expect(prlcol.summary.es).toMatch(/7 clientes/);
    expect(prlcol.summary.en).toMatch(/7 enterprise customers/i);
    expect(ceintecci.highlights.es.join(' ')).toMatch(/Patente concedida/);
    expect(ceintecci.highlights.en.join(' ')).toMatch(/Patent granted/);
    expect(JSON.stringify(ceintecci)).not.toMatch(/n[uú]mero de registro|registration number/i);
  });

  it('requires proof for every commercial offer and validates the published file', () => {
    const data = readJson(join(contentRoot, 'solutions', 'solutions.json'));
    const result = solutionsSchema.safeParse(data);
    expect(result.success, JSON.stringify(result.success ? '' : result.error.issues)).toBe(true);
    for (const item of data.items) {
      expect(item.proof.es.length, item.id).toBeGreaterThanOrEqual(2);
      expect(item.proof.en.length, item.id).toBe(item.proof.es.length);
      expect(projects.some((p) => p.slug === item.evidenceSlug), item.id).toBe(true);
    }
    const withoutProof = { ...data, items: data.items.map(({ proof, ...rest }: any) => rest) };
    expect(solutionsSchema.safeParse(withoutProof).success).toBe(false);
  });
});
