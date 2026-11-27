import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// One Markdown file per article in `src/content/blog/` (no MDX)
	loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			// Topics ("Zod", "Playwright"…): shown next to the date, each one gets a page under /blog/topic/
			tags: z.array(z.string()).default([]),
			// The "In short:" box under the title, about 3 lines. The description stays the shorter meta text.
			summary: z.string().optional(),
			// Image shared on social networks (Open Graph), 1200 × 630. Not shown on the page.
			heroImage: z.optional(image()),
			// A draft only shows up in `yarn dev`, or in a build run with SHOW_DRAFTS=1
			draft: z.boolean().default(false),
			// "The code" card at the end of the article
			repo: z
				.object({
					name: z.string(),
					url: z.url(),
					description: z.string(),
				})
				.optional(),
			// "Discuss" box at the end: the question to readers, and the threads where the article was shared
			discuss: z
				.object({
					question: z.string(),
					devto: z.url().optional(),
					reddit: z.url().optional(),
				})
				.optional(),
		}),
});

export const collections = { blog };
