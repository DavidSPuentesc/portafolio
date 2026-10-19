import type { Locale } from './locales';

export const ui = {
  es: {
    nav: { home: 'Inicio', profile: 'Perfil', projects: 'Proyectos', ai: 'IA y agentes', solutions: 'Soluciones', contact: 'Contacto' },
    hero: {
      eyebrow: 'DATA · APPLIED AI · IOT · FULL-STACK',
      title: 'Ingeniería de datos e IA aplicada, del sensor al producto.',
      description: 'Ingeniero de software e IoT orientado a datos, con experiencia en software, IoT y sistemas empresariales. Construyo pipelines, análisis y productos digitales de extremo a extremo, y utilizo IA con control de contexto, costos y validación humana.',
      work: 'Explorar mi trabajo',
      business: 'Resolver un problema empresarial',
    },
    audience: {
      title: 'Elige tu trayectoria',
      hiring: 'Contratar a David',
      hiringBody: 'Experiencia profesional, proyectos públicos, stack real, proceso de trabajo y CV descargable.',
      business: 'Construir una solución',
      businessBody: 'Datos, IoT, electrónica y aplicaciones web con pilotos medidos contra una métrica acordada.',
    },
  },
  en: {
    nav: { home: 'Home', profile: 'Profile', projects: 'Projects', ai: 'AI & agents', solutions: 'Solutions', contact: 'Contact' },
    hero: {
      eyebrow: 'DATA · APPLIED AI · IOT · FULL-STACK',
      title: 'Data engineering and applied AI, from sensor to product.',
      description: 'Data-oriented software and IoT engineer with experience in software, IoT, and business systems. I build end-to-end pipelines, analysis, and digital products, and use AI with context, cost, and human-validation controls.',
      work: 'Explore my work',
      business: 'Solve a business problem',
    },
    audience: {
      title: 'Choose your path',
      hiring: 'Hire David',
      hiringBody: 'Professional experience, public projects, the real stack, working process, and a downloadable CV.',
      business: 'Build a solution',
      businessBody: 'Data, IoT, electronics, and web applications with pilots measured against an agreed metric.',
    },
  },
} as const satisfies Record<Locale, object>;
