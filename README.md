# David Puentes — Portfolio

Bilingual professional and commercial portfolio built with Astro, React, TypeScript, and a lightweight Canvas space scene. It presents engineering case studies, an employment-focused profile, B2B pilot offers, and a protected contact flow.

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

## Content updates

Projects, experience, certifications, and commercial offers live under `src/content`. Keep claims evidence-based and run through [the content-safety checklist](docs/content-safety-checklist.md) before publishing.

The Spanish CV is the source document supplied by David. Regenerate the English PDF after editing `scripts/generate-cv-en.mjs` with `node scripts/generate-cv-en.mjs`.
