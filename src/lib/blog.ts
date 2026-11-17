import { getCollection, type CollectionEntry } from 'astro:content';
import getReadingTime from 'reading-time';

export type BlogPost = CollectionEntry<'blog'>;

// ── Metadata visual por categoría (usa roles del sistema de temas) ──
export const CATEGORY_META = {
    writeup: { label: 'WRITEUP', badge: 'bg-danger text-white' },
    proyecto: { label: 'PROYECTO', badge: 'bg-info text-white' },
    blog: { label: 'BLOG', badge: 'bg-special text-white' },
} as const;

// ── Etiquetas de dificultad (color por nivel) ──
export const DIFFICULTY_META = {
    easy: { label: 'EASY', badge: 'bg-success text-on-accent' },
    medium: { label: 'MEDIUM', badge: 'bg-warning text-on-accent' },
    hard: { label: 'HARD', badge: 'bg-danger text-white' },
    insane: { label: 'INSANE', badge: 'bg-secondary text-white' },
} as const;

/** Posts publicados (sin borradores en prod), ordenados por fecha desc. */
export async function getPublishedPosts(): Promise<BlogPost[]> {
    const posts = await getCollection('blog', ({ data }) => {
        return import.meta.env.PROD ? data.draft === false : true;
    });
    return posts.sort(
        (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
    );
}

/** Tiempo de lectura estimado en minutos a partir del cuerpo del post. */
export function readingMinutes(body: string | undefined): number {
    if (!body) return 1;
    return Math.max(1, Math.round(getReadingTime(body).minutes));
}

/** Formatea una fecha a algo tipo "15 JUN 2026". */
export function formatDate(date: Date): string {
    return date
        .toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
        .replace('.', '')
        .toUpperCase();
}

/** Línea de metadatos de un writeup: "HTB • EASY • LINUX". */
export function writeupMeta(data: BlogPost['data']): string {
    return [data.platform, data.difficulty?.toUpperCase(), data.os?.toUpperCase()]
        .filter(Boolean)
        .join(' • ');
}

/**
 * Posts relacionados con `current`, puntuados por tags en común y misma
 * categoría. Devuelve hasta `limit` (por defecto 2), del más al menos afín.
 */
export function getRelatedPosts(
    current: BlogPost,
    all: BlogPost[],
    limit = 2,
): BlogPost[] {
    const currentTags = new Set(current.data.tags);
    return all
        .filter((p) => p.id !== current.id)
        .map((p) => {
            const shared = p.data.tags.filter((t) => currentTags.has(t)).length;
            const sameCat = p.data.category === current.data.category ? 1 : 0;
            return { post: p, score: shared * 2 + sameCat };
        })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((x) => x.post);
}
