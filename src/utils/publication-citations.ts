import { getPublicationMetadata, type Publication, type PublicationMetadata } from "./publication-records.ts";

type Link = { label: string; url: string };
type Metadata = Partial<PublicationMetadata>;
const siteUrl = "https://andrewreeves.org";
// Browsing PDFs stays on the current deployment; citation metadata stays canonical.
const resourceUrl = (input: string) => {
  try {
    const url = new URL(input, siteUrl);
    if (["andrewreeves.org", "www.andrewreeves.org"].includes(url.hostname) && url.pathname.startsWith("/papers/")) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
    if (url.hostname === "hdl.handle.net" && url.protocol === "http:") {
      url.protocol = "https:";
      return url.href;
    }
  } catch { /* Leave non-URL input for content validation. */ }
  return input;
};
const value = (input: unknown) => {
  const text = String(input ?? "").trim();
  return /^(?:0+)?$/.test(text) ? "" : text;
};

// Maintained front matter takes precedence over older extracted PDF metadata.
export function publicationLinks(publication: Publication, metadata: Metadata | undefined = getPublicationMetadata(publication)): Link[] {
  const links = new Map<string, Link>();
  const add = (label: string, url?: string | null) => {
    const cleanUrl = resourceUrl(value(url));
    const normalizedLabel = label === "Data" ? "Replication Data" : label;
    if (cleanUrl && !links.has(normalizedLabel)) links.set(normalizedLabel, { label: normalizedLabel, url: cleanUrl });
  };
  publication.data.links.forEach((link) => add(link.label, link.url));
  add("PDF", metadata?.links?.pdf);
  add("DOI", metadata?.doi ? `https://doi.org/${metadata.doi.replace(/^https?:\/\/(?:dx\.)?doi\.org\//, "")}` : undefined);
  add("Journal", metadata?.links?.journal);
  add("Replication Data", metadata?.links?.replication_data);
  add("Code", metadata?.links?.code);
  const order = ["PDF", "DOI", "Journal", "Publisher", "Replication Data", "Code", "Research Profile"];
  return [...links.values()].sort((a, b) => {
    const rank = (label: string) => order.includes(label) ? order.indexOf(label) : 99;
    return rank(a.label) - rank(b.label) || a.label.localeCompare(b.label);
  });
}

export function publicationArchiveLinks(publication: Publication, metadata?: Metadata) {
  const links = publicationLinks(publication, metadata);
  const pick = (...labels: string[]) => labels.map((label) => links.find((link) => link.label === label)).find(Boolean);
  return [
    { label: "PDF", link: pick("PDF") },
    { label: "Replication", link: pick("Replication Data") },
    { label: "Publisher", link: pick("Publisher", "DOI", "Journal") }
  ].flatMap(({ label, link }) => link ? [{ label, url: link.url }] : []);
}

export const compactPublicationAuthors = (authors: string[]) =>
  authors.length > 3 ? `${authors.slice(0, 3).join(", ")}, et al.` : authors.join(", ");

const escapeBibTeX = (text: string) => text.replace(/[\\{}&%$#_~^]/g, (character) => ({
  "\\": "\\textbackslash{}", "{": "\\{", "}": "\\}", "&": "\\&", "%": "\\%",
  "$": "\\$", "#": "\\#", "_": "\\_", "~": "\\textasciitilde{}", "^": "\\textasciicircum{}"
}[character]!));

export function publicationCitation(publication: Publication, metadata: Metadata | undefined = getPublicationMetadata(publication)) {
  const { data } = publication;
  const links = publicationLinks(publication, metadata);
  const url = `${siteUrl}/research/${publication.id}/`;
  const pdf = links.find((link) => link.label === "PDF")?.url;
  const doi = links.find((link) => link.label === "DOI")?.url.replace(/^https?:\/\/(?:dx\.)?doi\.org\//, "");
  const year = /^\d{4}$/.test(String(data.year)) ? String(data.year) : "";
  const venue = data.type === "Working Paper" ? data.venue : value(metadata?.journal) || data.venue;
  const pages = value(data.bibliography?.pages ?? metadata?.pages);
  const pageRange = pages.split(/\s*[-–—]+\s*/);
  const publisher = data.bibliography?.publisher || (data.type === "Book" ? venue : "");
  const tags: { name: string; content: string }[] = [];
  const tag = (name: string, content: unknown) => {
    if (value(content)) tags.push({ name, content: value(content) });
  };
  tag("citation_title", data.title);
  data.authors.forEach((author) => tag("citation_author", author));
  tag("citation_publication_date", year);
  tag("citation_abstract_html_url", url);
  tag("citation_pdf_url", pdf ? new URL(pdf, siteUrl).href : "");
  tag("citation_doi", doi);
  if (data.type === "Article" || data.type === "Review") tag("citation_journal_title", venue);
  if (data.type === "Chapter") tag("citation_inbook_title", venue);
  tag("citation_publisher", publisher);
  tag("citation_volume", metadata?.volume);
  tag("citation_issue", metadata?.issue);
  tag("citation_firstpage", pageRange[0]);
  if (pageRange.length > 1) tag("citation_lastpage", pageRange.at(-1));

  const type = data.type === "Book" ? "book" : data.type === "Chapter" ? "incollection" : data.type === "Working Paper" ? "unpublished" : "article";
  const fields: [string, string][] = [];
  const field = (name: string, content: unknown) => {
    if (value(content)) fields.push([name, escapeBibTeX(value(content))]);
  };
  field("author", data.authors.join(" and "));
  // Protect the published title's capitalization in styles that downcase titles.
  fields.push(["title", `{${escapeBibTeX(data.title)}}`]);
  field("year", year);
  if (type === "article") field("journal", venue);
  if (type === "incollection") field("booktitle", venue);
  field("editor", data.bibliography?.editors?.join(" and "));
  field("publisher", publisher);
  field("volume", metadata?.volume);
  field("number", metadata?.issue);
  field("pages", pages.replace(/\s*[-–—]+\s*/g, "--"));
  field("doi", doi);
  field("url", url);
  if (!year) field("note", data.year);
  else if (type === "unpublished") field("note", "Working paper");
  const key = `reeves-${year || "forthcoming"}-${publication.id}`.replace(/[^a-zA-Z0-9-]/g, "");
  return { tags, bibtex: `@${type}{${key},\n${fields.map(([name, content]) => `  ${name} = {${content}}`).join(",\n")}\n}` };
}
