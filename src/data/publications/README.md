# Publication Data Layers

This directory separates publication facts from website copy.

- `metadata/`: canonical publication records extracted from PDFs. Each JSON file must match `scripts/publications/schema.mjs`; every field is wrapped with `value`, `evidence_pages`, and `confidence`.
- `presentation/`: generated website-facing records derived from metadata. These are safe to rebuild and should not be hand-edited.
- `embeddings/`: generated embedding vectors derived from metadata text.
- `clusters/`: generated related-publication and topic-cluster indexes.

The website should treat `metadata/` as authoritative. Presentation files can be regenerated whenever the metadata changes.
