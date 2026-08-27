export function parseAuthors(guestAuthor?: string | string[]): string[] {
  if (!guestAuthor) return [];
  if (Array.isArray(guestAuthor)) {
    return guestAuthor
      .flatMap((a) => (typeof a === 'string' ? a.split(/[、/&,，+]/) : []))
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (typeof guestAuthor === 'string') {
    return guestAuthor
      .split(/[、/&,，+]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export function formatAuthorNames(authors: string[]): string {
  if (authors.length === 0) return '';
  if (authors.length === 2) return `${authors[0]} × ${authors[1]}`;
  return authors.join('、');
}

export function getAuthorTitle(authors: string[]): string {
  return authors.length > 1 ? '本期特约共创' : '本期特约主笔';
}

const AVATAR_BG_CLASSES = [
  'bg-amber-800',
  'bg-[#78543e] dark:bg-[#8c654e]',
  'bg-[#516350] dark:bg-[#697f68]',
  'bg-[#565069] dark:bg-[#6e6785]',
];

export function getAvatarBgClass(index: number): string {
  return AVATAR_BG_CLASSES[index % AVATAR_BG_CLASSES.length];
}
