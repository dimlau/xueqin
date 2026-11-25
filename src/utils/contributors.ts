import type { CollectionEntry } from 'astro:content';
import { parseAuthors } from './authors';

export type BlogPost = CollectionEntry<'blog'>;

export interface Contributor {
  name: string;
  occupation?: string;
  posts: BlogPost[];
}

/** 市政厅/公孙雅署名的月度纪事不是特约岛民，不建作者页 */
function isGuestContributor(name: string): boolean {
  return Boolean(name.trim()) && !/公孙雅|市政厅|史官/.test(name);
}

/**
 * 一篇文章的署名岛民。
 * 以 guest_authors 为唯一身份来源：岛屿纪事与甄仁茶叙都使用这个字段，
 * guest_povs 只用于补充职业等展示信息，不参与作者归集。
 */
export function getPostContributors(post: BlogPost): string[] {
  return [
    ...new Set(
      parseAuthors(post.data.guest_authors)
        .map((name) => name.trim())
        .filter(isGuestContributor)
    ),
  ];
}

function getOccupation(post: BlogPost, name: string): string | undefined {
  const pov = post.data.guest_povs?.find((item) => item.author?.trim() === name);
  const occupation =
    pov?.occupation?.trim() ||
    (post.data.resident_snapshot?.name?.trim() === name
      ? post.data.resident_snapshot.occupation?.trim()
      : undefined);

  return occupation && occupation !== '岛民' ? occupation : undefined;
}

/** 全站特约作者名录（按参与篇数降序） */
export function getContributors(posts: BlogPost[]): Contributor[] {
  const sorted = [...posts].sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
  const map = new Map<string, Contributor>();

  for (const post of sorted) {
    for (const name of getPostContributors(post)) {
      const contributor = map.get(name) ?? { name, posts: [] };
      contributor.posts.push(post);
      if (!contributor.occupation) {
        contributor.occupation = getOccupation(post, name);
      }
      map.set(name, contributor);
    }
  }

  return [...map.values()].sort(
    (a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name, 'zh-CN')
  );
}

export function getContributorNames(posts: BlogPost[]): Set<string> {
  return new Set(getContributors(posts).map((item) => item.name));
}

export function authorHref(name: string): string {
  return `/authors/${encodeURIComponent(name)}`;
}
