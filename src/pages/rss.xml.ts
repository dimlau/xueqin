import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  const sortedPosts = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: '甄仁岛·学勤网',
    description: '智识新陈代谢与数字海岛文存 — 记录微型乌托邦治理实践、思想火种与岛民人生。',
    site: context.site ?? 'https://xueq.in',
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
      categories: post.data.tags ?? [],
      author: post.data.guest_authors?.join(', ') || (typeof post.data.guest_author === 'string' ? post.data.guest_author : post.data.curator),
    })),
    customData: `<language>zh-CN</language>`,
  });
}
