import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import ContactForm from '../../src/components/contact/ContactForm';

it('shows a direct email fallback when no Formspree endpoint is configured', () => {
  const html = renderToStaticMarkup(createElement(ContactForm, { locale: 'es', intent: 'business', endpoint: null }));
  expect(html).toContain('mailto:davidsantiago.puentesc@gmail.com');
  expect(html).not.toContain('<form');
});

it('renders the contact form when a safe Formspree endpoint is configured', () => {
  const html = renderToStaticMarkup(createElement(ContactForm, { locale: 'en', intent: 'hiring', endpoint: 'https://formspree.io/f/abcde123' }));
  expect(html).toContain('<form');
  expect(html).toContain('Send message');
});
