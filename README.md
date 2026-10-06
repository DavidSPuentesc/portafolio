# David Puentes — Portfolio

Bilingual professional and commercial portfolio built with Astro, React, TypeScript, and a lightweight Canvas space scene. It presents engineering case studies, an employment-focused profile, B2B pilot offers backed by delivered work, and an optional Formspree contact flow.

## Local development

Requirements: Node.js 22.12 or newer.

```bash
npm install
npm run dev
```

Run the complete release gate with:

```bash
npm run verify
```

## Firebase deployment

The static Astro build is deployed to Firebase Hosting on the Spark plan. The Firebase project is isolated from unrelated applications.

1. Copy `.env.example` to `.env` and replace `your-form-id` with the ID from a Formspree form.
2. Set `PUBLIC_SITE_URL` to the production Firebase URL when generating canonical URLs and the sitemap.
3. Authenticate with `firebase login`, select the project declared in `.firebaserc`, and deploy.

```bash
npm run firebase:preview
npm run deploy:firebase
```

`PUBLIC_CONTACT_FORM_ENDPOINT` is intentionally public because Formspree form endpoints are browser-facing. The application accepts only HTTPS endpoints under `formspree.io/f/`. Without a valid endpoint, the contact area shows the public email instead of rendering a broken form.

## Content model

All content lives under `src/content` as JSON validated by the Zod schemas in `src/content.config.ts`:

- `projects/*.json`: one case study each. `order` drives the listing, `featured` selects the home page cases, and `visibility` is `public` (code or demo linkable), `private-summary` (no code, screenshots, or customer names), or `development` (only verified results). Optional `sector`, `period`, `metrics` (value + bilingual label + context), `images` (under `public/images/projects/`, with bilingual `alt`) and `repositoryLabel`.
- `experience/*.json`: employment entries with `location`, bilingual highlights, and headline `metrics`.
- `solutions/solutions.json`: the three B2B lines, each with `proof` (delivered work that backs the offer) and `pilotMetrics`, plus the served `sectors`.
- `certifications/certifications.json`: credentials grouped by category.

`tests/unit/content.test.ts` validates every file against the schema, enforces the agreed order, and rejects customer names when `CONTENT_DENYLIST` is configured (see `.env.example`; the check is skipped otherwise). Keep claims evidence-based and run through [the content-safety checklist](docs/content-safety-checklist.md) before publishing.

## CVs

Regenerate the Spanish and English PDFs after editing their source scripts with:

```bash
node scripts/generate-cv-es.mjs
node scripts/generate-cv-en.mjs
```
