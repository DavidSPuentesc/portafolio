import type { Locale } from './locales';

export const ui = {
  es: {
    nav: { home: 'Inicio', profile: 'Perfil', projects: 'Proyectos', ai: 'IA y agentes', solutions: 'Soluciones', contact: 'Contacto' },
    hero: {
      eyebrow: 'FULL-STACK · AGENTIC AI · IOT',
      title: 'Ingeniería que llega a producción.',
      description: 'Desarrollador full-stack con experiencia profesional en aplicaciones empresariales y formación en ingeniería electrónica. Construyo proyectos públicos de IoT, sensores, LoRa y software web, y utilizo IA con control de contexto, costos y validación humana.',
      work: 'Explorar mi trabajo',
      business: 'Resolver un problema empresarial',
    },
    audience: {
      title: 'Elige tu trayectoria',
      hiring: 'Contratar a David',
      hiringBody: 'Experiencia profesional, proyectos públicos, stack real, proceso de trabajo y CV descargable.',
      business: 'Construir una solución',
      businessBody: 'IoT, electrónica y aplicaciones web con pilotos medidos contra una métrica acordada.',
    },
  },
  en: {
    nav: { home: 'Home', profile: 'Profile', projects: 'Projects', ai: 'AI & agents', solutions: 'Solutions', contact: 'Contact' },
    hero: {
      eyebrow: 'FULL-STACK · AGENTIC AI · IOT',
      title: 'Engineering that ships to production.',
      description: 'Full-stack developer with professional experience in business applications and an electronic-engineering background. I build public IoT, sensing, LoRa, and web projects, and use AI with context, cost, and human-validation controls.',
      work: 'Explore my work',
      business: 'Solve a business problem',
    },
    audience: {
      title: 'Choose your path',
      hiring: 'Hire David',
      hiringBody: 'Professional experience, public projects, the real stack, working process, and a downloadable CV.',
      business: 'Build a solution',
      businessBody: 'IoT, electronics, and web applications with pilots measured against an agreed metric.',
    },
  },
} as const satisfies Record<Locale, object>;
