import type { Publication } from "./publication-records.ts";
import { publicationTopics } from "../data/research-topics.ts";
import { yearRank } from "./publications.ts";

// Explicit relationships lead; shared subjects fill the remaining places.
// Generic methods and incidental keywords do not establish a research connection.
export function relatedPublicationsFor(publication: Publication, publications: Publication[], limit = 5) {
  const byId = new Map(publications.map((entry) => [entry.id, entry]));
  const selected = new Map<string, Publication>();
  const curatedIds = [publication.data.editorial?.relatedVersion?.slug, ...(publication.data.editorial?.relatedSlugs ?? [])];
  for (const id of curatedIds) {
    if (!id || id === publication.id) continue;
    const entry = byId.get(id);
    if (!entry) throw new Error(`Missing related publication for ${publication.id}: ${id}`);
    selected.set(id, entry);
  }

  const topics = new Set(publicationTopics(publication));
  const candidates = publications
    .filter((entry) => entry.id !== publication.id && !selected.has(entry.id))
    .map((entry) => ({ entry, sharedTopics: publicationTopics(entry).filter((topic) => topics.has(topic)).length }))
    .filter(({ sharedTopics }) => sharedTopics > 0)
    .sort((a, b) => b.sharedTopics - a.sharedTopics || yearRank(b.entry.data.year) - yearRank(a.entry.data.year) || a.entry.data.title.localeCompare(b.entry.data.title));
  candidates.forEach(({ entry }) => selected.set(entry.id, entry));
  return [...selected.values()].slice(0, limit);
}
