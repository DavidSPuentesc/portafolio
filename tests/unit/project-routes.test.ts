import { expect, it } from 'vitest';
import { getProjectStaticPaths } from '../../src/lib/project-routes';

const slugs = ['smartsense', 'securapp', 'ptw-digital-signatures', 'contextual-ai-assistant', 'gps-telemetry', 'project-h', 'sensor-dashboard', 'wifi-sensing', 'gas-dyson'];

it('generates both locales for each project', async () => {
  const projects = slugs.map((slug) => ({ data: { slug } })) as any;
  const paths = await getProjectStaticPaths(projects);
  for (const slug of slugs) {
    expect(paths).toContainEqual(expect.objectContaining({ params: { lang: 'es', slug } }));
    expect(paths).toContainEqual(expect.objectContaining({ params: { lang: 'en', slug } }));
  }
  expect(paths).toHaveLength(slugs.length * 2);
});

it('passes the raw project data and the locale to the page', async () => {
  const [first] = await getProjectStaticPaths([{ data: { slug: 'ptw-digital-signatures', visibility: 'private-summary' } }] as any);
  expect(first.props.lang).toBe('es');
  expect(first.props.project.visibility).toBe('private-summary');
});
