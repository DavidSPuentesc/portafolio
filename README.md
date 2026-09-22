# David Puentes — Portfolio

Bilingual professional and commercial portfolio built with Astro, React, TypeScript, and a lightweight Canvas space scene. It presents engineering case studies, an employment-focused profile, B2B pilot offers backed by delivered work, and a protected contact flow.

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

## Deployment

The project targets Vercel. Import the repository, keep the Astro defaults, and configure these server-only variables from `.env.example`:

- `CONTACT_WEBHOOK_URL`: private endpoint that receives validated contact data.
- `UPSTASH_REDIS_REST_URL`: Upstash REST URL used for rate limiting.
- `UPSTASH_REDIS_REST_TOKEN`: corresponding private token.

Never expose these variables with a `PUBLIC_` prefix. The static site works without them, but contact submissions return a safe unavailable state until configured.

## Content model

All content lives under `src/content` as JSON validated by the Zod schemas in `src/content.config.ts`:

- `projects/*.json`: one case study each. `order` drives the listing, `featured` selects the home page cases, and `visibility` is `public` (code or demo linkable), `private-summary` (no code, screenshots, or customer names), or `development` (only verified results). Optional `sector`, `period`, `metrics` (value + bilingual label + context), `images` (under `public/images/projects/`, with bilingual `alt`) and `repositoryLabel`.
- `experience/*.json`: employment entries with `location`, bilingual highlights, and headline `metrics`.
- `solutions/solutions.json`: the three B2B lines, each with `proof` (delivered work that backs the offer) and `pilotMetrics`, plus the served `sectors`.
- `certifications/certifications.json`: credentials grouped by category.

`tests/unit/content.test.ts` validates every file against the schema, enforces the agreed order, and rejects customer names. Keep claims evidence-based and run through [the content-safety checklist](docs/content-safety-checklist.md) before publishing.

## CVs

The Spanish CV is the source document supplied by David and is never regenerated here. Regenerate the English PDF after editing `scripts/generate-cv-en.mjs` with:

```bash
node scripts/generate-cv-en.mjs
```
