import assert from "node:assert/strict";
import test from "node:test";
import { readdir } from "node:fs/promises";
import { publicationTopics, publicationMatchesTopic, publicationTopicAssignments, researchTopics } from "../src/data/research-topics.ts";

test("every publication has reviewed, valid topic membership, including explicit unassigned work", async () => {
  const ids = (await readdir(new URL("../src/content/publications/", import.meta.url))).filter((name) => name.endsWith(".mdx")).map((name) => name.replace(/\.mdx$/, ""));
  assert.deepEqual(Object.keys(publicationTopicAssignments).sort(), ids.sort());
  const valid = new Set(researchTopics.map((topic) => topic.slug));
  for (const topics of Object.values(publicationTopicAssignments)) {
    assert.equal(new Set(topics).size, topics.length);
    assert(topics.every((topic) => valid.has(topic)));
  }
  assert.deepEqual(publicationTopics({ id: "jobs" }), []);
  assert.throws(() => publicationTopics({ id: "unreviewed-paper" }), /Review research topics/);
});

test("incidental keywords cannot assign topics or change curated membership", () => {
  const geography = researchTopics.find((topic) => topic.slug === "political-geography");
  const elections = researchTopics.find((topic) => topic.slug === "election-administration");
  const paper = { id: "polling-place-quality", data: { title: "A place in politics", summary: "Presidents, federal spending and public opinion." } };
  assert.equal(publicationMatchesTopic(paper, geography), false);
  assert.equal(publicationMatchesTopic(paper, elections), true);
  assert.deepEqual(publicationTopics(paper), publicationTopics({ ...paper, data: { title: "Revised title", summary: "Revised copy" } }));
});
