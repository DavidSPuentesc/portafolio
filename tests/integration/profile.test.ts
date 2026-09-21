import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

it('uses calibrated agentic-AI language and language-matched CVs', () => {
  const source = readFileSync('src/pages/[lang]/profile.astro', 'utf8');
  expect(source).toContain('AgenticWorkflow');
  expect(source).toContain('validación humana');
  expect(source).not.toContain('experto en arquitecturas multiagente en producción');
  expect(source).toContain('david-puentes-cv-es.pdf');
  expect(source).toContain('david-puentes-cv-en.pdf');
});
