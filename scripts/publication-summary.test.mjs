import assert from "node:assert/strict";
import test from "node:test";
import { publicationSummary } from "../src/utils/publications.ts";

test("preserves U.S. abbreviations and the complete finding", () => {
  const summary = "This article finds that U.S. bellwether counties are poor predictors of future elections.";
  assert.equal(publicationSummary({ summary: "Fallback" }, { card_summary: summary }), summary);
});

test("preserves initials, decimal values, and multiple complete sentences", () => {
  const summary = "R. M. Stein and colleagues observed voters. The mean was 2.5 minutes.";
  assert.equal(publicationSummary({ summary }), summary);
});

test("uses curated copy consistently for cards, detail pages, and descriptions", () => {
  assert.equal(publicationSummary({ summary: "Fallback", cardSummary: "Curated summary." }, { card_summary: "Generated summary." }), "Curated summary.");
});

test("falls back past empty values and normalizes whitespace without losing words", () => {
  assert.equal(publicationSummary({ summary: "Fallback", cardSummary: " " }, { card_summary: null, plain_english_summary: " U.S.\n presidents\trespond. " }), "U.S. presidents respond.");
});
