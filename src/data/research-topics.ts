import type { Publication } from "../utils/publication-records.ts";

export type ResearchTopicSlug = "presidential-power" | "democratic-accountability" | "political-geography" | "federal-resource-allocation" | "election-administration";
export type ResearchTopic = { slug: ResearchTopicSlug; label: string; title: string; description: string };

export const researchTopics: ResearchTopic[] = [
  {
    "slug": "presidential-power",
    "label": "Presidential power",
    "title": "Presidential power research",
    "description": "How presidents use their authority, when they act without Congress and how Congress and the public limit their power."
  },
  {
    "slug": "democratic-accountability",
    "label": "Democratic accountability",
    "title": "Democratic accountability research",
    "description": "How people judge elected leaders and decide whom to credit or blame for government decisions."
  },
  {
    "slug": "political-geography",
    "label": "Political geography",
    "title": "Political geography research",
    "description": "How where people live shapes their political views, including differences between cities, suburbs and rural communities."
  },
  {
    "slug": "federal-resource-allocation",
    "label": "Federal resource allocation",
    "title": "Federal resource allocation research",
    "description": "How presidents distribute federal spending, grants and disaster assistance among states and communities."
  },
  {
    "slug": "election-administration",
    "label": "Election administration",
    "title": "Election administration research",
    "description": "How elections are funded and run, and what voters and election workers experience at the polls."
  }
];

// Curated from each work's subject, not incidental words in its text.
// An explicit empty array keeps work outside these five areas in the full archive.
// See docs/research-cleanup.md for the reviewed membership table and rationale.
export const publicationTopicAssignments: Record<string, readonly ResearchTopicSlug[]> = {
  "persistence-of-localism": ["political-geography"],
  "municipal-administration": ["democratic-accountability", "election-administration"],
  "private-funding": ["election-administration"],
  "rising-seas": ["political-geography"],
  "short-haul-moves": ["political-geography"],
  "poll-worker-retention": ["election-administration"],
  "urban-rural-contentment": ["political-geography"],
  "democratic-values-executive-power": ["presidential-power", "democratic-accountability"],
  "crime": ["democratic-accountability"],
  "electoral-geography": ["political-geography"],
  "no-blank-check": ["presidential-power", "democratic-accountability"],
  "partisanship-economic-assessments": ["democratic-accountability"],
  "pasachoff-reply": ["presidential-power", "federal-resource-allocation"],
  "pass-the-buck": ["democratic-accountability"],
  "bellwether-locations": ["political-geography"],
  "unilateral-inaction": ["presidential-power", "democratic-accountability"],
  "crisis": ["democratic-accountability", "federal-resource-allocation"],
  "context": ["political-geography"],
  "local-unemployment": ["democratic-accountability", "political-geography"],
  "polling-place-quality": ["election-administration"],
  "urban-rural-gulf": ["political-geography"],
  "lines": ["election-administration"],
  "polling": ["election-administration"],
  "public-cost-unilateral-action": ["presidential-power", "democratic-accountability"],
  "electionsbib": [],
  "caucus": [],
  "all-presidents-senators": ["federal-resource-allocation"],
  "commissions": ["presidential-power", "democratic-accountability"],
  "geolocation": ["political-geography"],
  "contextual-determinants": ["presidential-power", "democratic-accountability"],
  "unilateral-powers-public-opinion": ["presidential-power", "democratic-accountability"],
  "presidential-particularism-divide-dollar": ["presidential-power", "political-geography", "federal-resource-allocation"],
  "prespart": ["presidential-power", "political-geography", "federal-resource-allocation"],
  "prespower": ["presidential-power", "democratic-accountability"],
  "particularistic-president": ["presidential-power", "political-geography", "federal-resource-allocation"],
  "disaster-relief": ["democratic-accountability", "federal-resource-allocation"],
  "healthcare": ["democratic-accountability"],
  "leap": [],
  "electoral-college-particularism": ["presidential-power", "political-geography", "federal-resource-allocation"],
  "autos": ["federal-resource-allocation"],
  "unheavenly-review": ["democratic-accountability"],
  "ecologies-of-unease": ["democratic-accountability", "political-geography"],
  "spending": ["democratic-accountability", "political-geography", "federal-resource-allocation"],
  "recounts": ["election-administration"],
  "rain": ["democratic-accountability", "federal-resource-allocation"],
  "political-disaster": ["presidential-power", "federal-resource-allocation"],
  "jobs": [],
  "appearances": ["political-geography"],
  "disunion-review": ["political-geography"],
  "reassessment": ["political-geography"],
  "reassessment-long": ["political-geography"]
};

export const publicationTopics = (publication: Pick<Publication, "id">) => {
  const topics = publicationTopicAssignments[publication.id];
  if (!topics) throw new Error(`Review research topics for new publication: ${publication.id}`);
  return topics;
};

export const publicationMatchesTopic = (publication: Pick<Publication, "id">, topic: ResearchTopic) =>
  publicationTopics(publication).includes(topic.slug);

export const researchTopicPath = (slug: string) => `/research/${slug}/`;
export const topicForSlug = (slug: string) => researchTopics.find((topic) => topic.slug === slug);
