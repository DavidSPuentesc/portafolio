import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const localizedText = z.object({ es: z.string().min(1), en: z.string().min(1) });
const localizedList = z.object({ es: z.array(z.string().min(1)).min(1), en: z.array(z.string().min(1)).min(1) });

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  order: z.number().int().positive(),
  featured: z.boolean(),
  visibility: z.enum(['public', 'private-summary', 'development']),
  title: localizedText,
  summary: localizedText,
  seoTitle: localizedText,
  seoDescription: localizedText,
  role: localizedText,
  problem: localizedText,
  architecture: localizedText,
  decisions: localizedList,
  results: localizedList,
  limitations: localizedList,
  technologies: z.array(z.string().min(1)).min(1),
  metrics: z.array(z.object({ value: z.string().min(1), label: localizedText, context: localizedText })).default([]),
  evidenceUrl: z.url().nullable(),
  repositoryUrl: z.url().nullable(),
  demoUrl: z.url().nullable(),
});

const projects = defineCollection({ loader: glob({ pattern: '**/*.json', base: './src/content/projects' }), schema: projectSchema });
const experience = defineCollection({ loader: glob({ pattern: '**/*.json', base: './src/content/experience' }), schema: z.object({ order: z.number(), company: z.string(), period: localizedText, role: localizedText, summary: localizedText, highlights: localizedList }) });
const certifications = defineCollection({ loader: glob({ pattern: '**/*.json', base: './src/content/certifications' }), schema: z.object({ items: z.array(z.object({ name: localizedText, issuer: z.string(), issued: z.string(), category: z.string(), url: z.url().nullable() })) }) });
const solutions = defineCollection({ loader: glob({ pattern: '**/*.json', base: './src/content/solutions' }), schema: z.object({ items: z.array(z.object({ id: z.string(), title: localizedText, pain: localizedText, deliverable: localizedText, evidenceSlug: z.string(), pilotMetrics: localizedList })) }) });

export const collections = { projects, experience, certifications, solutions };
