# M3ow5N0IR — Portafolio y blog de CTF

Portafolio personal con estética **neobrutalista** y un blog de *write-ups* de
máquinas y retos CTF (Hack The Box, TryHackMe…), proyectos y notas técnicas.
Tiene dos temas que se alternan desde el nav: **DEV** (claro) y **HACKER**
(oscuro, terminal de fósforo verde).

Sitio estático: sin frameworks JS, sin CDNs externos (fuentes e iconos van
empaquetados) y con unos pocos scripts vanilla.

## Stack

| Pieza | Uso |
|-------|-----|
| [Astro 5](https://astro.build) | Generador estático, páginas y Content Collections |
| [Tailwind CSS 4](https://tailwindcss.com) | Estilos, con utilidades semánticas ligadas a los temas |
| `@astrojs/mdx` | Componentes dentro de los posts (`.mdx`) |
| `astro-expressive-code` | Bloques de código con marco de terminal y botón copiar |
| `astro-icon` + `@iconify-json/ri` | Iconos Remix como SVG inline |
| Fontsource | Space Grotesk y JetBrains Mono self-hosted |
| `@astrojs/sitemap` + `@astrojs/rss` | Sitemap y feed RSS del blog |
| `@astrojs/check` + TypeScript | Verificación de tipos |

Requiere Node 24 (ver `.nvmrc`).

## Comandos

```bash
npm ci            # instala las dependencias exactas del lockfile
npm run dev       # servidor de desarrollo en http://localhost:4321
npm run check     # verificación de tipos y diagnósticos de Astro
npm run build     # genera el sitio estático en dist/
npm run preview   # sirve dist/ localmente para revisar el build
npm run brand     # regenera favicons, imagen OG y site.webmanifest en public/
```

## Estructura

```
├── docs/                  Planes y guías (roadmap, temas, cómo publicar)
├── public/                Archivos servidos tal cual (favicons, OG, manifest, cv.pdf)
├── scripts/               generate-brand-assets.mjs (favicons e imagen OG) y check-contrast.mjs (contraste de los temas)
└── src/
    ├── components/        Secciones de la home (Skills, Experience, Contact…)
    │   └── mdx/           Componentes para posts: <Callout>, <Terminal>, <Flag>
    ├── content/blog/      Posts en .md / .mdx  ← aquí se escribe
    ├── content.config.ts  Schema (Zod) del frontmatter de los posts
    ├── assets/            Imágenes propias optimizadas (avatar, projects/)
    ├── data/site.ts       Datos del perfil: alias, GitHub, email, redes, ubicación, avatar, CV
    ├── data/projects.ts   Proyectos de Selected Works
    ├── data/certs.ts      Certificaciones y badges
    ├── data/seo.ts        Descripción por defecto, imagen OG y datos del RSS
    ├── data/nav.ts        Enlaces del nav (escritorio y menú móvil)
    ├── layouts/           Layout.astro: <head>, nav, footer y config de temas
    ├── lib/blog.ts        Utilidades del blog (orden, relacionados, tiempo de lectura)
    ├── pages/             Rutas: /, /blog, /blog/[slug], la 404, /rss.xml y /robots.txt
    └── styles/
        ├── global.css     Fuentes, puente tokens → Tailwind y estilos base
        └── themes/        Un archivo por tema (dev.css, hacker.css, _plantilla.css)
```

## Datos del perfil

Alias, enlaces y datos de contacto viven en un solo archivo:
[`src/data/site.ts`](src/data/site.ts). Los campos opcionales vacíos no se
muestran en la web (no quedan enlaces rotos). Por ejemplo, el formulario de
contacto solo aparece cuando `email` tiene valor.

### Imágenes, CV y certificaciones (opcionales)

Nada de esto es obligatorio: mientras falte, la web muestra una alternativa
diseñada (no un hueco) o simplemente no renderiza la sección.

| Qué | Dónde va el archivo | Qué campo rellenar | Sin él |
|-----|--------------------|--------------------|--------|
| Captura de un proyecto | `src/assets/projects/mi-proyecto.png` | `image: "mi-proyecto.png"` (y opcional `imageAlt`) en [`src/data/projects.ts`](src/data/projects.ts) | Portada generada con los colores del tema (`accent`, `pattern`, `icon`) |
| Foto/avatar de "Who am I?" | `src/assets/avatar.jpg` | `avatar: "avatar.jpg"` y `avatarAlt` en [`src/data/site.ts`](src/data/site.ts) | Avatar pixel-art generado |
| CV en PDF | `public/cv.pdf` | `cv: "/cv.pdf"` en `src/data/site.ts` | No aparece el botón "Descargar CV" |
| Certificaciones / badges | — | Entradas en [`src/data/certs.ts`](src/data/certs.ts) | No aparece la sección "Certs & Badges" |

- Las imágenes de `src/assets/` se optimizan en el build con `<Image />` de
  `astro:assets` (WebP, varios anchos, `loading="lazy"`). Sirven PNG, JPG,
  WebP o AVIF; mejor de al menos 1200 px de ancho para las capturas.
- Si un campo apunta a un archivo que no existe, el build falla con un
  mensaje que dice cuál falta.
- Escribe un `alt` que describa la imagen ("Panel de resultados del escáner
  con 3 hallazgos críticos"), no solo el nombre del proyecto.
- Revisa que las capturas no muestren credenciales, IPs internas ni flags.

## Publicar un post

1. Crea `src/content/blog/mi-post.md` (o `.mdx` para usar `<Callout>`,
   `<Terminal>` y `<Flag>`). El nombre del archivo es la URL: `/blog/mi-post/`.
2. Rellena el frontmatter: `title`, `description` y `pubDate` son
   obligatorios; `category`, `platform`, `difficulty`, `os`, `tags` y `draft`
   son opcionales.
3. Revísalo con `npm run dev` en `/blog`, en ambos temas.
4. Haz commit en una rama (`post/htb-nombre`) y abre un PR.
5. Cuando el CI pase, fusiona el PR: el post queda publicado en unos minutos.

Solo se publican máquinas y retos **retirados**; mientras sigan activos, el
post se queda con `draft: true`.

Guía completa (campos, componentes MDX, errores comunes):
[docs/COMO_PUBLICAR.md](docs/COMO_PUBLICAR.md).

## Despliegue

El sitio se publica en GitHub Pages: <https://andrewsthephen23.github.io>.

Cada push a `main` ejecuta el workflow [`ci.yml`](.github/workflows/ci.yml):
`astro check`, `astro build` y la verificación de placeholders; si todo pasa,
el job `deploy` publica `dist/`. En los PRs no se despliega: el sitio
compilado queda como artifact descargable.

La URL sale de `site` en `astro.config.mjs`; para usar un dominio propio se
configura en Pages y se cambia esa línea.

## Sistema de temas

Los componentes nunca usan colores directos: hablan en roles (`bg-panel`,
`text-ink`, `shadow-hard`…) y cada tema es un archivo de
`src/styles/themes/` que da valor a los tokens `--t-*`. Qué tema ocupa el slot
claro y cuál el oscuro se decide en `THEME_SLOTS`
([`src/layouts/Layout.astro`](src/layouts/Layout.astro)).

Cómo funciona, cómo crear un tema nuevo y checklist de QA:
[docs/GUIA_TEMAS.md](docs/GUIA_TEMAS.md).

## Roadmap

- [docs/PLAN_FASES.md](docs/PLAN_FASES.md): fases, tareas y estado.
- [docs/PLAN_MEJORAS.md](docs/PLAN_MEJORAS.md): diseño y motivación de cada mejora.
