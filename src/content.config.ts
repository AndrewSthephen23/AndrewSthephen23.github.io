import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ════════════════════════════════════════════════════════════
// Colección BLOG — writeups de CTF, proyectos y posts.
// Para publicar: crea un .md o .mdx en src/content/blog/ con
// el frontmatter que valida este schema. Ver README para el
// paso a paso y src/content/blog/*.md como plantilla.
// ════════════════════════════════════════════════════════════
const blog = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
    schema: ({ image }) =>
        z.object({
            // ── Obligatorios ──
            title: z.string(),
            description: z.string(),
            pubDate: z.coerce.date(),

            // ── Clasificación ──
            category: z.enum(['writeup', 'proyecto', 'blog']).default('blog'),

            // ── Solo para writeups (opcionales) ──
            platform: z.enum(['HTB', 'THM', 'CTF', 'otro']).optional(),
            difficulty: z.enum(['easy', 'medium', 'hard', 'insane']).optional(),
            os: z.enum(['linux', 'windows', 'otro']).optional(),

            // ── Metadatos comunes ──
            updatedDate: z.coerce.date().optional(),
            tags: z.array(z.string()).default([]),
            image: image().optional(), // portada / OG (optimizada con astro:assets)
            draft: z.boolean().default(false), // los borradores no salen en prod
        }),
});

export const collections = { blog };
