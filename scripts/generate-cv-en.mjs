import { chromium } from 'playwright';
import { resolve } from 'node:path';

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
@page{size:A4;margin:13mm 15mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#172033;font-size:9.4pt;line-height:1.34;margin:0}h1{font-size:22pt;margin:0;color:#091326}h2{font-size:12pt;color:#075985;border-bottom:1px solid #94a3b8;margin:12px 0 5px;padding-bottom:2px}h3{font-size:10pt;margin:6px 0 1px}.head{display:flex;justify-content:space-between;gap:18px}.contact{text-align:right;font-size:8.5pt}.row{display:flex;justify-content:space-between;align-items:baseline;gap:12px}.row span{white-space:nowrap;color:#475569;font-size:8.5pt}p{margin:3px 0}ul{margin:3px 0 6px;padding-left:17px}li{margin:2px 0}.tags{font-size:8.7pt}.small{font-size:8.3pt;color:#334155}a{color:#075985;text-decoration:none}
</style></head><body>
<div class="head"><div><h1>David Santiago Puentes</h1><p><strong>Data Engineering and Applied AI · Software, IoT, and Electronics</strong></p></div><div class="contact">Bogotá, Colombia<br>davidsantiago.puentesc@gmail.com<br><a href="https://github.com/DavidSPuentesc">github.com/DavidSPuentesc</a><br><a href="https://david-puentes-portafolio.web.app">Portfolio</a></div></div>

<h2>Profile</h2>
<p>Data and applied-AI-oriented software and IoT engineer with more than two years of professional full-stack experience and an electronic-engineering background. I work from sensors and firmware through datasets, analysis, APIs, databases, and web products. I use agents, subagents, skills, MCP, and token budgets with human validation. Employment experience is presented in accordance with confidentiality obligations.</p>

<h2>Professional Experience</h2>
<div class="row"><h3>Full-Stack Developer · Private technology-solutions company</h3><span>Aug 2025 — 2026 · Colombia</span></div>
<ul>
<li>Built and rebuilt modules for a multi-company platform: contractors, document requirements, access, visits, work permits, audits, and action plans.</li>
<li>Integrated mobile/GPS telemetry, real-time location, geofences, and alerts; relational modeling, roles, authentication, MVC, and SOLID.</li>
<li>Modernized navigation and security; implemented, deployed, and evolved business applications.</li>
</ul>
<div class="row"><h3>Research and Development Developer · CEINTECCI</h3><span>2023 — 2025 · Colombia</span></div>
<ul>
<li>Conducted applied work in scientific software, electronics, sensing, wireless communications, and IoT.</li>
<li>Developed reproducible processes for data acquisition, cleaning, analysis, and visualization.</li>
<li>Co-author of GenATC, registered scientific software: genetic algorithms and processing of approximately two million syllables.</li>
</ul>

<h2>Selected Public Projects</h2>
<h3>SmartSense — LoRa and industrial IoT monitoring</h3><p>PT100/MAX31865 sensors, ESP32 nodes, LoRa communications, a gateway, and a local historical dashboard. Team thesis project with a public repository and evidence.</p>
<h3>Sensor Dashboard — web IoT platform</h3><p>MicroPython and LoRa → Flask API → PostgreSQL → Next.js, TypeScript, and Tailwind dashboard. Public end-to-end project.</p>
<h3>WiFi Sensing — reproducible CSI research</h3><p>ESP32-S3 CSI capture, labeled datasets, live/replay visualization, and a baseline with cross-session validation. Negative results and their limitations are documented publicly.</p>

<h2>Technical Skills</h2>
<p class="tags"><strong>Data:</strong> Python, pandas, NumPy, SciPy, scikit-learn, dataset preparation, and experimental validation<br><strong>Backend:</strong> PHP, Python, Node.js, REST APIs, Flask, MySQL/MariaDB, PostgreSQL, and SQLite<br><strong>Frontend:</strong> JavaScript, TypeScript, React, Next.js, Astro, Tailwind CSS<br><strong>Electronics and IoT:</strong> ESP32, ESP-IDF, C/C++, MicroPython, LoRa, BLE, Wi-Fi CSI, PT100/MAX31865<br><strong>Delivery and security:</strong> Git/GitHub, Docker, Linux, automated tests, authentication, authorization, CSRF, and request limiting<br><strong>AI:</strong> agents and subagents, skills, MCP, token budgets, context control, and human review</p>

<h2>Education and Certifications</h2>
<p class="small">Electronic Engineering — Universidad ECCI (in progress) · Technologist in Industrial Electronics — Universidad ECCI (2023) · English B2 — Universidad ECCI (2025)<br>AI Application Development · React.js with TypeScript · TypeScript · Terraform · Cybersecurity and Privacy for Businesses — Platzi (2026)<br>Scientific Computing with Python · Responsive Web Design — freeCodeCamp (2025)</p>
</body></html>`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'load' });
await page.pdf({ path: resolve('public/cv/david-puentes-cv-en.pdf'), format: 'A4', printBackground: true });
await browser.close();
console.log('Generated public/cv/david-puentes-cv-en.pdf');
