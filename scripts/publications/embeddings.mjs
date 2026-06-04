#!/usr/bin/env node
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { clustersDir, embeddingsDir, findMetadataFiles, readJson, writeJson } from "./io.mjs";
import { slugify, validatePublicationMetadata } from "./schema.mjs";
import { loadLocalEnv } from "./env.mjs";

const valueOf = (metadata, fieldName) => metadata[fieldName]?.value ?? null;
const asArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const textForEmbedding = (metadata) => {
  const pieces = [
    ["Title", valueOf(metadata, "title")],
    ["Authors", asArray(valueOf(metadata, "authors")).join("; ")],
    ["Year", valueOf(metadata, "year")],
    ["Journal", valueOf(metadata, "journal")],
    ["Abstract", valueOf(metadata, "abstract")],
    ["Research question", valueOf(metadata, "research_question")],
    ["Main findings", asArray(valueOf(metadata, "main_findings")).join(" ")],
    ["Methods", asArray(valueOf(metadata, "methods")).join("; ")],
    ["Data sources", asArray(valueOf(metadata, "data_sources")).join("; ")],
    ["Key variables", asArray(valueOf(metadata, "key_variables")).join("; ")],
    ["Identification strategy", valueOf(metadata, "identification_strategy")],
    ["Geography", valueOf(metadata, "geography")],
    ["Time period", valueOf(metadata, "time_period")],
    ["Unit of analysis", valueOf(metadata, "unit_of_analysis")],
    ["Keywords", asArray(valueOf(metadata, "keywords")).join("; ")],
    ["Related topics", asArray(valueOf(metadata, "related_topics")).join("; ")],
    ["Substantive area", asArray(valueOf(metadata, "substantive_area")).join("; ")],
    ["Government level", asArray(valueOf(metadata, "government_level")).join("; ")],
    ["Research design", asArray(valueOf(metadata, "research_design")).join("; ")]
  ];

  return pieces
    .filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== "")
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
};

const callEmbeddings = async ({ model, inputs }) => {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      input: inputs
    })
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(`OpenAI embeddings request failed (${response.status}): ${JSON.stringify(body)}`);
  }

  return body.data
    .sort((a, b) => a.index - b.index)
    .map((item) => item.embedding);
};

const cosineSimilarity = (a, b) => {
  let dot = 0;
  let aMagnitude = 0;
  let bMagnitude = 0;
  for (let index = 0; index < a.length; index += 1) {
    dot += a[index] * b[index];
    aMagnitude += a[index] * a[index];
    bMagnitude += b[index] * b[index];
  }
  if (aMagnitude === 0 || bMagnitude === 0) return 0;
  return dot / (Math.sqrt(aMagnitude) * Math.sqrt(bMagnitude));
};

const main = async () => {
  await loadLocalEnv();
  const model = process.env.OPENAI_EMBEDDING_MODEL;
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is required.");
  if (!model) throw new Error("OPENAI_EMBEDDING_MODEL is required so the embedding model is explicit.");

  const files = await findMetadataFiles();
  if (files.length === 0) {
    console.log("No metadata files found.");
    return;
  }

  await mkdir(embeddingsDir, { recursive: true });
  await mkdir(clustersDir, { recursive: true });

  const records = [];
  for (const file of files) {
    const metadata = await readJson(file);
    const validation = validatePublicationMetadata(metadata);
    if (!validation.valid) {
      throw new Error(`Invalid metadata in ${file}:\n${validation.errors.join("\n")}`);
    }
    const title = valueOf(metadata, "title") || path.basename(file, ".json");
    records.push({
      slug: slugify(title) || path.basename(file, ".json"),
      title,
      text: textForEmbedding(metadata)
    });
  }

  const embeddings = await callEmbeddings({
    model,
    inputs: records.map((record) => record.text)
  });

  for (let index = 0; index < records.length; index += 1) {
    records[index].embedding = embeddings[index];
    await writeJson(path.join(embeddingsDir, `${records[index].slug}.json`), {
      slug: records[index].slug,
      title: records[index].title,
      model,
      embedding: records[index].embedding
    });
  }

  const related = {};
  for (const record of records) {
    related[record.slug] = records
      .filter((candidate) => candidate.slug !== record.slug)
      .map((candidate) => ({
        slug: candidate.slug,
        title: candidate.title,
        score: Number(cosineSimilarity(record.embedding, candidate.embedding).toFixed(4))
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  await writeJson(path.join(clustersDir, "related-publications.json"), related);
  console.log(`Generated embeddings and related-publication recommendations for ${records.length} publication(s).`);
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
