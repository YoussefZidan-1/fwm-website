import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  // Loads all .md files directly from the fwm-repo/docs submodule
  loader: glob({ pattern: '**/*.md', base: './fwm-repo/docs' }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
});

export const collections = { docs };