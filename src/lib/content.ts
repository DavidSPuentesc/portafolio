import { getCollection } from 'astro:content';
import type { Locale } from '../i18n/locales';

export async function getProjects(locale: Locale) {
  const entries = await getCollection('projects');
  return entries.sort((a, b) => a.data.order - b.data.order).map(({ data }) => ({ ...data, title: data.title[locale], summary: data.summary[locale] }));
}

export async function getProject(slug: string, locale: Locale) {
  return (await getProjects(locale)).find((project) => project.slug === slug) ?? null;
}
