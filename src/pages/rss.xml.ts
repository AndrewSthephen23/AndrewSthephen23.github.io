import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts, CATEGORY_META } from '../lib/blog';
import { seo } from '../data/seo';

// Feed RSS del blog en /rss.xml. Usa el mismo criterio que /blog:
// sin borradores en producción, del más reciente al más antiguo.
export async function GET(context: APIContext) {
    const posts = await getPublishedPosts();

    return rss({
        title: seo.rss.title,
        description: seo.rss.description,
        // `site` viene de astro.config.mjs: los enlaces salen absolutos.
        site: context.site ?? context.url.origin,
        trailingSlash: true,
        customData: `<language>${seo.lang}</language>`,
        items: posts.map((post) => ({
            title: post.data.title,
            description: post.data.description,
            pubDate: post.data.pubDate,
            link: `/blog/${post.id}/`,
            categories: [
                CATEGORY_META[post.data.category].label.toLowerCase(),
                ...post.data.tags,
            ],
        })),
    });
}
