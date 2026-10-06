import { chromium } from 'playwright';
import { resolve } from 'node:path';

const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
@page{size:A4;margin:13mm 15mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#172033;font-size:9.4pt;line-height:1.34;margin:0}h1{font-size:22pt;margin:0;color:#091326}h2{font-size:12pt;color:#075985;border-bottom:1px solid #94a3b8;margin:12px 0 5px;padding-bottom:2px}h3{font-size:10pt;margin:6px 0 1px}.head{display:flex;justify-content:space-between;gap:18px}.contact{text-align:right;font-size:8.5pt}.row{display:flex;justify-content:space-between;align-items:baseline;gap:12px}.row span{white-space:nowrap;color:#475569;font-size:8.5pt}p{margin:3px 0}ul{margin:3px 0 6px;padding-left:17px}li{margin:2px 0}.tags{font-size:8.7pt}.small{font-size:8.3pt;color:#334155}a{color:#075985;text-decoration:none}
</style></head><body>
<div class="head"><div><h1>David Santiago Puentes</h1><p><strong>Desarrollador Full-Stack · IA aplicada · Electrónica e IoT</strong></p></div><div class="contact">Bogotá, Colombia<br>davidsantiago.puentesc@gmail.com<br><a href="https://github.com/DavidSPuentesc">github.com/DavidSPuentesc</a><br><a href="https://david-puentes-portafolio.web.app">Portafolio</a></div></div>

<h2>Perfil</h2>
<p>Desarrollador full-stack con más de dos años de experiencia profesional y formación en Ingeniería Electrónica. Trabajo con aplicaciones web, APIs, bases de datos, automatización, firmware e IoT. Utilizo agentes, subagentes, skills, MCP y presupuestos de tokens con validación humana. Los detalles técnicos demostrables se respaldan con proyectos públicos; la experiencia laboral se presenta respetando obligaciones de confidencialidad.</p>

<h2>Experiencia profesional</h2>
<div class="row"><h3>Desarrollador Full-Stack · Empresa privada de soluciones tecnológicas</h3><span>Ago. 2025 — 2026 · Colombia</span></div>
<ul>
<li>Desarrollo y mantenimiento de aplicaciones web full-stack dentro de un equipo de tecnología.</li>
<li>Trabajo con interfaces, APIs, bases de datos relacionales, autenticación, autorización y prácticas de desarrollo seguro.</li>
<li>Participación en requerimientos, implementación, despliegue, soporte y mejora continua de software empresarial.</li>
</ul>
<div class="row"><h3>Investigador y desarrollador · CEINTECCI</h3><span>2023 — 2025 · Colombia</span></div>
<ul>
<li>Investigación aplicada en software científico, electrónica, sensórica, comunicaciones inalámbricas e IoT.</li>
<li>Desarrollo de procesos reproducibles para adquisición, limpieza, análisis y visualización de datos.</li>
<li>Participación en trabajo de innovación con patente concedida y divulgación científica.</li>
</ul>

<h2>Proyectos públicos seleccionados</h2>
<h3>SmartSense — monitoreo industrial LoRa e IoT</h3><p>Sensores PT100/MAX31865, nodos ESP32, comunicación LoRa, gateway y dashboard histórico local. Proyecto de grado desarrollado en equipo con repositorio y evidencia pública.</p>
<h3>Sensor Dashboard — plataforma IoT web</h3><p>Cadena MicroPython y LoRa → API Flask → PostgreSQL → dashboard Next.js, TypeScript y Tailwind. Proyecto público desarrollado de extremo a extremo.</p>
<h3>Project H — seguridad de habitaciones y activos</h3><p>Nodos BLE, protocolo binario propio, maestro ESP32 con alarma física y aplicación web con Firebase. Prototipo documentado.</p>

<h2>Competencias técnicas</h2>
<p class="tags"><strong>Backend:</strong> PHP, Python, Node.js, APIs REST, Flask, modelado relacional<br><strong>Frontend:</strong> JavaScript, TypeScript, React, Next.js, Astro, Tailwind CSS<br><strong>Datos:</strong> MySQL/MariaDB, PostgreSQL, SQLite, pandas, NumPy, SciPy<br><strong>Electrónica e IoT:</strong> ESP32, C/C++, MicroPython, LoRa, BLE, PT100/MAX31865, KiCad<br><strong>Entrega y seguridad:</strong> Git/GitHub, Docker, Linux, pruebas automatizadas, autenticación, autorización, CSRF y limitación de solicitudes<br><strong>IA:</strong> agentes y subagentes, skills, MCP, presupuestos de tokens, control de contexto y revisión humana</p>

<h2>Educación y certificaciones</h2>
<p class="small">Ingeniería Electrónica — Universidad ECCI (en curso) · Tecnólogo en Electrónica Industrial — Universidad ECCI (2023) · Inglés B2 — Universidad ECCI (2025)<br>Desarrollo de Aplicaciones con IA · React.js con TypeScript · TypeScript · Terraform · Ciberseguridad y Privacidad para Empresas — Platzi (2026)<br>Scientific Computing with Python · Responsive Web Design — freeCodeCamp (2025)</p>
</body></html>`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'load' });
await page.pdf({ path: resolve('public/cv/david-puentes-cv-es.pdf'), format: 'A4', printBackground: true });
await browser.close();
console.log('Generated public/cv/david-puentes-cv-es.pdf');
