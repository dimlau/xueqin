import type { CollectionEntry } from 'astro:content';
import { parseAuthors } from './authors';

export type BlogPost = CollectionEntry<'blog'>;

export interface TagStat {
  tag: string;
  count: number;
  posts: BlogPost[];
}

/** 中文标签直接进入 URL 也可以，但统一编码后更稳，避免空格、`#` 等字符出问题 */
export function tagSlug(tag: string): string {
  return encodeURIComponent(tag);
}

export function tagHref(tag: string): string {
  return `/tags/${tagSlug(tag)}`;
}

/** 汇总全站标签，按文章数降序、同数量按中文顺序排列 */
export function buildTagIndex(posts: BlogPost[]): TagStat[] {
  const map = new Map<string, BlogPost[]>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      const list = map.get(tag) ?? [];
      list.push(post);
      map.set(tag, list);
    }
  }

  return [...map.entries()]
    .map(([tag, list]) => ({
      tag,
      count: list.length,
      posts: list.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()),
    }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-CN'));
}

/** 从文章元数据里提取所有岛民/作者姓名，用来把“人物标签”和“主题标签”分开 */
export function getPersonNames(posts: BlogPost[]): Set<string> {
  const names = new Set<string>();

  for (const post of posts) {
    const authors = parseAuthors(post.data.guest_authors || post.data.guest_author);
    for (const author of authors) names.add(author);

    for (const pov of post.data.guest_povs ?? []) {
      if (pov.author) names.add(pov.author);
    }

    if (post.data.resident_snapshot?.name) names.add(post.data.resident_snapshot.name);
    if (post.data.curator) names.add(post.data.curator);
  }

  return names;
}

interface RelatedPost {
  post: BlogPost;
  score: number;
  sharedTags: string[];
}

/**
 * 按共同标签算相关文章。
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

/** 某个标签页上的“常一起出现”标签统计 */
export function getCoTags(tag: string, posts: BlogPost[], limit = 8): TagStat[] {
  const map = new Map<string, BlogPost[]>();

  for (const post of posts) {
    for (const other of post.data.tags) {
      if (other === tag) continue;
      const list = map.get(other) ?? [];
      list.push(post);
      map.set(other, list);
    }
  }

  return [...map.entries()]
    .map(([name, list]) => ({ tag: name, count: list.length, posts: list }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-CN'))
    .slice(0, limit);
}
