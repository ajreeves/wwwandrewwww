import type { Publication } from "../utils/publication-records.ts";
import { normalizeTitle } from "../utils/publications.ts";

export type ResearchTopic = {
  slug: string;
  label: string;
  title: string;
  description: string;
  terms: string[];
};

export const researchTopics: ResearchTopic[] = [
  {
    slug: "presidential-power",
    label: "Presidential power",
    title: "Presidential power research",
    description: "How presidents use their authority, when they act without Congress and how Congress and the public limit their power.",
    terms: ["presidential power", "executive power", "unilateral action", "presidential politics", "presidential particularism", "presidency"]
  },
  {
    slug: "democratic-accountability",
    label: "Democratic accountability",
    title: "Democratic accountability research",
    description: "How people judge elected leaders and decide whom to credit or blame for government decisions.",
    terms: ["democratic accountability", "presidential accountability", "electoral accountability", "retrospective voting", "public opinion", "public support"]
  },
  {
    slug: "political-geography",
    label: "Political geography",
    title: "Political geography research",
    description: "How where people live shapes their political views, including differences between cities, suburbs and rural communities.",
    terms: ["political geography", "geographic context", "county-level", "urban-rural", "migration", "place", "electoral geography", "bellwether"]
  },
  {
    slug: "federal-resource-allocation",
    label: "Federal resource allocation",
    title: "Federal resource allocation research",
    description: "How presidents distribute federal spending, grants and disaster assistance among states and communities.",
    terms: ["federal resource allocation", "distributive politics", "disaster politics", "federal grants", "federal spending", "federalism", "intergovernmental"]
  }
];

export const researchTopicPath = (slug: string) => `/research/${slug}/`;

export const publicationTopicSource = (publication: Publication) =>
  normalizeTitle(
    [
      publication.data.title,
      publication.data.summary,
      publication.data.venue,
      publication.data.citation,
      publication.data.authors.join(" "),
      publication.data.themes.join(" "),
      publication.body
    ]
      .filter(Boolean)
      .join(" ")
  );

// Both dedicated topic pages and archive filters use this exact membership rule.
export const publicationMatchesTopic = (publication: Publication, topic: ResearchTopic) => {
  const source = publicationTopicSource(publication);
  return topic.terms.some((term) => source.includes(normalizeTitle(term)));
};

export const topicForSlug = (slug: string) => researchTopics.find((topic) => topic.slug === slug);
