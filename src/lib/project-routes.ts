import { getCollection } from 'astro:content';
import { locales } from '../i18n/locales';

export async function getProjectStaticPaths(projects?: Awaited<ReturnType<typeof getCollection<'projects'>>>) {
  projects ??= await getCollection('projects');
  return locales.flatMap((lang) =>
    projects.map(({ data }) => ({ params: { lang, slug: data.slug }, props: { project: data, lang } })),
  );
}
