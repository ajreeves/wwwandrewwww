import assert from "node:assert/strict";
import test from "node:test";
import { publicationArchiveLinks, publicationCitation, publicationLinks, compactPublicationAuthors } from "../src/utils/publication-citations.ts";

const entry = (changes = {}) => ({
  id: "example",
  data: { title: "An Article about U.S. Politics", type: "Article", year: 2026, venue: "A Journal", authors: ["First Author", "Second Author", "Andrew Reeves", "Fourth Author"], links: [], ...changes }
});
const tagsFor = (citation, name) => citation.tags.filter((tag) => tag.name === name).map((tag) => tag.content);

test("maintained resources override extracted URLs and archive actions use article DOI before a journal homepage", () => {
  const paper = entry({ links: [{ label: "PDF", url: "/papers/current.pdf" }, { label: "Data", url: "https://data.example/current" }] });
  const metadata = { doi: "10.1000/article", links: { pdf: "http://old.example/paper.pdf", replication_data: "https://data.example/old", journal: "https://journal.example/" } };
  assert.deepEqual(publicationArchiveLinks(paper, metadata), [
    { label: "PDF", url: "/papers/current.pdf" },
    { label: "Replication", url: "https://data.example/current" },
    { label: "Publisher", url: "https://doi.org/10.1000/article" }
  ]);
  assert.equal(publicationLinks(paper, metadata).filter((link) => link.label === "Replication Data").length, 1);
  assert.deepEqual(publicationArchiveLinks(entry(), {}), []);
});

test("journal citations preserve every author, known publication year, canonical URLs and page range", () => {
  const paper = entry({ links: [{ label: "PDF", url: "/papers/current.pdf" }] });
  const citation = publicationCitation(paper, { journal: "Verified Journal", year: 2025, volume: "79", issue: "1", pages: "323–339", doi: "10.1000/article" });
  assert.deepEqual(tagsFor(citation, "citation_author"), paper.data.authors);
  assert.deepEqual(tagsFor(citation, "citation_publication_date"), ["2026"]);
  assert.deepEqual(tagsFor(citation, "citation_pdf_url"), ["https://andrewreeves.org/papers/current.pdf"]);
  assert.deepEqual(tagsFor(citation, "citation_abstract_html_url"), ["https://andrewreeves.org/research/example/"]);
  assert.deepEqual(tagsFor(citation, "citation_firstpage"), ["323"]);
  assert.deepEqual(tagsFor(citation, "citation_lastpage"), ["339"]);
  assert.match(citation.bibtex, /author = \{First Author and Second Author and Andrew Reeves and Fourth Author\}/);
  assert.match(citation.bibtex, /pages = \{323--339\}/);
  assert.match(citation.bibtex, /journal = \{Verified Journal\}/);
  assert.equal(compactPublicationAuthors(paper.data.authors), "First Author, Second Author, Andrew Reeves, et al.");
  assert.equal(compactPublicationAuthors(paper.data.authors.slice(0, 3)), "First Author, Second Author, Andrew Reeves");
});

test("forthcoming chapters include book and editors without inventing a publication date or journal", () => {
  const citation = publicationCitation(entry({ type: "Chapter", year: "Forthcoming", venue: "Handbook", bibliography: { editors: ["An Editor", "Another Editor"], publisher: "De Gruyter" } }), {});
  assert.deepEqual(tagsFor(citation, "citation_publication_date"), []);
  assert.deepEqual(tagsFor(citation, "citation_journal_title"), []);
  assert.deepEqual(tagsFor(citation, "citation_inbook_title"), ["Handbook"]);
  assert.match(citation.bibtex, /^@incollection\{/);
  assert.match(citation.bibtex, /editor = \{An Editor and Another Editor\}/);
  assert.match(citation.bibtex, /note = \{Forthcoming\}/);
  assert.doesNotMatch(citation.bibtex, /\n  year =/);
});

test("book and working-paper citations use the right type and omit placeholder bibliographic fields", () => {
  const citation = publicationCitation(entry({ type: "Book", venue: "Cambridge University Press", year: "2022" }), { volume: "0", issue: "00", pages: "0" });
  assert.match(citation.bibtex, /^@book\{/);
  assert.match(citation.bibtex, /publisher = \{Cambridge University Press\}/);
  for (const name of ["citation_journal_title", "citation_volume", "citation_issue", "citation_firstpage", "citation_pdf_url"]) assert.deepEqual(tagsFor(citation, name), []);
  const working = publicationCitation(entry({ type: "Working Paper" }), {});
  assert.match(working.bibtex, /^@unpublished\{/);
  assert.match(working.bibtex, /note = \{Working paper\}/);
});

test("BibTeX escapes special characters and protects capitalization while HTML metadata retains the actual title", () => {
  const title = "U.S. Politics & 50% {Support}_A #1";
  const citation = publicationCitation(entry({ title }), {});
  assert.deepEqual(tagsFor(citation, "citation_title"), [title]);
  assert(citation.bibtex.includes("title = {{U.S. Politics \\& 50\\% \\{Support\\}\\_A \\#1}}"));
});

test("owned PDFs stay on the current deployment while citations stay canonical and external PDFs are preserved", () => {
  for (const url of ["http://andrewreeves.org/papers/current.pdf", "https://www.andrewreeves.org/papers/current.pdf"]) {
    const paper = entry({ links: [{ label: "PDF", url: `${url}?download=1#page=2` }] });
    assert.equal(publicationArchiveLinks(paper, {})[0].url, "/papers/current.pdf?download=1#page=2");
    assert.deepEqual(tagsFor(publicationCitation(paper, {}), "citation_pdf_url"), ["https://andrewreeves.org/papers/current.pdf?download=1#page=2"]);
  }
  const external = "https://publisher.example/papers/current.pdf";
  assert.equal(publicationArchiveLinks(entry({ links: [{ label: "PDF", url: external }] }), {})[0].url, external);
  assert.equal(publicationLinks(entry({ links: [{ label: "Data", url: "http://hdl.handle.net/1902.1/21320" }] }), {})[0].url, "https://hdl.handle.net/1902.1/21320");
});

test("maintained DOI overrides extraction consistently in citation tags and BibTeX", () => {
  const paper = entry({ links: [{ label: "DOI", url: "https://doi.org/10.1000/verified" }] });
  const citation = publicationCitation(paper, { doi: "10.1000/stale" });
  assert.deepEqual(tagsFor(citation, "citation_doi"), ["10.1000/verified"]);
  assert.match(citation.bibtex, /doi = \{10.1000\/verified\}/);
  assert.doesNotMatch(citation.bibtex, /stale/);
});
