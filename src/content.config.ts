import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const localizedText = z.object({ es: z.string().min(1), en: z.string().min(1) });
const localizedList = z.object({ es: z.array(z.string().min(1)).min(1), en: z.array(z.string().min(1)).min(1) });

/** Every published figure carries its label and its context in both languages. */
const metric = z.object({ value: z.string().min(1), label: localizedText, context: localizedText });

/** Images are served from the public folder and must describe themselves in both languages. */
const projectImage = z.object({
  src: z.string().regex(/^\/images\/projects\/[a-z0-9-]+\.(png|jpg|jpeg|webp|svg)$/),
  alt: localizedText,
  caption: localizedText.nullable().default(null),
});

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  order: z.number().int().positive(),
  featured: z.boolean(),
  /** public: code or demo can be linked · private-summary: no code, names, or screenshots · development: research or early work. */
  visibility: z.enum(['public', 'private-summary', 'development']),
  title: localizedText,
  summary: localizedText,
  seoTitle: localizedText,
  seoDescription: localizedText,
  role: localizedText,
  sector: localizedText.nullable().default(null),
  period: localizedText.nullable().default(null),
  problem: localizedText,
  architecture: localizedText,
  decisions: localizedList,
  results: localizedList,
  limitations: localizedList,
  technologies: z.array(z.string().min(1)).min(1),
  metrics: z.array(metric).default([]),
  images: z.array(projectImage).default([]),
  evidenceUrl: z.url().nullable(),
  repositoryUrl: z.url().nullable(),
  repositoryLabel: localizedText.nullable().default(null),
  demoUrl: z.url().nullable(),
});

export const experienceSchema = z.object({
  order: z.number(),
  company: z.string(),
  location: z.string().min(1),
  period: localizedText,
  role: localizedText,
  summary: localizedText,
  highlights: localizedList,
  metrics: z.array(z.object({ value: z.string().min(1), label: localizedText })).default([]),
});

export const certificationsSchema = z.object({
  items: z.array(z.object({ name: localizedText, issuer: z.string(), issued: z.string(), category: z.string(), url: z.url().nullable() })),
});

export const solutionsSchema = z.object({
  sectors: localizedList,
  items: z.array(
    z.object({
      id: z.string(),
      title: localizedText,
      pain: localizedText,
      deliverable: localizedText,
      evidenceSlug: z.string(),
      /** Concrete, already-delivered work that backs the offer. Never a promise. */
      proof: localizedList,
      pilotMetrics: localizedList,
    }),
  ),
});

const projects = defineCollection({ loader: glob({ pattern: '**/*.json', base: './src/content/projects' }), schema: projectSchema });
const experience = defineCollection({ loader: glob({ pattern: '**/*.json', base: './src/content/experience' }), schema: experienceSchema });
const certifications = defineCollection({ loader: glob({ pattern: '**/*.json', base: './src/content/certifications' }), schema: certificationsSchema });
const solutions = defineCollection({ loader: glob({ pattern: '**/*.json', base: './src/content/solutions' }), schema: solutionsSchema });

export const collections = { projects, experience, certifications, solutions };
