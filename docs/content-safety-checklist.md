# Content safety checklist

Use this checklist before publishing a case study, metric, image, or employer reference.

## Every publication

- Confirm that every number has a source and retains its context (measured, estimated, target, or lower bound). Metrics in `src/content/projects/*.json` require a bilingual `label` and `context`; the home metric strip links each figure to its case.
- Do not imply production scale, commercial readiness, or expertise beyond the available evidence.
- Remove client and partner logos, branded photographs, internal screenshots, credentials, personal data, and confidential architecture details.
- Describe private work through personal responsibility, technical decisions, permitted outcomes, and anonymized diagrams.
- Verify repository visibility before linking it. A missing repository link is preferable to exposing private code.
- Confirm that Spanish and English express the same claim and limitations. English is written for the professional context, not translated literally.
- Recheck dates, employment status, certification status, and contact details.
- Run `npm run verify` and inspect desktop and mobile layouts before deployment.

## Wording rules (enforced by `tests/unit/content.test.ts`)

- Never name SecurApp customers or the SmartSense partner company. Use sectors instead: food manufacturing, energy, oil and gas, engineering and industrial services.
- The 987 commits are an eight-week figure (June–July 2026), never a yearly one.
- The platform is "multi-instance", not "multi-tenant".
- magIA is an "LLM integration (Gemini API)", never "AI development".
- SmartSense: 688 m is a lower bound; PDR and battery life are estimates; field agreement is not metrological calibration; the dashboard shown is the neutral replica.
- Testing: automated smoke tests and unit suites at PRLCOL are a next step, not current practice. Do not claim them.
- Cloud: Terraform is a certification "in strengthening"; there is no AWS production experience.

## Visibility levels

- `public`: code or demo can be linked. Sensor Dashboard, WiFi Sensing, Gas Dyson, SmartSense (team repository, publicly available).
- `private-summary`: no code, screenshots, demo, or customer names. `images` must stay empty. SecurApp, PTW, magIA, GPS telemetry.
- `development`: only verified results; everything else is roadmap. WiFi Sensing, Gas Dyson.
- Project H stays unlinked until the fixed API key in Cloud Functions is rotated and the admin/test endpoints are protected.

## Images

- Only under `public/images/projects/`, with bilingual `alt` text and, ideally, a `caption` and intrinsic `width`/`height`.
- Open every image before publishing and confirm it shows no company name, logo, location, or identifiable asset. SmartSense installation photos are never published; the neutral Docker replica and the scoped architecture diagram are the only approved figures.

## CV

- `public/cv/david-puentes-cv-es.pdf` is David's own document and is never regenerated here.
- The English CV is generated from `scripts/generate-cv-en.mjs` with `node scripts/generate-cv-en.mjs`; keep it free of customer names.
