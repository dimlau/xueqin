import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    category: z.enum([
      'island_chronicle',   // 岛屿纪事 (POV)
      'mayor_essay',        // 市长随笔
      'weekly_podcast',     // 甄仁茶叙（每周三播客周刊）
      'resident_spotlight', // 岛民特写（兼容别名）
    ]).default('mayor_essay'),
    episode: z.number().optional(),
    audio_url: z.string().optional(),
    audio_size: z.number().optional(),
    audio_duration: z.string().optional(),
    guest_author: z.union([z.string(), z.array(z.string())]).optional(),
    guest_authors: z.array(z.string()).optional(),
    guest_povs: z.array(z.object({
      author: z.string(),
      occupation: z.string().optional(),
      growth_note: z.string().optional(),
      content: z.string(),
    })).optional(),
    curator: z.string().default('公孙雅'),
    tags: z.array(z.string()).default([]),
    resident_snapshot: z.object({
      name: z.string().optional(),
      occupation: z.string().optional(),
      email: z.string().optional(),
    }).optional(),
  }),
});

export const collections = { blog };
