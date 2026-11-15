export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const normalizeTitle = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

export const yearRank = (year: number | string) =>
  typeof year === "number" ? year : 9999;

// Summaries are editorial units. Punctuation is not a safe sentence boundary
// (for example, U.S., initials, and decimal numbers).
export const publicationSummary = (
  publication: { summary: string; cardSummary?: string },
  metadata?: { card_summary?: string | null; plain_english_summary?: string | null }
) => {
  const summary = [publication.cardSummary, metadata?.card_summary, metadata?.plain_english_summary, publication.summary]
    .find((value) => value?.trim());
  return (summary ?? "").replace(/\s+/g, " ").trim();
};
