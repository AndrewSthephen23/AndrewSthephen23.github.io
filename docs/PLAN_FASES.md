# Plan de Implementación por Fases — Portfolio Neo

> Roadmap ejecutable. El detalle de diseño de cada mejora está en [PLAN_MEJORAS.md](./PLAN_MEJORAS.md).
> Cada fase termina con el sitio **funcionando y desplegable** (no se rompe nada a mitad de camino).

**Leyenda de estado:** ⬜ Pendiente · 🟨 En progreso / parcial · ✅ Hecho

---

## Estado actual (verificado contra el código el 2026-11-16)

| Fase | Tema | Estado | Nota |
|------|------|--------|------|
| G | Repositorio y GitHub | 🟨 | Hecha (2026-11-16) salvo proteger `main`, que espera a que el repo sea público. |
| 0 | Fundaciones y limpieza | ✅ | Hecha y fusionada (2026-11-16). `site` se confirma al desplegar. |
| 1 | Sistema de temas | 🟨 | Todo implementado; falta el QA visual. |
| 2 | Blog: infraestructura | ✅ | |
| 3 | Blog: lectura avanzada | ✅ | |
| 6 | Despliegue | ✅ | GitHub Pages: <https://andrewsthephen23.github.io>. Falta validar las OG cards al compartir. |
| 4 | Móvil, SEO, descubribilidad | ✅ | Hecha y fusionada (2026-11-16). Las OG cards se validan tras el deploy. |
| 5 | Accesibilidad, rendimiento, pulido | 🟨 | Hecha y fusionada (2026-11-16) salvo materiales propios: capturas, foto, CV y certificaciones. |
| 7 | Extras (backlog) | ⬜ | |

`npm run check` y `npm run build` pasan (6 páginas) y el CI de GitHub Actions los ejecuta en cada push y PR. El seguimiento tarea a tarea está en los issues y milestones del repo. Los números de fase se conservan porque otros documentos
y comentarios del código los referencian; **el orden de ejecución es el de esta tabla**
(ver [Orden y dependencias](#orden-y-dependencias)).

### Pendiente antes de publicar

1. **Materiales propios:** capturas de proyectos (`src/assets/projects/`), foto o avatar, CV en PDF y certificaciones (`src/data/certs.ts`).
2. **Contenido del blog:** los 3 posts de ejemplo están en borrador; falta el primer writeup real.

---

## Fase G — Repositorio y GitHub (hacer primero)

*Objetivo: que el trabajo esté respaldado y que GitHub sea el flujo de trabajo, no solo un almacén.*

**G.1 — Poner el trabajo a salvo**

- ✅ Añadir `.gitattributes` con `* text=auto eol=lf` (hoy Git avisa de conversión LF→CRLF en cada archivo).
- ✅ Commitear lo pendiente en commits separados por fase, no en uno solo:
  `feat(themes): sistema de temas LEGO` · `feat(blog): content collections y páginas` · `feat(blog): componentes MDX, TOC y relacionados` · `docs: planes y guías`.
- ✅ Renombrar la rama `master` → `main`.
- ✅ Crear el repositorio en GitHub y hacer el primer `push`. Creado **privado** por ahora; pasarlo a público cuando el contenido sea real (un portafolio con código abierto es parte del portafolio).

**G.2 — Calidad automática**

- ✅ Instalar `@astrojs/check` + `typescript` y añadir el script `"check": "astro check"`.
- ✅ GitHub Action `ci.yml`: en cada push y PR ejecuta `npm ci`, `npm run check` y `npm run build`.
- ✅ Paso de CI que falle si reaparecen placeholders (`tu-usuario`, `href="#"`, `unsplash`) — convierte el criterio de salida de la Fase 0 en algo verificado por máquina.
- ✅ Dependabot (`.github/dependabot.yml`) para npm y para las propias Actions, agrupado y semanal.
- ✅ Proteger `main`: exigir que el CI pase antes de fusionar.

**G.3 — Flujo de trabajo**

- ✅ Una rama y un PR por fase o por post (`feat/fase-0-limpieza`, `post/htb-nombre`). El PR obtiene build check y, tras la Fase 6, URL de preview.
- ✅ Mensajes con Conventional Commits (`feat:`, `fix:`, `docs:`, `post:`).
- ✅ Pasar este roadmap a GitHub: un **milestone por fase** y un **issue por tarea**; este archivo queda como visión general y deja de mantenerse casilla a casilla.
- ✅ Plantilla de PR con el checklist de publicación (ambos temas revisados, `draft: false`, máquina retirada, sin credenciales en capturas).
- ✅ `LICENSE`: MIT para el código y CC BY-NC 4.0 para el contenido de `src/content/`.
- 🟨 (falta fijarlo en el perfil) Metadatos del repo: descripción, topics (`astro`, `portfolio`, `ctf-writeups`), URL del sitio, y fijarlo en el perfil.

**Criterio de salida:** `git status` limpio, `main` en GitHub, CI en verde, y abrir un PR ejecuta el build solo.

---

## Fase 0 — Fundaciones y limpieza

*Objetivo: dejar el proyecto listo para crecer sin deuda técnica.*

- ✅ `site` en `astro.config.mjs` (URL de GitHub Pages desde la Fase 6).
- ✅ Self-host de fuentes: instalar `@fontsource-variable/space-grotesk` + `@fontsource/jetbrains-mono`, importarlas en `global.css`, eliminar el `@import` de Google Fonts (línea 1).
- ✅ Reemplazar RemixIcon CDN (`Layout.astro`) por `astro-icon` con `@iconify-json/ri`.
- ✅ `rel="noopener noreferrer"` en todo `target="_blank"` (hoy: `SelectedWorks.astro`); ningún link interno con `target="_blank"`.
- ✅ Unificar branding: el nav y los títulos del blog dicen `M3ow5N0IR`, el footer `CTF_HACKER.`. Elegir un alias y aplicarlo.
- ✅ Reemplazar placeholders: GitHub real (`SelectedWorks.astro`), socials del footer (`Layout.astro`), botón `href="#"` del hero (`index.astro`), ubicación real.
- ✅ Formulario de contacto: el `<form>` de `Contact.astro` no tiene `action`. Conectarlo a un servicio (Web3Forms / Formspree) o dejar solo el `mailto`.
- ✅ Página `404.astro` propia con el estilo del sitio.
- ✅ Escribir `README.md` propio (sigue siendo el de la plantilla de Astro): qué es, comandos, estructura y enlaces a las guías.
- ✅ Mover `PLAN_*.md`, `GUIA_TEMAS.md` y `COMO_PUBLICAR.md` a `docs/` y corregir los enlaces entre ellos.

**Criterio de salida:** build sin errores, cero requests a CDNs externos, sin links `#` ni `tu-usuario` (verificado por el CI de G.2).

---

## Fase 1 — Sistema de temas: Claro (DEV) / Oscuro (HACKER)

*Objetivo: el toggle funcionando en todo el sitio.*

> **Arquitectura tipo LEGO (decisión del 2026-07-07).** Cada tema es un archivo
> independiente en `src/styles/themes/` que implementa un contrato de 22 tokens
> `--t-*`; los slots light/dark se asignan en `THEME_SLOTS` (Layout.astro).
> Instrucciones y plantilla de spec UX/UI: [GUIA_TEMAS.md](./GUIA_TEMAS.md).

- ✅ Contrato de tokens semánticos + piezas `dev.css` y `hacker.css` + `_plantilla.css`.
- ✅ Puente `@theme inline` en `global.css` (`bg-surface`, `bg-panel`, `text-ink`, `shadow-hard*`…).
- ✅ Script inline anti-FOUC en `<head>`.
- ✅ Botón toggle en el nav (`☀ DEV` / `☾ HACKER`) con persistencia en `localStorage`.
- ✅ Refactor de todos los componentes a utilidades semánticas.
- ✅ Rejilla, marquee, cursor y blend del hero tematizados en `hacker.css`.
- 🟨 QA visual de todas las secciones en ambos modos con el checklist de GUIA_TEMAS.md §7. Incluir ahora también `/blog` y un post, que no existían cuando se escribió la tarea.

**Criterio de salida:** toggle instantáneo sin flash al recargar; ninguna sección rota en dark; contraste AA en textos.

---

## Fase 2 — Blog: infraestructura de contenido ✅

*Objetivo: poder publicar un writeup escribiendo solo un archivo `.md`.* Completada el 2026-07-07. Guía: [COMO_PUBLICAR.md](./COMO_PUBLICAR.md).

- ✅ `@astrojs/mdx` + `src/content.config.ts` con la colección `blog` (schema Zod).
- ✅ 3 posts de ejemplo en `src/content/blog/`.
- ✅ `astro-expressive-code` sincronizado con el toggle (`data-mode`), marcos de terminal y botón copiar.
- ✅ `src/pages/blog/index.astro`: grid de tarjetas con filtros por categoría; excluye `draft: true` en prod.
- ✅ `src/pages/blog/[...slug].astro`: cabecera "reporte de pentest", TOC, prosa `.prose-neo`, anterior/siguiente.
- ✅ `rehype-slug` + `rehype-autolink-headings` + tiempo de lectura (`src/lib/blog.ts`).
- ✅ `/BLOG` en el nav; "VER WRITE-UPS" apunta a `/blog`.

---

## Fase 3 — Blog: experiencia de lectura avanzada ✅

*Objetivo: que leer un writeup sea la mejor parte del sitio.* Completada el 2026-07-07.

- ✅ Componentes MDX en `src/components/mdx/`: `<Terminal>`, `<Callout>`, `<Flag>`.
- ✅ TOC sticky lateral con scroll spy; TOC inline en móvil.
- ✅ Imágenes de posts con `astro:assets`.
- ✅ Barra de progreso de lectura (reutiliza la del Layout).
- ✅ Posts relacionados por tags y categoría (`getRelatedPosts`).
- ✅ `htb-lame.mdx` como demostración de los tres componentes.

---

## Fase 6 — Despliegue

*Objetivo: publicar y que publicar sea trivial.*

> **Decisión (2026-11-16): GitHub Pages**, con el repo renombrado a `AndrewSthephen23.github.io`
> para servir el sitio en la raíz (sin `base`) en <https://andrewsthephen23.github.io>.
> El repo pasa a ser público (Pages lo exige en el plan gratuito).

- ✅ Hosting: GitHub Pages desplegado desde GitHub Actions (job `deploy` de `ci.yml`, solo en `main` y solo si pasan build y placeholders).
- ✅ Los 3 posts de ejemplo quedan con `draft: true`; `/blog` muestra un aviso de "en construcción" mientras no haya posts publicados.
- ✅ `site` actualizado a la URL de GitHub Pages.
- ✅ README con el flujo de publicación y despliegue.
- 🟨 Verificación post-deploy: rutas, RSS, sitemap y assets comprobados; faltan las OG cards al compartir en Discord/X/LinkedIn y un móvil real.
- ⬜ Dominio propio (opcional): configurarlo en Pages y cambiar `site`.

**Criterio de salida:** fusionar un PR en `main` → sitio actualizado en minutos.

---

## Fase 4 — Navegación móvil, SEO y descubribilidad

*Objetivo: sitio usable en móvil y visible para buscadores.*

- ✅ Menú hamburguesa móvil full-screen (hoy el nav es `hidden md:flex`: en móvil no hay navegación), con el toggle de tema incluido.
- ✅ Componente SEO en `Layout.astro`: title template, description por página, canonical, Open Graph, Twitter card, `theme-color` por tema.
- ✅ El frontmatter de los posts alimenta su propio SEO (description, imagen OG).
- ✅ `@astrojs/sitemap` + `robots.txt`.
- ✅ `@astrojs/rss`: feed `/rss.xml` + link en el footer.
- ✅ Imagen OG por defecto del sitio.
- ✅ Favicon completo (SVG + PNG + apple-touch-icon); los actuales son los de la plantilla de Astro.

**Criterio de salida:** compartir cualquier URL en Discord/Twitter/LinkedIn muestra la card correcta; nav usable en un móvil real.

---

## Fase 5 — Accesibilidad, rendimiento y pulido

*Objetivo: calidad profesional medible.*

- ✅ `prefers-reduced-motion`: pausar marquee, bounce, glitch y cursor custom (hoy no hay ninguna regla).
- ✅ Cursor custom solo con `@media (pointer: fine)` y con fallback nativo (`global.css` aplica `cursor: none` de forma global).
- ✅ Auditoría de contraste en ambos temas.
- ✅ Jerarquía de headings y labels/aria en nav, toggle y menú móvil.
- 🟨 (hay portadas y avatar generados; faltan las capturas y la foto reales) Imágenes propias optimizadas con `<Image />` en Selected Works (hoy son 4 URLs de Unsplash) y avatar real en "Who am I?".
- ✅ (2026-11-16, móvil: home 99/100/100/100, post 98/100/100/100) Lighthouse ≥95 en las 4 categorías (home y un post), medido sobre la preview del PR; opcional: Lighthouse CI como Action.
- 🟨 (convertido en "Certs & Badges"; faltan las entradas en `src/data/certs.ts`) Resolver `UserReports`: testimonios reales, convertirlo en "Certs & Badges", o eliminarlo.
- 🟨 (botón listo; falta el PDF en `public/cv.pdf`) CV descargable (PDF) enlazado en Contact/nav.

**Criterio de salida:** reportes Lighthouse ≥95 archivados; cero contenido placeholder visible.

---

## Fase 7 — Extras (backlog, sin compromiso)

- ⬜ Comentarios en posts con giscus (GitHub Discussions; requiere repo público).
- ⬜ Búsqueda client-side en el blog (Pagefind).
- ⬜ Páginas por tag `/blog/tags/[tag]` y filtro por tag.
- ⬜ OG images generadas por post (satori / `astro-og-canvas`).
- ⬜ Sección "actividad" con datos de la API de GitHub (repos fijados, últimos commits) obtenidos en build.
- ⬜ Migración a Astro 7 (con TypeScript 7 y MDX 8): Dependabot ignora los saltos mayores, se hace a mano.
- ⬜ Versión EN del sitio (i18n de Astro).
- ⬜ Página `/projects` con casos de estudio largos.
- ⬜ Easter eggs modo hacker: konami code, terminal fake, CRT toggleable.
- ⬜ Analytics respetuoso (Plausible/Umami o Cloudflare Analytics).
- ⬜ View Transitions de Astro (requiere adaptar los scripts del Layout).

---

## Orden y dependencias

```
Fase G ──► Fase 0 ──► Fase 4 + Fase 5 ──► Fase 6 ──► Fase 7
(GitHub)   (limpieza)  (SEO/móvil, pulido)  (deploy)   (extras)
              │
              └─ QA de Fase 1 (se cierra en paralelo)

Hechas: Fase 1 (temas, salvo QA) · Fase 2 (blog) · Fase 3 (lectura)
```

- **Fase G antes que todo:** primero se respalda el trabajo; después cada fase es un PR con CI.
- **Fase 0 antes del deploy:** no publicar con placeholders ni CDNs.
- **Fases 4 y 5 se hicieron en paralelo** y el deploy (Fase 6) se dejó para el final, con el sitio ya completo.

## Regla de publicación de writeups

Solo se publican máquinas y retos **retirados** (las reglas de HTB/THM prohíben writeups de contenido activo). Mientras una máquina siga activa, el post se queda con `draft: true` en su rama.
