import { describe, expect, it } from 'vitest';
import { projectSchema } from '../../src/content.config';

describe('project evidence', () => {
  it('rejects a metric without context in either language', () => {
    const result = projectSchema.safeParse({
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
      metrics: [{ value: '51K+' }],
      evidenceUrl: null,
      repositoryUrl: null,
      demoUrl: null,
    });
    expect(result.success).toBe(false);
  });
});
