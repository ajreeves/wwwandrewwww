import assert from "node:assert/strict";
import test from "node:test";
import { createPublicationResolver, pdfBasename, publicationSearchText, validatePublicationMappings } from "../src/utils/publication-records.ts";

const publication = (id, title, pdf = "/papers/paper.pdf") => ({
  id,
  data: { title, links: [{ label: "PDF", url: pdf }], type: "Article", authors: ["Andrew Reeves", "Jon C. Rogowski"] }
});

test("PDF identity uses the pathname for relative and absolute links", () => {
  for (const url of ["/papers/My%20Paper.PDF", "https://andrewreeves.org/papers/My%20Paper.PDF?download=1#page=2"]) {
    assert.equal(pdfBasename(url), "my paper");
  }
  assert.equal(pdfBasename("https://andrewreeves.org/research/paper/"), "");
  const record = { slug: "canonical", title: "A different catalog title", links: { pdf: "/papers/paper.pdf" } };
  assert.equal(createPublicationResolver([record], {})(publication("paper", "Display title", "https://andrewreeves.org/papers/paper.pdf#page=2")), record);
});

test("ambiguous title, PDF, and prefix matches fail instead of taking the first record", () => {
  const longTitle = "An intentionally long publication title that exceeds the prefix threshold";
  for (const [records, entry] of [
    [[{slug:"a",title:"Same title"},{slug:"b",title:"Same title"}], publication("x","Same title")],
    [[{slug:"a",title:"One",links:{pdf:"/papers/paper.pdf"}},{slug:"b",title:"Two",links:{pdf:"https://host.test/papers/paper.pdf"}}], publication("x","Other")],
    [[{slug:"a",title:longTitle+": one"},{slug:"b",title:longTitle+": two"}], publication("x",longTitle)]
  ]) assert.throws(() => createPublicationResolver(records, {})(entry), /Ambiguous metadata/);
  assert.throws(() => createPublicationResolver([], {x:"missing"})(publication("x","Title")), /Missing metadata alias/);
});

test("build validation catches missing mappings, duplicate mappings, and author count/order drift", () => {
  const entry = publication("paper", "A paper");
  const record = {slug:"canonical", authors:["Andrew Reeves", "Jon Rogowski"]};
  assert.doesNotThrow(() => validatePublicationMappings([entry], () => record));
  assert.throws(() => validatePublicationMappings([entry], () => undefined), /No canonical metadata/);
  assert.throws(() => validatePublicationMappings([entry, {...entry,id:"duplicate"}], () => record), /same metadata record/);
  for (const authors of [["Andrew Reeves"],["Jon Rogowski", "Andrew Reeves"]]) {
    assert.throws(() => validatePublicationMappings([entry], () => ({...record,authors})), /Author count\/order/);
  }
});

test("search includes coauthors, venue, abstract, and page text", () => {
  const entry = publication("paper", "A paper");
  entry.data.venue = "American Political Science Review";
  entry.body = "A distinctive explanation from the publication page.";
  const text = publicationSearchText(entry, {abstract:"An abstract-only phrase: administrative discretion."});
  for (const term of ["rogowski", "american political science review", "administrative discretion", "distinctive explanation"]) assert(text.includes(term));
});
