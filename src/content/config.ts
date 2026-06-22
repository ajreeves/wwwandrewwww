import { defineCollection, z } from "astro:content";

const baseEntry = {
  title: z.string(),
  summary: z.string(),
  year: z.union([z.number(), z.string()]),
  themes: z.array(z.string()).default([]),
  featured: z.boolean().default(false)
};

const publications = defineCollection({
  type: "content",
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
  type: "content",
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
  type: "content",
  schema: z.object({
    ...baseEntry,
    dek: z.string(),
    outlet: z.string(),
    url: z.string().optional()
  })
});

const timeline = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    year: z.number(),
    category: z.enum(["Book", "Article", "Leadership", "Grant", "Event"]),
    description: z.string(),
    themes: z.array(z.string()).default([])
  })
});

export const collections = {
  publications,
  books,
  writing,
  timeline
};
