// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import expressiveCode from 'astro-expressive-code';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// https://astro.build/config
export default defineConfig({
  // Sitio en GitHub Pages (repo AndrewSthephen23.github.io, servido en la raíz).
  // Todo lo absoluto (canonical, Open Graph, sitemap, robots.txt, RSS) se
  // deriva de aquí: cambiar de dominio es cambiar esta línea.
  site: 'https://andrewsthephen23.github.io',

  // expressiveCode DEBE ir antes de mdx.
  integrations: [
    expressiveCode({
      // Sincroniza con los slots del sistema de temas LEGO (light=dev / dark=hacker).
      themes: ['github-dark', 'github-light'],
      themeCssSelector: (theme) =>
        `[data-mode="${theme.name === 'github-dark' ? 'dark' : 'light'}"]`,
      styleOverrides: {
        borderRadius: '0px',
        borderWidth: '2px',
        borderColor: 'var(--t-ink)',
        codeFontFamily: 'var(--t-font-mono)',
        uiFontFamily: 'var(--t-font-mono)',
        frames: {
          shadowColor: 'var(--t-shadow)',
        },
      },
    }),
    mdx(),
    // Iconos SVG inline (set Remix: `ri:*`) en vez de la fuente de RemixIcon por CDN.
    icon(),
    // sitemap-index.xml + sitemap-0.xml; la 404 no se indexa.
    sitemap({
      filter: (page) => !new URL(page).pathname.startsWith('/404'),
    }),
  ],

  markdown: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        { behavior: 'wrap', properties: { class: 'heading-anchor' } },
      ],
    ],
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
