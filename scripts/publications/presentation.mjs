#!/usr/bin/env node
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { clustersDir, findMetadataFiles, presentationDir, readJson, writeJson } from "./io.mjs";
import { slugify, validatePublicationMetadata } from "./schema.mjs";

const valueOf = (metadata, fieldName) => metadata[fieldName]?.value ?? null;

const compact = (items) => items.filter((item) => item !== null && item !== undefined && item !== "");

const asArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined || value === "") return [];
  return [value];
};

const firstAvailable = (...values) => compact(values)[0] ?? null;

const titleFor = (metadata, filePath) => valueOf(metadata, "title") || path.basename(filePath, ".json");

const cardSummaryFor = (metadata) =>
  firstAvailable(valueOf(metadata, "one_sentence_summary"), valueOf(metadata, "plain_english_summary"), valueOf(metadata, "abstract"));

const citationFor = (metadata) => {
  const explicit = valueOf(metadata, "citation");
  if (explicit) return explicit;

  const authors = asArray(valueOf(metadata, "authors")).join(", ");
  const year = valueOf(metadata, "year");
  const title = valueOf(metadata, "title");
  const journal = valueOf(metadata, "journal");
  const volume = valueOf(metadata, "volume");
  const issue = valueOf(metadata, "issue");
  const pages = valueOf(metadata, "pages");
  const venue = compact([journal, volume && issue ? `${volume}(${issue})` : volume, pages]).join(", ");
  return compact([authors && `${authors}.`, year && `(${year}).`, title && `"${title}."`, venue]).join(" ") || null;
};

const filtersFor = (metadata) => ({
  substantive_area: asArray(valueOf(metadata, "substantive_area")),
  government_level: asArray(valueOf(metadata, "government_level")),
  research_design: asArray(valueOf(metadata, "research_design")),
  methods: asArray(valueOf(metadata, "methods")),
  geography: asArray(valueOf(metadata, "geography")),
  time_period: asArray(valueOf(metadata, "time_period")),
  keywords: asArray(valueOf(metadata, "keywords")),
  related_topics: asArray(valueOf(metadata, "related_topics"))
});

const presentationFor = (metadata, filePath) => {
  const title = titleFor(metadata, filePath);
  const slug = slugify(title) || path.basename(filePath, ".json");
  const filters = filtersFor(metadata);
  const tags = [...new Set([...filters.substantive_area, ...filters.research_design, ...filters.keywords, ...filters.related_topics])];

  return {
    slug,
    title,
    authors: asArray(valueOf(metadata, "authors")),
    year: valueOf(metadata, "year"),
    publication_type: valueOf(metadata, "publication_type"),
    journal: valueOf(metadata, "journal"),
    volume: valueOf(metadata, "volume"),
    issue: valueOf(metadata, "issue"),
    pages: valueOf(metadata, "pages"),
    doi: valueOf(metadata, "doi"),
    citation: citationFor(metadata),
    links: valueOf(metadata, "links") || {
      pdf: null,
      journal: null,
      replication_data: null,
      code: null
    },
    card_summary: cardSummaryFor(metadata),
    abstract: valueOf(metadata, "abstract"),
    plain_english_summary: valueOf(metadata, "plain_english_summary"),
    research_question: valueOf(metadata, "research_question"),
    research_highlights: asArray(valueOf(metadata, "main_findings")),
    methods: asArray(valueOf(metadata, "methods")),
    data_sources: asArray(valueOf(metadata, "data_sources")),
    key_variables: asArray(valueOf(metadata, "key_variables")),
    identification_strategy: valueOf(metadata, "identification_strategy"),
    geography: valueOf(metadata, "geography"),
    time_period: valueOf(metadata, "time_period"),
    unit_of_analysis: valueOf(metadata, "unit_of_analysis"),
    policy_relevance: valueOf(metadata, "policy_relevance"),
    pull_quote: valueOf(metadata, "pull_quote"),
    pull_quote_page: valueOf(metadata, "pull_quote_page"),
    confidence_notes: valueOf(metadata, "confidence_notes"),
    tags,
    filters,
    evidence: valueOf(metadata, "evidence")
  };
};

const main = async () => {
  const files = await findMetadataFiles();
  await mkdir(presentationDir, { recursive: true });
  await mkdir(clustersDir, { recursive: true });

  const presentations = [];
  for (const file of files) {
    const metadata = await readJson(file);
    const result = validatePublicationMetadata(metadata);
    if (!result.valid) {
      throw new Error(`Invalid metadata in ${file}:\n${result.errors.join("\n")}`);
    }

    const presentation = presentationFor(metadata, file);
    presentations.push(presentation);
    await writeJson(path.join(presentationDir, `${presentation.slug}.json`), presentation);
  }

  presentations.sort((a, b) => {
    const aYear = typeof a.year === "number" ? a.year : -Infinity;
    const bYear = typeof b.year === "number" ? b.year : -Infinity;
    return bYear - aYear || a.title.localeCompare(b.title);
  });

  const topicClusters = {};
  for (const publication of presentations) {
    for (const topic of [...publication.filters.substantive_area, ...publication.filters.related_topics, ...publication.filters.keywords]) {
      topicClusters[topic] = topicClusters[topic] || [];
      topicClusters[topic].push(publication.slug);
    }
  }

  await writeJson(path.join(presentationDir, "index.json"), presentations);
  await writeJson(path.join(clustersDir, "topic-clusters.json"), topicClusters);
  console.log(`Generated ${presentations.length} presentation record(s).`);
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
