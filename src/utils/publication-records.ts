import type { CollectionEntry } from "astro:content";
import metadataIndex from "../data/publications/presentation/index.json" with { type: "json" };
import { normalizeTitle, publicationSummary } from "./publications.ts";

export type Publication = CollectionEntry<"publications">;
export type PublicationMetadata = (typeof metadataIndex)[number];
type PublicationIdentity = Pick<Publication, "id"> & {
  data: Pick<Publication["data"], "title" | "links">;
};
type MetadataIdentity = {
  slug: string;
  title: string;
  links?: { pdf?: string | null };
};

const metadataAliases: Readonly<Record<string, string>> = {
  "all-presidents-senators": "all-the-president-s-senators-presidential-co-partisans-and-the-allocation-of-federal-grant",
  "disunion-review": "review-of-the-state-of-disunion-regional-sources-of-modern-american-partisanship-by-nicole",
  "municipal-administration": "elections-and-representation-in-american-municipal-administration",
  "political-disaster": "political-disaster-unilateral-powers-electoral-incentives-and-presidential-disaster-declar",
  "presidential-particularism-divide-dollar": "presidential-particularism-and-divide-the-dollar-politics",
  "public-cost-unilateral-action": "the-public-cost-of-unilateral-action",
  spending: "the-influence-of-federal-spending-on-presidential-elections"
};

export const pdfBasename = (value: string) => {
  try {
    const filename = decodeURIComponent(new URL(value, "https://andrewreeves.org").pathname).split("/").pop() ?? "";
    return /\.pdf$/i.test(filename) ? filename.replace(/\.pdf$/i, "").toLowerCase() : "";
  } catch {
    return "";
  }
};

export function createPublicationResolver<T extends MetadataIdentity>(records: readonly T[], aliases = metadataAliases) {
  return (publication: PublicationIdentity): T | undefined => {
    const unique = (matches: T[]) => {
      if (matches.length > 1) throw new Error(`Ambiguous metadata for ${publication.id}: ${matches.map((record) => record.slug).join(", ")}`);
      return matches[0];
    };
    const alias = aliases[publication.id];
    if (alias) {
      const record = unique(records.filter((record) => record.slug === alias));
      if (!record) throw new Error(`Missing metadata alias for ${publication.id}: ${alias}`);
      return record;
    }
    const idMatch = unique(records.filter((record) => record.slug === publication.id));
    if (idMatch) return idMatch;
    const title = normalizeTitle(publication.data.title);
    const titleMatch = unique(records.filter((record) => normalizeTitle(record.title) === title));
    if (titleMatch) return titleMatch;
    const pdfs = publication.data.links.map((link) => pdfBasename(link.url)).filter(Boolean);
    const pdfMatch = unique(records.filter((record) => record.links?.pdf && pdfs.includes(pdfBasename(record.links.pdf))));
    if (pdfMatch) return pdfMatch;
    return unique(records.filter((record) => {
      const candidate = normalizeTitle(record.title);
      return title.length > 42 && candidate.length > 42 && (title.startsWith(candidate) || candidate.startsWith(title));
    }));
  };
}

export const getPublicationMetadata = createPublicationResolver(metadataIndex);

// These entries currently have no extracted PDF metadata. Keep the exceptions
// explicit so a new or accidentally broken mapping cannot silently fall back.
const contentOnlyPublications = new Set([
  "no-blank-check", // Book content is maintained in the books collection.
  "particularistic-president", // Book content is maintained in the books collection.
  "persistence-of-localism", // Chapter metadata has not been extracted.
  "recounts" // Chapter metadata has not been extracted.
]);

// Check mappings at build time instead of silently assigning one paper's facts
// to another. Middle initials may differ between bibliographic versions.
export function validatePublicationMappings(
  publications: Publication[],
  resolve: (publication: PublicationIdentity) => Pick<PublicationMetadata, "slug" | "authors"> | undefined = getPublicationMetadata
) {
  const used = new Map<string, string>();
  const authorKey = (name: string) => {
    const words = normalizeTitle(name).split(" ");
    return `${words[0]} ${words.at(-1)}`;
  };
  for (const publication of publications) {
    const metadata = resolve(publication);
    if (!metadata) {
      if (contentOnlyPublications.has(publication.id)) continue;
      throw new Error(`No canonical metadata for ${publication.id}`);
    }
    const prior = used.get(metadata.slug);
    if (prior) throw new Error(`${prior} and ${publication.id} resolve to the same metadata record`);
    used.set(metadata.slug, publication.id);
    const expected = metadata.authors.map(authorKey);
    const actual = publication.data.authors.map(authorKey);
    if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`Author count/order differs from canonical metadata for ${publication.id}`);
  }
}

const searchableText = (value: unknown): string => {
  if (Array.isArray(value)) return value.map(searchableText).join(" ");
  if (value && typeof value === "object") return Object.values(value).map(searchableText).join(" ");
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
};

export const publicationSearchText = (publication: Publication, metadata = getPublicationMetadata(publication)) =>
  searchableText([
    publication.data.title, publicationSummary(publication.data, metadata),
    publication.data.type, publication.data.year, publication.data.venue,
    publication.data.citation, publication.data.authors, publication.data.themes,
    publication.data.editorial,
    // Imported MDX prose can predate the corrected canonical record. Index the
    // content used by the research page, retaining prose for content-only entries.
    metadata ? undefined : publication.body,
    metadata?.title, metadata?.authors, metadata?.journal, metadata?.citation,
    metadata?.abstract, metadata?.plain_english_summary, metadata?.card_summary,
    metadata?.research_question, metadata?.research_highlights, metadata?.methods,
    metadata?.data_sources, metadata?.tags, metadata?.filters
  ]).replace(/\s+/g, " ").trim().toLowerCase();

export const publicationSearchEntry = (publication: Publication) => {
  const metadata = getPublicationMetadata(publication);
  return {
    title: publication.data.title,
    summary: publicationSummary(publication.data, metadata),
    type: publication.data.type,
    year: publication.data.year,
    searchText: publicationSearchText(publication, metadata),
    url: `/research/${publication.id}/`
  };
};
