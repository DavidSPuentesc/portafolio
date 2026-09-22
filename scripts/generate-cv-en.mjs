import { chromium } from 'playwright';
import { resolve } from 'node:path';

// English CV. Source of truth: the Spanish CV supplied by David plus his documented professional context.
// Rules: no customer names, 987 commits are an 8-week figure, "multi-instance" (not multi-tenant),
// "LLM integration" (not AI development), cloud is not inflated.
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
@page{size:A4;margin:12mm 14mm}*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;color:#10182b;margin:0;font-size:9.6pt;line-height:1.36}
h1{font-size:24pt;margin:0;color:#071127;letter-spacing:-.02em}h2{font-size:10.5pt;text-transform:uppercase;letter-spacing:.12em;color:#315db7;border-bottom:1px solid #cbd6ec;padding-bottom:3px;margin:13px 0 6px}
h3{font-size:10.5pt;margin:8px 0 1px}.lead{font-size:10.5pt;color:#3e4a63;margin:3px 0}.meta{color:#52617d;margin:2px 0 0}.row{display:flex;justify-content:space-between;align-items:baseline;gap:12px}.row span{color:#52617d;white-space:nowrap}
ul{margin:3px 0 6px;padding-left:16px}li{margin-bottom:2px}.tags{color:#263a67}.tags strong{color:#16284d}.small{font-size:8.8pt}a{color:#244f9e;text-decoration:none}p{margin:3px 0}
</style></head><body>
<h1>David Santiago Puentes Cárdenas</h1>
<p class="lead">Full-Stack Software Developer · B2B SaaS · IoT & Applied AI</p>
<p class="meta">Bogotá, Colombia · <a href="mailto:davidsantiago.puentesc@gmail.com">davidsantiago.puentesc@gmail.com</a> · <a href="https://github.com/DavidSPuentesc">github.com/DavidSPuentesc</a> · <a href="https://www.linkedin.com/in/david-santiago-puentes-c%C3%A1rdenas-914815186/">LinkedIn</a></p>

<h2>Profile</h2>
<p>Full-stack developer and electronic-engineering student with more than two years of professional experience building, integrating, and supporting products used by real companies. At PRLCOL, on the team behind SecurApp (its multi-instance B2B SaaS platform), I own the full delivery cycle — requirements, design, development, SQL migrations, deployment, and support — for 7 enterprise customers of a multi-instance B2B SaaS platform, with continuous deployment to production. My electronics background lets me work from firmware and binary protocols (LoRa, BLE, Teltonika) up to the web dashboard. I integrate LLMs into products with cost controls and use AI-first tooling (Claude Code, opencode) with human review before every deployment.</p>

<h2>Experience</h2>
<div class="row"><h3>Full-Stack Software Developer & Data Analyst · PRLCOL</h3><span>Aug 2025 — present · Tocancipá, Colombia</span></div>
<ul>
<li>On the SecurApp team (PRLCOL’s multi-instance B2B SaaS platform, built by a team), own the full cycle for 7 enterprise customers (food manufacturing, energy, oil and gas, engineering) for operations and workplace-safety management: each customer has its own subdomain, database, branding, and deployment.</li>
<li>Designed and shipped end to end a high-risk work-permit system: Planning → Approval → Execution → Closure flow, digital signatures drawn on the actual PDF (pdf.js + canvas), remote signing through single-use tokenized links with email OTP, two-level drafts, and a signature lock; in live operation at two industrial plants (~340 commits).</li>
<li>Integrated an LLM assistant (Gemini API) over operational data: contextual chat, predictive reports, per-module and per-month context, a monthly token cap per company, an attempt log, a support panel, and prompt-injection defenses.</li>
<li>Built, as sole author, the platform’s GPS telemetry module, deployed to 4 customers: a custom TCP server in PHP decoding the Teltonika Codec 8/8E binary protocol, Traccar-compatible HTTP ingestion from an Android app, OSRM map-matching, Leaflet geofences, reverse geocoding, alerts, consent records, and Excel/PDF reports (~55,000 lines).</li>
<li>Built from scratch a public QR self-registration flow for visitors and contractors (digital badge, validity by date and site, gate verification) on a layered architecture of my own: thin controllers, services, repositories with prepared statements, and authentication, CSRF, and rate-limiting middleware.</li>
<li>Delivered bulk Excel imports with validation and idempotent upserts, dynamic per-module and per-action permissions, branded Excel/PDF generation (PhpSpreadsheet, Dompdf), and HTML transactional email on every state transition; datasets of more than 1.5 million records.</li>
<li>Hardened authentication across 5 production instances (bcrypt unification, session-collision fix) and applied prepared statements, CSRF protection, rate limiting, upload sanitization, and credential-incident handling platform-wide.</li>
<li>Led the dashboard redesign and design system replicated across 4 customers, and ported complete modules between instances without breaking production.</li>
<li>Shipped 987 production commits across 8 repositories in 8 weeks (Jun–Jul 2026) and 47 versioned, zero-downtime SQL migrations, using a staging branch per customer, granular commits tied to kanban cards, customer-approved batch PRs, webhook deployment, and git revert as rollback.</li>
</ul>
<div class="row"><h3>Research & Development Developer · Universidad ECCI / CEINTECCI</h3><span>Jun 2024 — Jun 2025 · Bogotá, Colombia</span></div>
<ul>
<li>Co-developed GenACT, an executable Python library for stylometric analysis of Greek lyric texts using genetic algorithms. <strong>Patent granted</strong> for genetic algorithms applied to stylometric analysis.</li>
<li>Built reproducible extraction, cleaning, normalization, and analysis pipelines over roughly 2 million syllables of research datasets.</li>
<li>Developed and maintained the center's science-outreach site with Astro, TypeScript, React, and Tailwind CSS.</li>
<li>Supported methodology, results analysis, academic documentation, and research-derived products.</li>
</ul>

<h2>Selected Projects</h2>
<h3>SmartSense Monitoring — industrial thermal monitoring (thesis, two-author team)</h3>
<p>Three-wire PT100 + MAX31865 nodes on XIAO ESP32-C6 with LoRa 433 MHz, a gateway with touch display and local dashboard, and a neutral Docker/Flask/SQLite replica. 3 nodes, 51,338 samples, up to 32 days of records, estimated PDR 95.3–96.6% in active periods, and a link demonstrated at 688 m through obstacles (lower bound). Open hardware (CERN-OHL-S v2 / MIT / CC-BY 4.0). Thesis delivered; HardwareX article in preparation, not yet submitted. CRediT roles: conceptualization, hardware, software, validation, data curation, and review and editing; primary author of the hardware design, the Docker replica, and the analysis scripts by repository history.</p>
<h3>Sensor Dashboard — public IoT system (MIT)</h3>
<p>MicroPython nodes with LoRa (sx127x) → gateway → Flask API → PostgreSQL (Neon) → Next.js + TypeScript + Tailwind dashboard on Vercel, built alone. Public evidence of React, Next.js, TypeScript, and PostgreSQL work.</p>
<h3>Project H — room and asset security</h3>
<p>BLE nodes with a custom binary protocol (opcodes, ACK, timeouts), an ESP32 master with a physical alarm and an embedded async web server, a Firebase Auth web app, and Cloud Functions + Cloud Messaging push notifications for a public hospital. Prototype stage.</p>

<h2>Technical Skills</h2>
<p class="tags"><strong>Backend:</strong> PHP 7.1–8.x (mysqli/PDO, transactions), Python (Flask, pandas/NumPy, SciPy), Node.js (Firebase Cloud Functions), REST APIs, TCP sockets and binary protocols, CLI daemons, layered MVC/SOLID without frameworks<br>
<strong>Frontend:</strong> JavaScript ES6, jQuery, Chart.js, DataTables, Leaflet, pdf.js, jSignature, Service Workers, Web Push (VAPID); TypeScript, React, Next.js, Astro, Tailwind CSS (public projects)<br>
<strong>Databases:</strong> MySQL/MariaDB, PostgreSQL, SQLite; relational modeling, indexes, versioned and idempotent migrations, data cleaning and validation<br>
<strong>Electronics & IoT:</strong> ESP32 (C6, S3), C/C++ (Arduino, ESP-IDF), MicroPython, LoRa, BLE, PT100/MAX31865, deep sleep and battery life, KiCad<br>
<strong>Integrations:</strong> Gemini API, Firebase (Auth, Firestore, Messaging), ZeptoMail/SendGrid/PHPMailer, OSRM, Traccar/Teltonika, SUIN API, QR generation, Dompdf, PhpSpreadsheet<br>
<strong>Delivery & operations:</strong> Git/GitHub (staging → main, batch PRs, revert as rollback), webhook-driven continuous deployment, Docker, Linux, Composer, Laragon; Terraform certification (strengthening)<br>
<strong>AI-first workflow:</strong> Claude Code, opencode; specs before code, plans, subagents, skills, MCP, token budgets, the assistant as a reviewing pair on diffs, and human validation before production<br>
<strong>Quality & security:</strong> root-cause debugging, exploratory testing in staging, prepared statements, CSRF, rate limiting, bcrypt, session control, credential handling</p>

<h2>Education & Certifications</h2>
<p class="small">Electronic Engineering — Universidad ECCI, Bogotá (in progress) · Technologist in Industrial Electronics — Universidad ECCI (2023) · English B2 — Centro de Lenguas, Universidad ECCI (2025)<br>
AI Application Development · React.js with TypeScript · TypeScript · Terraform · Cybersecurity and Privacy for Businesses — Platzi (2026)<br>
Scientific Computing with Python · Responsive Web Design — freeCodeCamp (2025)</p>
</body></html>`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'load' });
await page.pdf({ path: resolve('public/cv/david-puentes-cv-en.pdf'), format: 'A4', printBackground: true });
await browser.close();
console.log('Generated public/cv/david-puentes-cv-en.pdf');
