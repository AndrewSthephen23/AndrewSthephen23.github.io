# Plan de Mejoras — Portfolio Neo (Portafolio + Blog CTF)

> Documento de diseño y modificación. Describe **qué** se va a cambiar y **por qué**.
> El orden de ejecución y las tareas concretas están en [PLAN_FASES.md](./PLAN_FASES.md).

---

## 1. Visión general

Convertir el sitio actual (one-page neobrutalista) en un **portafolio profesional con blog técnico integrado**, manteniendo la identidad visual neobrutalista pero con dos personalidades:

| Modo | Nombre | Estética |
|------|--------|----------|
| ☀️ Claro | **DEV** | Neobrutalismo actual: fondo crema, bordes negros, colores saturados (amarillo, rosa, azul), sombras duras. |
| 🌙 Oscuro | **HACKER** | Terminal / phosphor: fondo casi negro (`#0A0E0A`), verde fósforo como acento principal, bordes verdes/grises, tipografía mono dominante, scanlines sutiles opcionales. |

### Arquitectura de contenido

```
/                    → Portafolio (landing: hero, about, skills, experience, projects, contact)
/blog                → Índice del blog (writeups + posts), con filtros por tag/categoría
/blog/[slug]         → Post individual renderizado desde .md/.mdx
/writeups            → (alias o categoría dentro de /blog) Writeups de CTF y máquinas
/projects            → (opcional, fase avanzada) Página dedicada de proyectos
/rss.xml             → Feed RSS
/sitemap-index.xml   → Sitemap automático
```

El contenido se escribe en **archivos `.md`/`.mdx`** dentro de `src/content/`, gestionados con **Astro Content Collections** (validación de frontmatter con Zod). Esto es exactamente el flujo que quieres: escribes un `.md`, haces commit, y aparece publicado.

---

## 2. Estado actual (diagnóstico)

### Lo que ya funciona bien
- Base Astro 5 + Tailwind 4 (`@theme` en [global.css](../src/styles/global.css)).
- Identidad visual fuerte y consistente (paleta neo, sombras duras, marquee, cursor custom).
- Componentes ya separados: `Skills`, `Experience`, `SelectedWorks`, `UserReports`, `Contact`.
- Datos de componentes definidos en arrays en el frontmatter (fácil de migrar a archivos de datos).

### Problemas y carencias detectadas

Estado revisado contra el código el 2026-11-16. La fase indica dónde se resuelve en [PLAN_FASES.md](./PLAN_FASES.md).

| # | Problema | Impacto | Estado | Fase |
|---|----------|---------|--------|------|
| P0 | **Trabajo sin versionar ni respaldar.** Las Fases 1–3 no están commiteadas, el repo no tiene remoto, no hay CI y la rama es `master`. | Crítico — un fallo de disco borra todo lo hecho. | ⬜ | G |
| P1 | **No existía el blog.** | Crítico. | ✅ Resuelto | 2–3 |
| P2 | **No había modo oscuro** ni tokens semánticos. | Crítico. | ✅ Resuelto (falta QA visual) | 1 |
| P3 | **Sin SEO:** no hay `<meta description>`, Open Graph, Twitter cards, canonical, ni favicon propio. | Alto — invisible para buscadores y feo al compartir el link. | ⬜ | 4 |
| P4 | **Sin navegación móvil:** el nav es `hidden md:flex` y no hay menú hamburguesa. | Alto — la mayoría del tráfico de portafolios es móvil. | ⬜ | 4 |
| P5 | **Fuentes e iconos por CDN** (Google Fonts en `global.css`, RemixIcon en `Layout.astro`). | Medio. | ⬜ | 0 |
| P6 | **Accesibilidad:** `cursor: none` global, sin `prefers-reduced-motion`, `target="_blank"` sin `rel`. | Medio. | ⬜ | 0 y 5 |
| P7 | **Contenido placeholder:** `github.com/tu-usuario`, 4 imágenes de Unsplash, `/NO_IMAGE_YET/`, socials y botón del hero con `href="#"`, README de la plantilla, 3 posts de ejemplo. | Medio — resta profesionalismo inmediato. | ⬜ | 0, 5 y 6 |
| P8 | **Formulario de contacto sin `action`** (el `mailto` sí funciona). | Medio. | ⬜ | 0 |
| P9 | `site` en `astro.config.mjs`. | Bajo pero bloqueante para P3. | ✅ Resuelto (GitHub Pages) | 6 |
| P10 | El script de `Layout.astro` no se re-ejecuta con View Transitions. | Bajo. | ⬜ | 7 |
| P11 | **Sin verificación de tipos ni página 404.** No hay `astro check` ni `404.astro`. | Bajo. | ⬜ | G y 0 |

---

## 3. Mejoras a implementar

### 3.1 Sistema de temas (Claro DEV / Oscuro HACKER)

> **✅ Implementado como sistema LEGO (2026-07-07):** temas intercambiables por archivo
> en `src/styles/themes/` con contrato de tokens. Ver [GUIA_TEMAS.md](./GUIA_TEMAS.md)
> para crear/cambiar piezas y la plantilla de spec UX/UI.

**Estrategia técnica:**

1. **Tokens semánticos** en `global.css`. En lugar de `border-black`/`bg-white` en cada componente, se definen variables que cambian por tema:

```css
/* Tokens semánticos — cambian con el tema */
:root {
    --color-surface: #FFFDF5;      /* fondo de página */
    --color-panel: #FFFFFF;        /* tarjetas / paneles */
    --color-ink: #121212;          /* texto y bordes principales */
    --color-accent: #FBFF48;       /* acento primario (amarillo dev) */
    --color-shadow: #000000;       /* color de la sombra dura */
    --grid-line: #e5e5e5;          /* rejilla del fondo */
}

[data-theme="dark"] {
    --color-surface: #0A0E0A;      /* negro terminal */
    --color-panel: #101510;
    --color-ink: #E8FFE8;          /* texto claro con tinte verde */
    --color-accent: #33FF57;       /* verde fósforo protagonista */
    --color-shadow: #33FF57;       /* sombras duras VERDES = identidad hacker */
    --grid-line: #1a2a1a;
}
```

2. Registrar esos tokens en `@theme inline` de Tailwind 4 para poder usar `bg-surface`, `text-ink`, `border-ink`, `shadow-hard` (la sombra dura usa `var(--color-shadow)`).
3. **Toggle** en el nav: botón `SUN/MOON` (o mejor, temático: `[DEV_MODE]` / `[HACKER_MODE]`) que alterna `data-theme` en `<html>`, persiste en `localStorage` y respeta `prefers-color-scheme` como valor inicial. Script inline en `<head>` para evitar FOUC (flash de tema incorrecto).
4. **Refactor de componentes:** reemplazar clases hardcodeadas (`border-black` → `border-ink`, `bg-white` → `bg-panel`, etc.). Es el trabajo más tedioso pero es mecánico.
5. **Detalles de identidad del modo hacker:**
   - El marquee pasa de `bg-neo-blue` a negro con texto verde.
   - El fondo de rejilla usa `--grid-line` (rejilla verde oscura).
   - Efecto opcional de *scanlines* / ruido CRT muy sutil con un pseudo-elemento.
   - El cursor custom cambia a un bloque de terminal (▮) o cruz verde.
   - Textos decorativos cambian: `SYSTEM STATUS: ONLINE` puede volverse `root@m3ow5n0ir:~#`.

### 3.2 Blog y writeups con Content Collections

**Estructura:**

```
src/
  content/
    blog/                  ← posts generales y writeups
      htb-machine-blue.md
      thm-mrrobot.md
      proyecto-mcp-scanner.md
  content.config.ts        ← schema con Zod (Astro 5: loader glob)
```

> **✅ Implementado (2026-07-07).** Lo que sigue es el diseño original; la fuente de verdad
> es `src/content.config.ts` y la guía [COMO_PUBLICAR.md](./COMO_PUBLICAR.md).
> Pendiente del diseño: páginas por tag (backlog, Fase 7).

**Schema del frontmatter (borrador):**

```ts
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(['writeup', 'proyecto', 'blog']),   // tipo de post
    platform: z.enum(['HTB', 'THM', 'CTF', 'otro']).optional(), // para writeups
    difficulty: z.enum(['easy', 'medium', 'hard', 'insane']).optional(),
    os: z.enum(['linux', 'windows', 'otro']).optional(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),        // portada / og image
    draft: z.boolean().default(false),   // ocultar borradores en prod
  }),
});
```

**Páginas nuevas:**
- `src/pages/blog/index.astro` — grid de tarjetas neobrutalistas con: badge de categoría (WRITEUP / PROYECTO / BLOG), plataforma+dificultad para writeups (ej. `HTB • EASY • LINUX`), fecha, tags, tiempo de lectura. Filtros por categoría y tag (estático con query params o JS ligero).
- `src/pages/blog/[...slug].astro` — layout de post: cabecera estilo "reporte de pentest" (caja con metadatos tipo tabla: TARGET, DIFFICULTY, DATE, TAGS), tabla de contenidos generada de los headings, prosa estilizada, navegación anterior/siguiente.
- `src/pages/blog/tags/[tag].astro` — listado por tag (opcional, fase avanzada).

**Renderizado de Markdown:**
- Integración **MDX** (para poder usar componentes en writeups: alertas, spoilers de flags, bloques "comando + output").
- **Expressive Code** (`astro-expressive-code`): bloques de código con marcos de terminal, títulos de archivo, resaltado de líneas y botón de copiar — perfecto para writeups. Tema claro/oscuro sincronizado con el toggle.
- Plugins remark/rehype: `rehype-slug` + autolink de headings, tiempo de lectura estimado.
- Estilos de prosa propios (neobrutalistas): blockquotes como cajas con borde y sombra dura, tablas con bordes gruesos, `inline code` con fondo de acento.
- Componentes MDX propios: `<Flag>` (spoiler oculto hasta click), `<Terminal>` (bloque comando/salida), `<Callout type="info|warn|pwned">`.

### 3.3 SEO y metadata

- `site: 'https://tudominio.com'` en `astro.config.mjs`.
- Componente `SEO.astro` (o head centralizado en `Layout.astro`): title template (`%s // M3ow5N0IR`), description, canonical, Open Graph, Twitter card, `theme-color` por tema.
- `@astrojs/sitemap` y `@astrojs/rss` (feed generado desde la colección blog).
- OG images: estáticas por ahora; generadas por post (satori) en fase avanzada.
- `robots.txt` en `public/`.

### 3.4 Navegación y layout

- **Menú hamburguesa móvil**: panel full-screen neobrutalista con los links grandes; botón con animación de "glitch".
- Nav actualizado: `/ABOUT`, `/SKILLS`, `/LOGS`, `/WORK`, **`/BLOG`** (nuevo, link real a `/blog`), `HIRE ME`, toggle de tema.
- Los anchors (`#about`) deben funcionar también desde `/blog` (usar `/#about`).
- Footer: enlaces reales (GitHub, LinkedIn, HTB/THM profile), link al RSS.

### 3.5 Contenido real y profesionalismo

- Reemplazar `github.com/tu-usuario` y socials `href="#"` con tus perfiles reales.
- Foto o avatar propio en "Who am I?" (aunque sea un avatar pixel-art/hacker, mejor que el placeholder).
- Imágenes de proyectos propias (screenshots reales) optimizadas con `astro:assets` (`<Image />`), no Unsplash.
- Redacción bilingüe opcional (ES ahora; EN en fase futura si apuntas a mercado internacional).
- Decidir si `UserReports` (testimonios) se mantiene, se comenta o se transforma en "Badges/Certs" (ej. certificaciones, ranking HTB).
- CV descargable en PDF (botón en Contact o nav).

### 3.6 Rendimiento, accesibilidad y calidad

- Self-host de fuentes con `@fontsource-variable/space-grotesk` y `@fontsource/jetbrains-mono` (elimina CDN de Google).
- Reemplazar RemixIcon CDN por `astro-icon` (iconify) o SVGs inline → solo se embebe lo que se usa.
- `prefers-reduced-motion`: desactivar marquee, bounce, glitch y cursor custom.
- Restaurar cursor nativo como fallback (aplicar `cursor:none` solo cuando JS confirme que el cursor custom está activo) y desactivarlo en dispositivos táctiles (`@media (pointer: fine)`).
- `rel="noopener noreferrer"` en todos los `target="_blank"`; quitar `target="_blank"` de links internos.
- Contraste: en modo claro, el verde `#33FF57` solo sobre negro, nunca sobre blanco.
- Jerarquía de headings correcta (un solo `h1` por página).
- Lighthouse objetivo: ≥95 en Performance / A11y / Best Practices / SEO.

### 3.7 GitHub como flujo de trabajo

Hoy el repositorio es local, con dos commits y sin remoto. La propuesta es que GitHub sea el centro del proyecto:

- **Respaldo e historial.** Commits separados por fase, rama `main`, repo público. `.gitattributes` con `eol=lf` para eliminar los avisos de CRLF en Windows.
- **CI con GitHub Actions.** En cada push y PR: `npm ci` → `astro check` → `astro build`, más un paso que falla si reaparecen placeholders. Los criterios de salida de las fases pasan de "revisado a mano" a "verificado por máquina".
- **Un PR por fase y por post.** Publicar un writeup es: rama `post/…` → archivo `.md` → PR (CI + preview) → merge. Un post de una máquina aún activa vive en su rama con `draft: true` hasta que se retire.
- **Issues y milestones.** Un milestone por fase y un issue por tarea sustituyen a las casillas de PLAN_FASES.md, que queda como visión general.
- **Dependabot** semanal para npm y Actions, con el CI como red de seguridad.
- **Protección de `main`:** no se fusiona sin CI en verde.
- **Licencias:** MIT para el código, CC BY-NC 4.0 para el contenido.
- **El repo como pieza del portafolio:** descripción, topics, URL del sitio, README propio y fijado en el perfil.
- **Más adelante:** comentarios con giscus (GitHub Discussions) y una sección de actividad alimentada por la API de GitHub en build.

### 3.8 Despliegue

> **✅ Decidido e implementado (2026-11-16): GitHub Pages.**

- El repo se llama `AndrewSthephen23.github.io`, así que el sitio se sirve en la raíz de <https://andrewsthephen23.github.io> y no hace falta `base`.
- El despliegue es un job de GitHub Actions (`deploy` en `ci.yml`): se ejecuta solo en `main` y solo si pasan `check`, `build` y la verificación de placeholders.
- GitHub Pages no ofrece previews por PR; en los PRs el sitio compilado queda como artifact descargable.
- Alternativa descartada por ahora: Cloudflare Pages (previews por PR). Migrar sería cambiar `site` y el job `deploy`.
- Dominio propio, si lo hay: configurarlo en Pages y actualizar `site`.
- Regla de contenido: solo writeups de máquinas y retos retirados.

---

## 4. Dependencias

| Paquete | Para qué | Estado |
|---------|----------|--------|
| `@astrojs/mdx` | Componentes dentro de writeups | ✅ Instalado |
| `astro-expressive-code` | Bloques de código estilo terminal con copy button | ✅ Instalado |
| `rehype-slug`, `rehype-autolink-headings` | Anchors en headings de posts | ✅ Instalado |
| `reading-time` | Tiempo de lectura | ✅ Instalado |
| `@astrojs/check`, `typescript` | Verificación de tipos en CI (`astro check`) | ⬜ Fase G |
| `@fontsource-variable/space-grotesk`, `@fontsource/jetbrains-mono` | Fuentes self-hosted | ⬜ Fase 0 |
| `astro-icon` (+ `@iconify-json/ri`) | Iconos RemixIcon sin CDN | ⬜ Fase 0 |
| `@astrojs/sitemap` | Sitemap automático | ⬜ Fase 4 |
| `@astrojs/rss` | Feed RSS del blog | ⬜ Fase 4 |

Todo es integración oficial o estándar del ecosistema Astro; sin frameworks JS pesados (se mantiene 0 JS de framework — solo scripts vanilla pequeños).

---

## 5. Riesgos / decisiones abiertas

**Riesgo activo**

1. **Trabajo sin commitear ni remoto (P0).** Es lo primero que hay que cerrar (Fase G.1).

**Decisiones abiertas**

2. **Idioma:** el sitio mezcla ES/EN (títulos en inglés, prosa en español). Mantener ese estilo o hacerlo consistente.
3. **Dominio propio:** opcional; hoy se usa el subdominio de GitHub Pages.

**Decisiones cerradas**

- Branding unificado a `M3ow5N0IR`; `UserReports` convertido en "Certs & Badges"; formulario de contacto por `mailto` (2026-11-16).
- Hosting: GitHub Pages, con repo público `AndrewSthephen23.github.io` (2026-11-16). Los posts de ejemplo quedan en borrador.
- Refactor de tokens antes del blog (hecho, Fase 1) y arquitectura de temas tipo LEGO (2026-07-07).
