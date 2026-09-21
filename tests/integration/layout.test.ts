import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, it } from 'vitest';
import BaseLayout from '../../src/layouts/BaseLayout.astro';

it('renders language, canonical, hreflang, and skip link', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(BaseLayout, { props: { lang: 'es', title: 'Inicio', description: 'Portafolio', canonicalPath: '/es/' } });
  expect(html).toContain('lang="es"');
  expect(html).toContain('hreflang="en"');
  expect(html).toContain('href="#main-content"');
});
