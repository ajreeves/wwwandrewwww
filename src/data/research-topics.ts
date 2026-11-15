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
    label: "Presidential Power",
    title: "Presidential Power Research",
    description: "Research on executive authority, unilateral action, presidential incentives, and the institutional limits citizens and Congress place on presidents.",
    terms: ["presidential power", "executive power", "unilateral action", "presidential politics", "presidential particularism", "presidency"]
  },
  {
    slug: "democratic-accountability",
    label: "Democratic Accountability",
    title: "Democratic Accountability Research",
    description: "Research on how citizens evaluate leaders, assign responsibility, and connect governing choices to democratic judgment.",
    terms: ["democratic accountability", "presidential accountability", "electoral accountability", "retrospective voting", "public opinion", "public support"]
  },
  {
    slug: "political-geography",
    label: "Political Geography",
    title: "Political Geography Research",
    description: "Research on how local context, spatial inequality, urban-rural divides, and place-based experience shape political behavior.",
    terms: ["political geography", "geographic context", "county-level", "urban-rural", "migration", "place", "electoral geography", "bellwether"]
  },
  {
    slug: "federal-resource-allocation",
    label: "Federal Resource Allocation",
    title: "Federal Resource Allocation Research",
    description: "Research on how federal attention, grants, disaster declarations, and public resources move across communities.",
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
