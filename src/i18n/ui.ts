import type { Locale } from './locales';

export const ui = {
  es: {
    nav: { home: 'Inicio', profile: 'Perfil', projects: 'Proyectos', ai: 'IA y agentes', solutions: 'Soluciones', contact: 'Contacto' },
    hero: {
      eyebrow: 'FULL-STACK · AGENTIC AI · IOT',
      title: 'Ingeniería que llega a producción.',
      description: 'Desarrollador full-stack responsable del ciclo completo de 7 clientes B2B en producción, con despliegue continuo. Formación en ingeniería electrónica: telemetría GPS, sensores y LoRa de extremo a extremo. IA aplicada mediante integración de LLM con control de costos y validación humana.',
      work: 'Explorar mi trabajo',
      business: 'Resolver un problema empresarial',
    },
    audience: {
      title: 'Elige tu trayectoria',
      hiring: 'Contratar a David',
      hiringBody: 'Experiencia en producción, casos con métricas, stack real, proceso de entrega y CV descargable.',
      business: 'Construir una solución',
      businessBody: 'IoT industrial, trazabilidad de activos y automatización con IA, con pilotos medidos contra una métrica acordada.',
    },
  },
  en: {
    nav: { home: 'Home', profile: 'Profile', projects: 'Projects', ai: 'AI & agents', solutions: 'Solutions', contact: 'Contact' },
    hero: {
      eyebrow: 'FULL-STACK · AGENTIC AI · IOT',
      title: 'Engineering that ships to production.',
      description: 'Full-stack developer owning the full delivery cycle for 7 B2B customers in production, with continuous deployment. Electronic-engineering background: end-to-end GPS telemetry, sensors, and LoRa. Applied AI through LLM integration with cost controls and human validation.',
      work: 'Explore my work',
      business: 'Solve a business problem',
    },
    audience: {
      title: 'Choose your path',
      hiring: 'Hire David',
      hiringBody: 'Production experience, cases with metrics, the real stack, the delivery process, and a downloadable CV.',
      business: 'Build a solution',
      businessBody: 'Industrial IoT, asset traceability, and AI-backed automation, with pilots measured against an agreed metric.',
    },
  },
} as const satisfies Record<Locale, object>;
