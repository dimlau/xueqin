import type { CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

interface RelatedPost {
  post: BlogPost;
  score: number;
  sharedTags: string[];
}

/**
 * 按共同标签算相关文章（不生成独立标签页）。
 * 权重偏向“小众标签”：两篇文章都打了 #理发店，比都打了 #秩序留白 更能说明问题。
 */
export function getRelatedPosts(post: BlogPost, allPosts: BlogPost[], limit = 4): RelatedPost[] {
  const tagCounts = new Map<string, number>();
  for (const item of allPosts) {
    for (const tag of item.data.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  const weight = (tag: string) => {
    const count = tagCounts.get(tag) ?? 1;
    return Math.log(1 + allPosts.length / (1 + count));
  };

  const scored = allPosts
    .filter((item) => item.id !== post.id)
    .map((item) => {
      const sharedTags = item.data.tags.filter((tag) => post.data.tags.includes(tag));
      const score = sharedTags.reduce((sum, tag) => sum + weight(tag), 0);
      return { post: item, score, sharedTags };
    })
    .filter((item) => item.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf()
    );

  return scored.slice(0, limit);
}
