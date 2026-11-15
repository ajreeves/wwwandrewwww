import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const baseEntry = {
  title: z.string(),
  summary: z.string(),
  year: z.union([z.number(), z.string()]),
  themes: z.array(z.string()).default([]),
  featured: z.boolean().default(false)
};

const publications = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/publications" }),
  schema: z.object({
    ...baseEntry,
    type: z.enum(["Book", "Article", "Chapter", "Working Paper", "Review"]),
    venue: z.string(),
    authors: z.array(z.string()).default(["Andrew Reeves"]),
    citation: z.string().optional(),
    cardSummary: z.string().optional(),
    links: z
      .array(
        z.object({
          label: z.string(),
          url: z.string()
        })
      )
      .default([])
  })
});

const books = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/books" }),
  schema: z.object({
    ...baseEntry,
    subtitle: z.string().optional(),
    publisher: z.string(),
    coauthors: z.array(z.string()).default([]),
    cover: z.string(),
    coverCredit: z.string().optional(),
    url: z.string().optional(),
    amazonUrl: z.string().optional()
  })
});

const writing = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/writing" }),
  schema: z.object({
    ...baseEntry,
    dek: z.string(),
    outlet: z.string(),
    url: z.string().optional()
  })
});

export const collections = {
  publications,
  books,
  writing
};
