import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, it } from 'vitest';
import reactRenderer from '@astrojs/react/server.js';
import BaseLayout from '../../src/layouts/BaseLayout.astro';

it('renders language, canonical, hreflang, and skip link', async () => {
  const container = await AstroContainer.create();
  // The layout mounts the SpaceCanvas React island, so the container needs the React renderer to render it.
  container.addServerRenderer({ renderer: reactRenderer, name: '@astrojs/react' });
  container.addClientRenderer({ name: '@astrojs/react', entrypoint: '@astrojs/react/client.js' });
  const html = await container.renderToString(BaseLayout, { props: { lang: 'es', title: 'Inicio', description: 'Portafolio', canonicalPath: '/es/' } });
  expect(html).toContain('lang="es"');
  expect(html).toContain('hreflang="en"');
  expect(html).toContain('href="#main-content"');
  expect(html).toContain('data-space-animation');
});
