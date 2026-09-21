# Bilingual Professional and Commercial Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a bilingual Astro portfolio that presents David Puentes to hiring teams and converts qualified B2B visitors into discovery conversations.

**Architecture:** Astro renders accessible static pages for both `/es/` and `/en/`, with typed local content as the source of truth. React is reserved for the language preference and contact interactions; a progressive Canvas enhancement renders the astronomical hero without blocking content. A small Vercel function validates and forwards contact requests without exposing private credentials.

**Tech Stack:** Node.js 22.12+, Astro 6, TypeScript strict mode, React integration, Astro Sitemap, CSS, Canvas 2D, Zod, Vitest, Astro Container, Playwright, axe-core, Vercel Functions, Upstash Redis rate limiting.

**Spec:** `docs/superpowers/specs/2026-09-20-portafolio-profesional-comercial-design.md`

## Global Constraints

- Use explicit `/es/` and `/en/` routes with Spanish as the default locale and `prefixDefaultLocale: true`.
- Keep essential content and navigation functional without client-side JavaScript.
- Use React only where stateful interaction materially improves the experience.
- Treat SmartSense, SecurApp, Project H, Sensor Dashboard, WiFi Sensing, and Gas Dyson claims exactly as scoped in the specification.
- Do not publish customer names, private interfaces, primary industrial datasets, credentials, or private repository contents.
- Use the neutral Docker/Flask/SQLite SmartSense presentation and synthetic or anonymized data.
- Respect `prefers-reduced-motion`; animations must pause in hidden tabs and fall back to a static background.
- Meet WCAG AA contrast, visible focus, keyboard navigation, and non-flashing motion requirements.
- The contact form must reject malformed input, use a honeypot, enforce a request-size limit, and preserve no sensitive data on failure.
- Require Node.js `>=22.12.0`; odd-numbered Node.js releases are unsupported by Astro 6.
- Keep all user-facing copy in typed locale dictionaries or content entries; components must not duplicate translated strings.

## Review Focus

- A visitor opens a translated detail URL directly: render the same project in the requested locale and return a real 404 for an unknown slug.
- A browser has JavaScript disabled or Canvas unavailable: all content, calls to action, and navigation remain usable with a static hero background.
- A user enables reduced motion or backgrounds the tab: orbital/parallax animation stops immediately and resumes only when allowed.
- A contact request contains oversized, malformed, scripted, or honeypot content: reject it without echoing unsafe data or calling the mail provider.
- A translation or evidence field is missing: fail validation during build instead of publishing a partial card or an unsupported metric.

---

## Planned File Structure

```text
api/contact.ts                         Vercel contact endpoint
public/cv/                             Approved Spanish and English CV files
public/images/                         Optimized project and fallback artwork
src/components/
  layout/Navigation.astro              Global navigation and locale switch
  layout/Footer.astro                  Contact and external links
  home/SpaceHero.astro                 Semantic hero shell
  home/SpaceCanvas.tsx                 Progressive Canvas animation
  home/MetricStrip.astro               Evidence-backed metrics
  home/AudienceGateway.astro           Hiring and B2B route selector
  projects/ProjectCard.astro           Reusable project summary
  projects/ArchitectureDiagram.astro   Accessible system diagram
  ai/AgenticWorkflow.astro             AI workflow explanation
  commercial/SolutionCard.astro        B2B service presentation
  commercial/CommercialProcess.astro   Discovery-to-scale process
  contact/ContactForm.tsx              Stateful form UX
src/content.config.ts                  Collection schemas and loaders
src/content/projects/*.json            Bilingual, evidence-backed project data
src/content/experience/*.json          Experience entries
src/content/certifications/*.json      Credential entries
src/content/solutions/*.json           Commercial offering entries
src/i18n/locales.ts                     Locale type and routing helpers
src/i18n/ui.ts                          UI dictionaries
src/layouts/BaseLayout.astro            Metadata, hreflang, and global shell
src/lib/contact.ts                      Pure contact validation and payload logic
src/lib/content.ts                      Typed collection query helpers
src/pages/index.astro                   First-visit locale redirect
src/pages/[lang]/index.astro            Localized homepage
src/pages/[lang]/profile.astro          Professional route
src/pages/[lang]/solutions.astro        Commercial route
src/pages/[lang]/projects/index.astro   Project index
src/pages/[lang]/projects/[slug].astro  Localized case study
src/styles/global.css                   Tokens, layout, accessibility, motion
tests/helpers/render.ts                 Shared Astro rendering fixtures
tests/unit/                              Vitest unit tests
tests/integration/                       Astro rendering tests
tests/e2e/                               Playwright journeys and accessibility
```

### Task 1: Astro Foundation and Quality Tooling

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `src/pages/index.astro`
- Create: `src/styles/global.css`
- Create: `tests/unit/foundation.test.ts`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: Node.js `>=22.12.0` and the approved specification.
- Produces: `npm run check`, `npm run test`, `npm run test:e2e`, and `npm run build`; Astro i18n configured for `Locale = 'es' | 'en'` routes.

- [ ] **Step 1: Write the failing foundation test**

```ts
// tests/unit/foundation.test.ts
import { describe, expect, it } from 'vitest';
import pkg from '../../package.json';

describe('project foundation', () => {
  it('exposes the required quality commands', () => {
    expect(pkg.scripts).toMatchObject({
      check: 'astro check',
      test: 'vitest run',
      'test:e2e': 'playwright test',
      build: 'astro build',
    });
  });
});
```

- [ ] **Step 2: Run the test and confirm the missing project failure**

Run: `npm test -- --run tests/unit/foundation.test.ts`

Expected: FAIL because `package.json` and Vitest configuration do not exist.

- [ ] **Step 3: Create the Astro 6 project and testing configuration**

Create `package.json` with scripts `dev`, `check`, `test`, `test:watch`, `test:e2e`, and `build`; require Node `>=22.12.0`. Install Astro, `@astrojs/react`, React, TypeScript, Zod, Vitest, `@astrojs/check`, Playwright, and axe-core. Configure:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

const site = process.env.PUBLIC_SITE_URL ?? 'http://localhost:4321';

export default defineConfig({
  site,
  integrations: [react(), sitemap()],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: true },
  },
});
```

Make `/` redirect with a small inline script to a persisted supported locale, then the browser locale, then `/es/`; include a `<noscript>` link to `/es/` and `/en/`.

Install the pinned major versions used by the plan:

```bash
npm install astro@^6 @astrojs/react@^6 @astrojs/sitemap react react-dom zod @upstash/redis
npm install -D typescript @astrojs/check vitest @playwright/test @axe-core/playwright @types/react @types/react-dom @vercel/node
```

- [ ] **Step 4: Verify foundation commands**

Run: `npm install && npm run test -- --run tests/unit/foundation.test.ts && npm run check && npm run build`

Expected: all commands exit 0 and `dist/es/index.html` plus `dist/en/index.html` are not yet expected until Task 3.

- [ ] **Step 5: Commit the foundation**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json vitest.config.ts playwright.config.ts src/pages/index.astro src/styles/global.css tests/unit/foundation.test.ts .gitignore
git commit -m "build: scaffold bilingual Astro portfolio"
```

### Task 2: Typed Content and Locale Contracts

**Files:**
- Create: `src/i18n/locales.ts`
- Create: `src/i18n/ui.ts`
- Create: `src/content.config.ts`
- Create: `src/lib/content.ts`
- Create: `src/content/projects/smartsense.json`
- Create: `src/content/projects/securapp.json`
- Create: `src/content/projects/project-h.json`
- Create: `src/content/projects/sensor-dashboard.json`
- Create: `src/content/projects/wifi-sensing.json`
- Create: `src/content/projects/gas-dyson.json`
- Create: `src/content/experience/prlcol.json`
- Create: `src/content/experience/ceintecci.json`
- Create: `src/content/certifications/certifications.json`
- Create: `src/content/solutions/solutions.json`
- Create: `tests/unit/locales.test.ts`
- Create: `tests/unit/content.test.ts`

**Interfaces:**
- Consumes: Astro content loaders and Zod.
- Produces: `Locale`, `isLocale(value): value is Locale`, `localizedPath(locale, path): string`, `getProject(slug, locale)`, `getProjects(locale)`, and validated content entries with complete `es` and `en` translations.

- [ ] **Step 1: Write failing locale and content tests**

```ts
// tests/unit/locales.test.ts
import { describe, expect, it } from 'vitest';
import { isLocale, localizedPath } from '../../src/i18n/locales';

describe('locale helpers', () => {
  it('accepts only supported locales', () => {
    expect(isLocale('es')).toBe(true);
    expect(isLocale('en')).toBe(true);
    expect(isLocale('fr')).toBe(false);
  });
  it('preserves a detail path when switching locale', () => {
    expect(localizedPath('en', '/projects/smartsense/')).toBe('/en/projects/smartsense/');
  });
});
```

```ts
// tests/unit/content.test.ts
import { describe, expect, it } from 'vitest';
import { projectSchema } from '../../src/content.config';

describe('project evidence', () => {
  it('rejects a metric without context in either language', () => {
    const result = projectSchema.safeParse({ slug: 'x', title: { es: 'X', en: 'X' }, metrics: [{ value: '51K+' }] });
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run the tests and verify missing-module failures**

Run: `npm run test -- tests/unit/locales.test.ts tests/unit/content.test.ts`

Expected: FAIL because locale helpers and content schemas do not exist.

- [ ] **Step 3: Implement strict locale and content schemas**

Define:

```ts
export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];
export type LocalizedText = Record<Locale, string>;
```

Require every public title, summary, body section, metric label, limitation, CTA, SEO title, and SEO description to contain both locales. Add `visibility: 'public' | 'private-summary' | 'development'`, `featured`, `order`, `evidenceUrl`, and `repositoryUrl` fields. Populate only claims approved by the specification; use `null` for unavailable public links rather than invented URLs.

- [ ] **Step 4: Run schema, type, and build checks**

Run: `npm run test -- tests/unit/locales.test.ts tests/unit/content.test.ts && npm run check`

Expected: PASS; malformed translations and unsupported evidence shapes fail schema validation.

- [ ] **Step 5: Commit typed content**

```bash
git add src/i18n src/content.config.ts src/lib/content.ts src/content tests/unit/locales.test.ts tests/unit/content.test.ts
git commit -m "feat: add bilingual typed portfolio content"
```

### Task 3: Global Shell, Navigation, and SEO

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/layout/Navigation.astro`
- Create: `src/components/layout/Footer.astro`
- Create: `src/pages/[lang]/index.astro`
- Create: `src/pages/[lang]/profile.astro`
- Create: `src/pages/[lang]/solutions.astro`
- Create: `src/pages/[lang]/projects/index.astro`
- Create: `tests/helpers/render.ts`
- Create: `tests/integration/layout.test.ts`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `Locale`, UI dictionary, localized paths.
- Produces: `<BaseLayout lang title description canonicalPath>`, keyboard-accessible navigation, locale-equivalent URLs, canonical and `hreflang` metadata; `renderLocalizedHome(locale)`, `renderCaseStudy(locale, slug)`, `renderProfile(locale)`, and `renderSolutions(locale)` test fixtures.

- [ ] **Step 1: Write the failing rendered-layout test**

```ts
import { AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import BaseLayout from '../../src/layouts/BaseLayout.astro';

it('renders language, canonical, hreflang, and skip link', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(BaseLayout, {
    props: { lang: 'es', title: 'Inicio', description: 'Portafolio', canonicalPath: '/es/' },
  });
  expect(html).toContain('lang="es"');
  expect(html).toContain('hreflang="en"');
  expect(html).toContain('href="#main-content"');
});
```

- [ ] **Step 2: Run and confirm the missing-layout failure**

Run: `npm run test -- tests/integration/layout.test.ts`

Expected: FAIL because `BaseLayout.astro` does not exist.

- [ ] **Step 3: Implement the shell and localized route stubs**

Use semantic landmarks, visible focus styles, a skip link, translated labels, active-route state, and equivalent language links. Include Person JSON-LD with only public contact/profile fields. Generate both locale routes with `getStaticPaths()` and reject unsupported languages using `isLocale`.

Create `tests/helpers/render.ts` with Astro Container wrappers that import the corresponding page component and pass the same `lang`, `slug`, and content props used by static route generation. Export these exact signatures:

```ts
export function renderLocalizedHome(locale: Locale): Promise<string>;
export function renderCaseStudy(locale: Locale, slug: string): Promise<string>;
export function renderProfile(locale: Locale): Promise<string>;
export function renderSolutions(locale: Locale): Promise<string>;
```

- [ ] **Step 4: Verify layout rendering and route generation**

Run: `npm run test -- tests/integration/layout.test.ts && npm run check && npm run build`

Expected: PASS; `dist/es/` and `dist/en/` contain homepage, profile, solutions, and project index pages.

- [ ] **Step 5: Commit the global shell**

```bash
git add src/layouts src/components/layout src/pages src/styles/global.css tests/helpers/render.ts tests/integration/layout.test.ts
git commit -m "feat: add accessible bilingual site shell"
```

### Task 4: Progressive Astronomical Hero

**Files:**
- Create: `src/components/home/SpaceHero.astro`
- Create: `src/components/home/SpaceCanvas.tsx`
- Create: `src/lib/motion.ts`
- Create: `public/images/space-hero-fallback.webp`
- Create: `tests/unit/motion.test.ts`
- Create: `tests/integration/space-hero.test.ts`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: localized hero copy and browser visibility/motion APIs.
- Produces: semantic static hero HTML plus `SpaceCanvas` enhanced with `client:idle`; `shouldAnimate(reducedMotion, visibilityState): boolean`.

- [ ] **Step 1: Write failing motion-policy tests**

```ts
import { describe, expect, it } from 'vitest';
import { shouldAnimate } from '../../src/lib/motion';

describe('space animation policy', () => {
  it.each([
    [true, 'visible', false],
    [false, 'hidden', false],
    [false, 'visible', true],
  ] as const)('reduced=%s visibility=%s => %s', (reduced, visibility, expected) => {
    expect(shouldAnimate(reduced, visibility)).toBe(expected);
  });
});
```

- [ ] **Step 2: Run tests and confirm missing implementation**

Run: `npm run test -- tests/unit/motion.test.ts tests/integration/space-hero.test.ts`

Expected: FAIL because the motion policy and hero do not exist.

- [ ] **Step 3: Implement static-first hero and Canvas enhancement**

Render the heading, description, and both CTAs in Astro. Place fallback artwork behind them. The Canvas component creates a capped star field, two slowly orbiting bodies, and blurred nebula particles; it listens for `visibilitychange`, `matchMedia('(prefers-reduced-motion: reduce)')`, resize, and pointer movement. Cancel `requestAnimationFrame` and remove every listener during cleanup. Cap device pixel ratio at 2 and reduce particle counts below 768 px.

- [ ] **Step 4: Verify policy, server rendering, and build**

Run: `npm run test -- tests/unit/motion.test.ts tests/integration/space-hero.test.ts && npm run check && npm run build`

Expected: PASS; hero text exists in built HTML before JavaScript and reduced-motion tests pass.

- [ ] **Step 5: Commit the hero**

```bash
git add src/components/home/SpaceHero.astro src/components/home/SpaceCanvas.tsx src/lib/motion.ts public/images/space-hero-fallback.webp src/styles/global.css tests/unit/motion.test.ts tests/integration/space-hero.test.ts
git commit -m "feat: add accessible astronomical hero"
```

### Task 5: Homepage Evidence and Audience Gateway

**Files:**
- Create: `src/components/home/MetricStrip.astro`
- Create: `src/components/home/AudienceGateway.astro`
- Create: `src/components/projects/ProjectCard.astro`
- Create: `tests/integration/homepage.test.ts`
- Modify: `src/pages/[lang]/index.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: project content, metric evidence, localized route helpers.
- Produces: homepage sections for metrics, professional/commercial choice, featured projects, AI summary, experience summary, and contextual CTAs.

- [ ] **Step 1: Write the failing homepage content test**

```ts
it('renders contextual metrics and both audience destinations in Spanish', async () => {
  const html = await renderLocalizedHome('es');
  expect(html).toContain('1,5 millones');
  expect(html).toContain('51.000');
  expect(html).toContain('/es/profile/');
  expect(html).toContain('/es/solutions/');
  expect(html).not.toContain('undefined');
});
```

- [ ] **Step 2: Run and confirm missing-section failures**

Run: `npm run test -- tests/integration/homepage.test.ts`

Expected: FAIL because homepage components do not yet render the required sections.

- [ ] **Step 3: Implement evidence and audience sections**

Render the approved metrics with adjacent context links, two equal audience cards, and ordered featured projects. Use cyan accents for professional CTAs and violet accents for commercial CTAs. Never render a metric whose evidence context is absent.

- [ ] **Step 4: Test both languages and build output**

Run: `npm run test -- tests/integration/homepage.test.ts && npm run check && npm run build`

Expected: PASS for Spanish and English; no untranslated keys or unsupported metrics appear.

- [ ] **Step 5: Commit the homepage**

```bash
git add src/components/home src/components/projects/ProjectCard.astro src/pages/[lang]/index.astro src/styles/global.css tests/integration/homepage.test.ts
git commit -m "feat: build evidence-led portfolio homepage"
```

### Task 6: Project Index and Localized Case Studies

**Files:**
- Create: `src/components/projects/ArchitectureDiagram.astro`
- Create: `src/pages/[lang]/projects/[slug].astro`
- Create: `tests/unit/project-routes.test.ts`
- Create: `tests/integration/case-study.test.ts`
- Modify: `src/pages/[lang]/projects/index.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `getProjects(locale)`, `getProject(slug, locale)`, project visibility and evidence fields.
- Produces: static localized routes for every publishable project; `getProjectStaticPaths()` used by route generation and tests.

- [ ] **Step 1: Write failing route and confidentiality tests**

```ts
it('generates both locales for each publishable project', async () => {
  const paths = await getProjectStaticPaths();
  expect(paths).toContainEqual(expect.objectContaining({ params: { lang: 'es', slug: 'smartsense' } }));
  expect(paths).toContainEqual(expect.objectContaining({ params: { lang: 'en', slug: 'smartsense' } }));
});

it('does not render private SecurApp identifiers', async () => {
  const html = await renderCaseStudy('es', 'securapp');
  expect(html).not.toMatch(/Productos Ramo|Petrosantander|Termocartagena/i);
});
```

- [ ] **Step 2: Run and confirm missing-route failures**

Run: `npm run test -- tests/unit/project-routes.test.ts tests/integration/case-study.test.ts`

Expected: FAIL because case-study routing and rendering are absent.

- [ ] **Step 3: Implement index, diagrams, and detail template**

Render problem, context, personal role, architecture, decisions, technologies, results, limitations, gallery, public links, and next evolution. Use accessible HTML/CSS diagrams with text alternatives. Mark development-stage projects visibly and omit repository/demo buttons when URLs are `null`.

- [ ] **Step 4: Verify routes, confidentiality, and unknown slugs**

Run: `npm run test -- tests/unit/project-routes.test.ts tests/integration/case-study.test.ts && npm run check && npm run build`

Expected: PASS; unknown slugs produce no static page and the build contains all twelve locale/project route combinations.

- [ ] **Step 5: Commit case studies**

```bash
git add src/components/projects src/pages/[lang]/projects src/styles/global.css tests/unit/project-routes.test.ts tests/integration/case-study.test.ts
git commit -m "feat: add bilingual engineering case studies"
```

### Task 7: Professional Profile, Agentic AI, and Credentials

**Files:**
- Create: `src/components/ai/AgenticWorkflow.astro`
- Create: `src/components/profile/ExperienceTimeline.astro`
- Create: `src/components/profile/CertificationGrid.astro`
- Create: `public/cv/david-puentes-cv-es.pdf`
- Create: `public/cv/david-puentes-cv-en.pdf`
- Create: `tests/integration/profile.test.ts`
- Modify: `src/pages/[lang]/profile.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: experience and certification collections, approved agentic-AI wording, public CV assets.
- Produces: localized professional profile, experience timeline, AI workflow, skill groups, credential links, and language-matched CV download.

- [ ] **Step 1: Write the failing profile integrity test**

```ts
it('uses calibrated agentic-AI language and the matching CV', async () => {
  const es = await renderProfile('es');
  expect(es).toContain('validación humana');
  expect(es).not.toContain('experto en arquitecturas multiagente en producción');
  expect(es).toContain('/cv/david-puentes-cv-es.pdf');
});
```

- [ ] **Step 2: Run and confirm missing-profile failures**

Run: `npm run test -- tests/integration/profile.test.ts`

Expected: FAIL because profile components and approved CV assets are absent.

- [ ] **Step 3: Implement profile and AI workflow**

Present SecurApp as a confidential enterprise case, the sequence `requirement → research/specification → technical plan → specialized agents → implementation/review → tests/security/human validation → documentation`, grouped skills, education, and certifications. Include computer vision as a technical capability covering image processing, detection, classification, tracking, industrial safety, and camera/alert integration; label it as a capability rather than a validated product until a public case exists. Link credentials when verified; hide long credential IDs from the visual grid. Generate the English CV from approved translated content before adding the asset.

- [ ] **Step 4: Verify copy, downloads, and accessibility**

Run: `npm run test -- tests/integration/profile.test.ts && npm run check && npm run build`

Expected: PASS; both CV links resolve in `dist/cv/`, and prohibited overclaim wording is absent.

- [ ] **Step 5: Commit the professional route**

```bash
git add src/components/ai src/components/profile src/pages/[lang]/profile.astro public/cv src/styles/global.css tests/integration/profile.test.ts
git commit -m "feat: add professional profile and agentic AI story"
```

### Task 8: Commercial Solutions Route

**Files:**
- Create: `src/components/commercial/SolutionCard.astro`
- Create: `src/components/commercial/CommercialProcess.astro`
- Create: `tests/integration/solutions.test.ts`
- Modify: `src/pages/[lang]/solutions.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: three validated solution entries and public case studies.
- Produces: pain-led commercial page, proof links, discovery process, confidentiality statement, and diagnosis CTA.

- [ ] **Step 1: Write the failing offer-scope test**

```ts
it('publishes only evidence-backed initial offers', async () => {
  const html = await renderSolutions('es');
  expect(html).toContain('Monitoreo IoT');
  expect(html).toContain('Trazabilidad de activos');
  expect(html).toContain('Automatización empresarial');
  expect(html).not.toMatch(/producto antifraude listo|predicción logística disponible/i);
});
```

- [ ] **Step 2: Run and confirm missing-commercial-page failure**

Run: `npm run test -- tests/integration/solutions.test.ts`

Expected: FAIL because commercial components are absent.

- [ ] **Step 3: Implement pain-led solutions and engagement model**

For each offer render business pain, deliverable, evidence case, measurable pilot indicators, and limitations. Render `diagnóstico → piloto → medición → escalamiento`, industries served, and a clear statement that ROI is estimated with customer data rather than promised in advance.

- [ ] **Step 4: Verify both locales and claims**

Run: `npm run test -- tests/integration/solutions.test.ts && npm run check && npm run build`

Expected: PASS; only three launch offers appear and future capabilities are labeled as exploration.

- [ ] **Step 5: Commit commercial route**

```bash
git add src/components/commercial src/pages/[lang]/solutions.astro src/styles/global.css tests/integration/solutions.test.ts
git commit -m "feat: add evidence-backed B2B solutions route"
```

### Task 9: Secure Contact Flow

**Files:**
- Create: `src/lib/contact.ts`
- Create: `src/components/contact/ContactForm.tsx`
- Create: `api/contact.ts`
- Create: `src/lib/rate-limit.ts`
- Create: `.env.example`
- Create: `tests/unit/contact.test.ts`
- Create: `tests/integration/contact-api.test.ts`
- Modify: `src/pages/[lang]/profile.astro`
- Modify: `src/pages/[lang]/solutions.astro`

**Interfaces:**
- Consumes: `POST /api/contact` JSON `{ intent, locale, name, email, company?, topic?, message, website? }`; `CONTACT_WEBHOOK_URL`, `UPSTASH_REDIS_REST_URL`, and `UPSTASH_REDIS_REST_TOKEN` server secrets.
- Produces: `validateContact(input): ContactValidationResult`, where `ContactValidationResult = { ok: true; data: ContactPayload } | { ok: false; code: 'invalid' | 'spam' | 'too_large' }`; `ContactResult = { ok: true } | { ok: false; code: 'invalid' | 'spam' | 'too_large' | 'unavailable' }`, plus localized form UI.

- [ ] **Step 1: Write failing validation and abuse tests**

```ts
it.each([
  [{ email: 'bad', message: 'Hola' }, 'invalid'],
  [{ email: 'a@b.co', message: 'x'.repeat(6001) }, 'too_large'],
  [{ email: 'a@b.co', message: 'Necesito ayuda', website: 'bot.example' }, 'spam'],
])('rejects unsafe input', (input, code) => {
  expect(validateContact(input)).toEqual(expect.objectContaining({ ok: false, code }));
});

it('blocks the sixth request from one IP inside ten minutes', async () => {
  const limiter = createRateLimiter(fakeRedis, { limit: 5, windowSeconds: 600 });
  for (let attempt = 1; attempt <= 5; attempt += 1) expect(await limiter.check('203.0.113.8')).toBe(true);
  expect(await limiter.check('203.0.113.8')).toBe(false);
});
```

- [ ] **Step 2: Run and confirm missing-validation failures**

Run: `npm run test -- tests/unit/contact.test.ts tests/integration/contact-api.test.ts`

Expected: FAIL because validation, endpoint, and response contracts do not exist.

- [ ] **Step 3: Implement pure validation, endpoint, and form states**

Use Zod to accept only `intent: 'hiring' | 'business'`, supported locale, normalized email, names up to 120 characters, messages from 20 to 6000 characters, and optional company/topic up to 160 characters. Reject bodies above 16 KiB before parsing, reject non-JSON content, discard honeypot submissions, and allow five accepted attempts per IP per ten-minute window through Upstash Redis. Forward only validated fields to `CONTACT_WEBHOOK_URL`, set no-store headers, and never return provider or rate-limit details. The form preserves non-sensitive visible fields on network failure and offers the public email fallback.

- [ ] **Step 4: Verify success, failure, and provider outage paths**

Run: `npm run test -- tests/unit/contact.test.ts tests/integration/contact-api.test.ts && npm run check && npm run build`

Expected: PASS; the mocked provider is not called for invalid, oversized, or honeypot submissions.

- [ ] **Step 5: Commit contact flow**

```bash
git add src/lib/contact.ts src/lib/rate-limit.ts src/components/contact/ContactForm.tsx api/contact.ts .env.example src/pages/[lang]/profile.astro src/pages/[lang]/solutions.astro tests/unit/contact.test.ts tests/integration/contact-api.test.ts
git commit -m "feat: add validated portfolio contact flow"
```

### Task 10: End-to-End Journeys, Accessibility, and Release Documentation

**Files:**
- Create: `tests/e2e/hiring-journey.spec.ts`
- Create: `tests/e2e/business-journey.spec.ts`
- Create: `tests/e2e/accessibility.spec.ts`
- Create: `tests/e2e/reduced-motion.spec.ts`
- Create: `README.md`
- Create: `docs/content-safety-checklist.md`
- Create: `vercel.json`
- Modify: `package.json`

**Interfaces:**
- Consumes: the complete built site and `/api/contact` contract.
- Produces: release gate `npm run verify` executing unit, integration, type, build, and end-to-end suites; documented deployment and content-safety process.

- [ ] **Step 1: Write failing user-journey and accessibility tests**

```ts
test('English hiring visitor reaches the matching CV', async ({ page }) => {
  await page.goto('/en/');
  await page.getByRole('link', { name: /hire david/i }).click();
  await expect(page).toHaveURL(/\/en\/profile\//);
  await expect(page.getByRole('link', { name: /download cv/i })).toHaveAttribute('href', /cv-en\.pdf$/);
});

test('reduced motion disables the animated canvas', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/es/');
  await expect(page.locator('canvas[data-space-animation]')).toHaveAttribute('data-running', 'false');
});
```

- [ ] **Step 2: Run E2E tests and record concrete failures**

Run: `npm run build && npm run test:e2e`

Expected: FAIL on any remaining route label, accessibility, motion-state, responsive, or form-contract mismatch.

- [ ] **Step 3: Fix surfaced product defects and document release operations**

Add `npm run verify` as `npm run test && npm run check && npm run build && npm run test:e2e`. Document setup, environment variables, local commands, content editing, Vercel deployment, custom-domain replacement, and rollback. The content-safety checklist must require secret scanning, customer-name review, image/logo review, metric-evidence review, link verification, and approval before every case-study publication.

- [ ] **Step 4: Run the full release gate**

Run: `npm run verify`

Expected: all tests pass; build produces both language trees; axe reports no serious or critical violations; hiring and business journeys complete at mobile and desktop viewports.

- [ ] **Step 5: Perform production-preview checks**

Run: `npx vercel build`

Expected: Vercel build exits 0, recognizes the contact function, and emits the static Astro site without secrets in generated assets.

- [ ] **Step 6: Commit release readiness**

```bash
git add tests/e2e README.md docs/content-safety-checklist.md vercel.json package.json package-lock.json
git commit -m "test: add portfolio release gate"
```

## Final Verification

- [ ] Run `npm run verify` from a clean checkout.
- [ ] Inspect `dist/` for accidental client-side secrets and private customer terms.
- [ ] Test `/es/`, `/en/`, both profile pages, both solution pages, all case studies, both CV downloads, and both contact intents in a Vercel preview.
- [ ] Confirm the static fallback and reduced-motion experience on desktop and mobile.
- [ ] Run a broken-link scan against the preview URL.
- [ ] Obtain David's approval for public images, case-study copy, metrics, credential links, CV files, and final domain before production deployment.
