// ════════════════════════════════════════════════════════════
// DATOS DE SEO — valores por defecto de metadatos, Open Graph y RSS.
// ────────────────────────────────────────────────────────────
// El alias y las redes viven en src/data/site.ts; aquí solo lo que
// es propio de buscadores y tarjetas al compartir. Las URLs absolutas
// se construyen siempre desde `site` (astro.config.mjs).
// ════════════════════════════════════════════════════════════
import { site } from './site';

export const seo = {
    /** Nombre del sitio (og:site_name, JSON-LD, título del RSS). */
    siteName: site.alias,

    /** Plantilla de título: "<título de la página> // M3ow5N0IR". */
    titleSeparator: ' // ',

    /** Descripción por defecto (home y páginas que no pasen la suya). */
    description:
        'Portafolio y blog de M3ow5N0IR, pentester junior: write-ups de máquinas de Hack The Box y TryHackMe, retos CTF y proyectos de seguridad.',

    /** Idioma del documento y locale de Open Graph. */
    lang: 'es',
    locale: 'es_ES',

    /** Imagen OG por defecto (public/og-default.png, generada por scripts/generate-brand-assets.mjs). */
    image: {
        src: '/og-default.png',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'M3ow5N0IR — Portafolio & CTF Write-Ups',
    },

    /** Feed RSS del blog. */
    rss: {
        path: '/rss.xml',
        title: `Write-Ups & Logs // ${site.alias}`,
        description:
            'Write-ups de máquinas y retos CTF retirados, proyectos y notas técnicas de seguridad ofensiva.',
    },
} as const;
