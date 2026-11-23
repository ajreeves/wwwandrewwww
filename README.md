# Andrew Reeves Academic Website

A static academic website built with Astro, TypeScript, Tailwind CSS, and MDX content collections.

Use Node.js 22.23.4 or newer. `.nvmrc`, GitHub Actions, and Netlify use the Node 22 release line.

## Commands

```sh
npm ci
npm run dev
npm run build
npm run preview
npm run publications:extract
npm run publications:generate
npm run publications:embeddings
```

The production build is emitted to `dist/`.

`npm run dev` and `npm run build` first generate responsive WebP images with
`npm run images:optimize`. Originals remain in `public/images/`; derived files
under `public/images/optimized/` and `src/data/responsive-images.json` are ignored
by Git and recreated from the gallery, publication, and student data. Cached
variants are reused when their source and encoding settings have not changed.
Use `ResponsiveImage.astro` for these images so dimensions and responsive sources
stay in sync. The About gallery initially requests only its active and next images.

## January 2027 appointment preview

The endowed-chair title is **Edward Mallinckrodt Distinguished University Professor**, effective January 1, 2027 at midnight in America/Chicago (06:00 UTC). `src/data/academic-appointment.ts` controls the homepage, About biography, and metadata together.

Netlify deploy previews and branch previews show the forthcoming title. For a local preview, run `CHAIR_TITLE_PREVIEW=true npm run dev`. Production builds always retain the current title before the effective date, even if that preview flag is accidentally set. Because the site is static, the production release must be built and deployed on or after the effective date.

Indexing and analytics are controlled separately by `src/data/site-environment.ts`. Only `CONTEXT=production` builds allow indexing and load Plausible. Every other context, including local builds and previews after January 1, emits `noindex, nofollow` and omits analytics. Netlify supplies `CONTEXT`; when building for production elsewhere, set it explicitly. Google Analytics and Statcounter have been removed to avoid duplicate page-view tracking.

`npm run build` runs the appointment date-boundary tests before building. Keep the appointment preview pull request unmerged until the January 1 release.

## Automated checks and dependency updates

GitHub Actions runs publication validation, Astro type checking, the production build, and an npm security audit on pull requests and pushes to `master`. The checks also run weekly and can be started manually from the Actions tab. **Build and validate**, **Dependency audit**, and the **Netlify deployment preview** must pass before merging to `master`.

Dependabot checks npm packages and GitHub Actions weekly. Related Astro upgrades are grouped so the framework and integrations can be tested together. Dependabot PRs containing only minor and patch updates merge automatically after all required checks pass. Major updates, groups containing a major update, and updates that cannot be classified remain manual. Automatic merges use squash and trigger Netlify's normal production deployment.

Actions are pinned to commit hashes. Build workflows have read-only tokens. The separate auto-merge workflow verifies Dependabot metadata and has only the write permissions needed to configure merges; it never checks out or executes pull-request code.

To verify an update locally:

```sh
npm ci
npm run publications:validate
npm run build
npm audit --audit-level=low
```

Content collections are configured in `src/content.config.ts`. Their IDs preserve the existing publication URLs and book anchors. Tailwind 3 runs through PostCSS, without the retired Astro Tailwind integration.

## Content

Content lives in `src/content/`:

- `publications`
- `books`
- `projects`
- `writing`

Images and static files live in `public/`.

Talks use event dates with source links, retaining month-only precision when the source does not establish a day. Speaker roles describe the time of the event. Teaching terms identify the linked syllabus or documented offering. Students are rendered as compact text cards from `src/data/doctoralStudents.ts`; keep advising details and collaborative-publication links in that data source.

`BookFeature` defaults to an `h3` under a section heading on the homepage; use `headingLevel={2}` for book titles directly beneath the Books page heading. The About gallery pauses when focus enters and resumes only through Play. Video activation transfers focus to the loaded player.

Publication pages, archive cards, and search share the metadata resolver in `src/utils/publication-records.ts`. It matches explicit aliases, IDs, normalized titles, PDF pathnames, then unique long-title prefixes. Ambiguous matches fail the build; validation also checks unique mappings and author count/order (allowing differences in middle initials). Two books and the `persistence-of-localism` and `recounts` chapters currently have no extracted metadata; they use their content entries and are explicitly listed as exceptions. Any other missing mapping fails the build.

Use optional `cardSummary` and `editorial` frontmatter in publication MDX for curated copy. `editorial` supports `context`, `findings`, `designLabel`, `figureCaption`, `keywords`, and `relatedSlugs`; existing examples include `rising-seas.mdx` and `disunion-review.mdx`. Context appears only when curated or supported by canonical policy-relevance metadata. Review pages attribute evidence to the reviewed book. Keep canonical metadata changes in the extraction pipeline below.

Dedicated topic pages and archive theme filters use `publicationMatchesTopic` in `src/data/research-topics.ts`. Site search and archive text search share publication text, including authors, venues, abstracts, summaries, and MDX page text. Search also indexes books, public writing, main pages, leadership roles, student profiles, courses and recorded talks. Student, course and event results link to stable page anchors. Course and event content is shared between its page and the search index through `src/data/teaching.ts` and `src/data/talks.ts`; leadership descriptions and examples live in `src/data/leadership.ts`. Search does not index the full text of linked PDFs or private student notes.

## Publication Extraction Pipeline

Publication PDFs live under `public/papers/`. The extractor scans that directory recursively by default, so newly added PDFs are picked up automatically:

```sh
npm run publications:extract
```

You can also pass one PDF or a directory:

```sh
npm run publications:extract -- public/papers/example.pdf
```

Create a private `.env.local` file before running live extraction:

```sh
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4.1
OPENAI_EMBEDDING_MODEL=text-embedding-3-large
PUBLICATION_EXTRACT_MAX_CHARS=140000
```

`.env.local` is ignored by Git. Keep `.env.example` as the shareable template.

The pipeline has two separate layers:

- Metadata layer: `src/data/publications/metadata/*.json` is the canonical source of truth. Records are conservative, evidence-cited, machine readable, and validated against `scripts/publications/schema.mjs`. Every field uses `{ "value": ..., "evidence_pages": [...], "confidence": "high|medium|low" }`.
- Presentation layer: `src/data/publications/presentation/*.json` is generated from metadata for summaries, homepage cards, filters, research highlights, and other website copy. Do not hand-edit generated presentation files.

Workflow:

```sh
npm run publications:validate
npm run publications:present
npm run publications:embeddings
```

`publications:embeddings` creates vectors in `src/data/publications/embeddings/` and related-publication recommendations in `src/data/publications/clusters/related-publications.json`. Topic clusters are generated from metadata fields such as `substantive_area`, `government_level`, `research_design`, `keywords`, and `related_topics`.

The extraction rules intentionally avoid inference: absent fields stay `null`, and journal details, DOI, replication materials, datasets, causal identification strategies, and policy relevance are included only when the PDF explicitly states or clearly describes them.

## Hosting

This site is static and can be deployed to Netlify or GitHub Pages. For GitHub Pages, publish the `dist/` directory generated by `npm run build`.
