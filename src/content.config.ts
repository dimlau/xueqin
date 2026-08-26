import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    category: z.enum(['resident_spotlight', 'governance', 'reading_digest', 'dialogue']).default('governance'),
    guest_author: z.string().optional(),
    curator: z.string().default('公孙雅'),
    tags: z.array(z.string()).default([]),
    island_epoch: z.string().optional(),
    mayor_mood: z.string().optional(),
    resident_snapshot: z.object({
      name: z.string().optional(),
      occupation: z.string().optional(),
      mbti: z.string().optional(),
    }).optional(),
  }),
});

export const collections = { blog };
