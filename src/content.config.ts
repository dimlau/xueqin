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
      'cross_reflections',  // 他山之石 (外部博文深度回应)
      'mayor_essay',        // 市长随笔 (个人反思与感悟)
    ]).default('mayor_essay'),
    guest_author: z.string().optional(),
    curator: z.string().default('公孙雅'),
    tags: z.array(z.string()).default([]),
    reference_post: z.object({
      title: z.string().optional(),
      author: z.string().optional(),
      url: z.string().optional(),
      blog_name: z.string().optional(),
    }).optional(),
    resident_snapshot: z.object({
      name: z.string().optional(),
      occupation: z.string().optional(),
    }).optional(),
  }),
});

export const collections = { blog };
