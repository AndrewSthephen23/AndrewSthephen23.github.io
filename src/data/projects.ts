// ════════════════════════════════════════════════════════════
// PROYECTOS — sección "Selected Works" de la home.
// ────────────────────────────────────────────────────────────
// `image` es OPCIONAL: nombre de un archivo dentro de src/assets/projects/
// (p. ej. "mcp-safety-scanner.png"). Si existe, se muestra optimizado con
// <Image /> de astro:assets; si no, se dibuja una portada generada con los
// tokens del tema (ver src/components/ProjectCover.astro).
// `accent` y `pattern` solo afectan a la portada generada.
// `link` es opcional: sin él, la flecha lleva al perfil de GitHub (site.ts).
// ════════════════════════════════════════════════════════════

/** Roles de acento del contrato de temas (docs/GUIA_TEMAS.md). */
export type Accent =
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "special"
    | "warning"
    | "danger";

export type CoverPattern = "grid" | "dots" | "stripes" | "scan";

export interface Project {
    title: string;
    description: string;
    tags: string[];
    /** Categoría corta que aparece en la portada generada. */
    category: string;
    /** Icono Iconify (set Remix, `ri:*`) de la portada generada. */
    icon: string;
    accent: Accent;
    pattern: CoverPattern;
    /** Archivo en src/assets/projects/ (opcional). */
    image?: string;
    /** Texto alternativo de la captura real; por defecto "Captura de <título>". */
    imageAlt?: string;
    link?: string;
}

export const projects: Project[] = [
    {
        title: "MCPSafetyScanner",
        description:
            "Herramienta de escaneo de seguridad y automatización. Diseñada para auditorías rápidas y reportes técnicos.",
        tags: ["Python", "Security", "Automation"],
        category: "SECURITY TOOLING",
        icon: "ri:shield-keyhole-line",
        accent: "danger",
        pattern: "scan",
    },
    {
        title: "Odoo API Sync",
        description:
            "Sincronización bidireccional entre servidores externos y Odoo ERP mediante XML-RPC para automatización comercial.",
        tags: ["Python", "XML-RPC", "Ubuntu Server"],
        category: "BACKEND / API",
        icon: "ri:arrow-left-right-line",
        accent: "info",
        pattern: "grid",
    },
    {
        title: "Indusegur Analytics",
        description:
            "Dashboard interactivo de inteligencia de negocios (BI) para la visualización de métricas y limpieza de bases de datos.",
        tags: ["Power BI", "Data Analysis", "SQL"],
        category: "DATA / BI",
        icon: "ri:bar-chart-box-line",
        accent: "warning",
        pattern: "dots",
    },
    {
        title: "CTF Write-Ups",
        description:
            "Colección documentada de resolución de máquinas vulnerables (HackTheBox & TryHackMe) aplicando técnicas de pentesting.",
        tags: ["Pentesting", "CTF", "Markdown"],
        category: "OFFENSIVE SECURITY",
        icon: "ri:flag-2-line",
        accent: "success",
        pattern: "stripes",
        link: "/blog",
    },
];
