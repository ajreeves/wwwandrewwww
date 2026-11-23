import assert from "node:assert/strict";
import test from "node:test";
import { relatedPublicationsFor } from "../src/utils/publication-related.ts";

const entry = (id, year, editorial = {}) => ({ id, data: { title: id, year, themes: ["Quantitative Methods"], editorial } });

test("the published counterpart leads related work, with no duplicates or self-links", () => {
  const paper = entry("reassessment-long", 2003, {
    relatedVersion: { slug: "reassessment", label: "Published article (2004)" },
    relatedSlugs: ["reassessment", "geolocation", "reassessment-long"]
  });
  const publications = [paper, entry("context", 2020), entry("geolocation", 2017), entry("reassessment", 2004)];
  assert.deepEqual(relatedPublicationsFor(paper, publications).map((entry) => entry.id), ["reassessment", "geolocation", "context"]);
  assert.deepEqual(relatedPublicationsFor(paper, publications, 1).map((entry) => entry.id), ["reassessment"]);
});

test("reviewed subject overlap connects papers while a shared generic method does not", () => {
  const paper = entry("municipal-administration", 2026);
  const publications = [paper, entry("geolocation", 2017), entry("poll-worker-retention", 2025), entry("private-funding", 2026)];
  assert.deepEqual(relatedPublicationsFor(paper, publications).map((entry) => entry.id), ["private-funding", "poll-worker-retention"]);
  assert.deepEqual(relatedPublicationsFor(entry("jobs", 2011), publications), []);
});

test("a misspelled explicit publication relationship fails instead of disappearing", () => {
  const paper = entry("reassessment-long", 2003, { relatedVersion: { slug: "missing-paper", label: "Published article" } });
  assert.throws(() => relatedPublicationsFor(paper, [paper]), /Missing related publication for reassessment-long: missing-paper/);
});
