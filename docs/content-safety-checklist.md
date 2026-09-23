# Content safety checklist

Use this checklist before publishing a case study, metric, image, or employer reference.

## Every publication

- Confirm that every number has a source and retains its context (measured, estimated, target, or lower bound). Metrics in `src/content/projects/*.json` require a bilingual `label` and `context`; the home metric strip links each figure to its case.
- Do not imply production scale, commercial readiness, or expertise beyond the available evidence.
- Remove client and partner logos, branded photographs, internal screenshots, credentials, personal data, and confidential architecture details.
- Describe private work through personal responsibility, technical decisions, permitted outcomes, and anonymized diagrams.
- Verify repository visibility before linking it. A missing repository link is preferable to exposing private code.
- Confirm that Spanish and English express the same claim and limitations. English is written for the professional context, not translated literally.
- Keep PRLCOL customer names anonymous unless there is explicit written authorization; describe only their industry.
- Distinguish reconstruction from greenfield work: contractor management and evaluation were rebuilt; action plans, visits, and the global role/permission model were built from scratch; the two PTW implementations had different starting points.
- Recheck dates, employment status, certification status, and contact details.
- Run `npm run verify` and inspect desktop and mobile layouts before deployment.

## Wording rules (enforced by `tests/unit/content.test.ts`)

- Never name SecurApp customers or the SmartSense partner company. Use sectors instead: food manufacturing, energy, oil and gas, engineering and industrial services.
- The name denylist is not stored in this repository (it is public). The confidentiality test reads it from the `CONTENT_DENYLIST` environment variable: case-insensitive regex patterns separated by `|` (for example `\bAcme\b|Partner Co`). Locally, put the real list in `.env` (gitignored; `.env.example` shows the empty key) — the test reads that file directly when the variable is not set. In CI, define `CONTENT_DENYLIST` as a repository secret. When the variable is empty or absent the test is skipped, so a green run without it proves nothing about names.
- The 987 commits are an eight-week figure (June–July 2026), never a yearly one.
- The platform is "multi-instance", not "multi-tenant".
- The contextual AI assistant is an "LLM integration (Gemini API)", never "AI model development".
- SmartSense: 688 m is a lower bound; PDR and battery life are estimates; field agreement is not metrological calibration; the dashboard shown is the neutral replica.
- Testing: automated smoke tests and unit suites at PRLCOL are a next step, not current practice. Do not claim them.
- Cloud: Terraform is a certification "in strengthening"; there is no AWS production experience.

## Visibility levels

- `public`: code or demo can be linked. Sensor Dashboard, WiFi Sensing, Gas Dyson, SmartSense (team repository, publicly available).
- `private-summary`: no code, screenshots, demo, or customer names. `images` must stay empty. SecurApp, PTW, contextual AI assistant, GPS telemetry.
- `development`: only verified results; everything else is roadmap. WiFi Sensing, Gas Dyson.
- Project H stays unlinked until the fixed API key in Cloud Functions is rotated and the admin/test endpoints are protected.

## Images

- Only under `public/images/projects/`, with bilingual `alt` text and, ideally, a `caption` and intrinsic `width`/`height`.
- Open every image before publishing and confirm it shows no company name, logo, location, or identifiable asset. SmartSense installation photos are never published; the neutral Docker replica and the scoped architecture diagram are the only approved figures.

## CV

- `public/cv/david-puentes-cv-es.pdf` is David's own document, supplied as-is. By David's decision it does name SecurApp customers (see the context document, §2: brand recognition for Colombian recruiters). It is never regenerated or edited here; only David replaces it.
- The confidentiality test in `tests/unit/content.test.ts` covers JSON content, pages, `ui.ts`, and `scripts/generate-cv-en.mjs`. It does not inspect PDFs, so the Spanish CV is outside its scope by design.
- The English CV is generated from `scripts/generate-cv-en.mjs` with `node scripts/generate-cv-en.mjs`; keep it free of customer names and state SmartSense roles per the article's CRediT statement.

## SmartSense attribution

- Roles follow the CRediT statement in the HardwareX manuscript: David = conceptualization, hardware, software, validation, data curation, writing (review and editing); co-author = conceptualization, methodology, software, investigation, writing (original draft). Repository history supports David as primary author of `hardware/`, `docker/`, and `analisis/`.
- Status: thesis delivered; HardwareX article in preparation, not submitted, no DOI.
- Link availability (97.8–98.4 %) is conditioned on inferred gateway-active periods; PDR is 95.3–96.6 % during active periods. Quote the ranges exactly or as "≈96 %".
