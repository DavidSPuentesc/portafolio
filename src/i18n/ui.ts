import type { Locale } from './locales';

export const ui = {
  es: {
    nav: { home: 'Inicio', profile: 'Perfil', projects: 'Proyectos', ai: 'IA y agentes', solutions: 'Soluciones', contact: 'Contacto' },
    hero: { eyebrow: 'FULL-STACK · AGENTIC AI · IOT', title: 'Ingeniería para sistemas inteligentes y reales.', description: 'Construyo soluciones que conectan software empresarial, agentes de IA, datos y dispositivos físicos: desde el requerimiento hasta producción.', work: 'Explorar mi trabajo', business: 'Resolver un problema empresarial' },
    audience: { title: 'Elige tu trayectoria', hiring: 'Contratar a David', hiringBody: 'Experiencia, arquitectura, IA aplicada y resultados en producción.', business: 'Construir una solución', businessBody: 'IoT industrial, trazabilidad de activos y automatización con pilotos medibles.' },
  },
  en: {
    nav: { home: 'Home', profile: 'Profile', projects: 'Projects', ai: 'AI & agents', solutions: 'Solutions', contact: 'Contact' },
    hero: { eyebrow: 'FULL-STACK · AGENTIC AI · IOT', title: 'Engineering for intelligent, real-world systems.', description: 'I build solutions that connect enterprise software, AI agents, data, and physical devices—from requirements to production.', work: 'Explore my work', business: 'Solve a business problem' },
    audience: { title: 'Choose your path', hiring: 'Hire David', hiringBody: 'Experience, architecture, applied AI, and production outcomes.', business: 'Build a solution', businessBody: 'Industrial IoT, asset traceability, and automation through measurable pilots.' },
  },
} as const satisfies Record<Locale, object>;
