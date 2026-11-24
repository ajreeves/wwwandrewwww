# Homepage photo treatment

Edited in the owner's Adobe Lightroom web account on November 23, 2026. All four originals remain in `public/images/`; full-size JPEG exports live in `public/images/editorial/`. The existing image optimizer creates responsive WebP copies without changing student portraits.

These are photographic light/color adjustments only. No generated subjects, face retouching, object removal, background replacement or synthetic blur was used. The existing homepage crops remain in CSS.

| Export | Original | Lightroom adjustments |
| --- | --- | --- |
| `andrew-reeves-portrait.jpg` | `andrew-reeves-portrait-editorial.jpg` | Exposure +0.10, highlights −14, shadows +12, tint −3, saturation −3 |
| `harvard-panel.jpg` | `andrew-harvard-page.jpg` | Exposure +0.20, contrast +4, highlights −30, shadows +28, temperature −7, saturation −6 |
| `classroom.jpg` | `andrew-teaching-page.jpg` | Exposure +0.10, highlights −18, shadows +16, temperature −3, saturation −4 |
| `adriana-kugler-conversation.jpg` | `adriana-kugler-andrew-reeves-conversation.jpg` | Exposure +0.25, highlights −20, shadows +24, temperature −4, saturation −4 |

Temperature/tint values are relative JPEG adjustments, not Kelvin. All other controls remain at their imported values. Lightroom keeps the editable originals and settings in the owner's account.

## Recording previews

`RecordingPreview.astro` is the reusable template. Titles and captions remain accessible HTML using the site's Adobe Fonts kit. Each preview uses a 16:9 photograph, a red top rule and a 44-pixel-or-larger labeled play control. Videos load only after activation; the title remains a direct link to the recording.

Three recordings use photographs already verified in the site's archive:

- Governing Past Gridlock, Jan. 14, 2026: `andrew-reeves-carolyn-bourdeaux.jpg`, Sid Hastings/WashU.
- The Past, Present, and Future of the Federal Reserve, Sept. 29, 2025: `andrew-fed-page.jpg`, Sid Hastings/WashU.
- Adriana D. Kugler forum, April 3, 2024: the Lightroom export above, Jerry Naunheim Jr./WashU.

The other six recordings retain their own YouTube thumbnails, downloaded from `https://i.ytimg.com/vi/{video-id}/maxresdefault.jpg` on November 23, 2026. All six were available at 1280 × 720. They are stored under `public/images/recordings/` by video ID and served through the responsive image pipeline, replacing the remote 480 × 360 previews. Do not substitute photographs from a different event.

## Sharing image

`design/talks-share.html` is the editable 1200 × 630 sharing-card source. It uses the owner's hosted Adobe Fonts project and the edited Kugler photograph, with its credit retained. The exported JPEG is the Talks page's Open Graph/Twitter image. The design source is kept outside `public/` and is not published as a site page.

Netlify previews use [DEPLOY_PRIME_URL](https://docs.netlify.com/build/configure-builds/environment-variables/) for this new image so it resolves before release. Production uses the canonical site origin. Indexing, analytics, appointment dates and release automation are unchanged.

## Contact portrait download

The Contact page's download uses the full-resolution JPEG supplied by the owner on November 23, 2026: `Weidenbaum Reeves_A-1090751.jpg`. It is stored byte-for-byte at `public/downloads/andrew-reeves-portrait-full-resolution.jpg` (5314 × 3134 pixels; 5,281,417 bytes), with the download filename `Andrew-Reeves-portrait-full-resolution.jpg`. It is not cropped, recompressed, enlarged or passed through the image optimizer. The on-page preview retains the existing 1200 × 1440 Lightroom crop and its responsive derivatives. No photographer is identified in the source files; the owner explicitly requested that the credit be left off for now on November 23, 2026.

## Homepage photograph selection — November 24, 2026

The homepage navigation now uses a closer set of existing documentary photographs:

- Research: `andrew-reeves-hoover-rai-conference.jpg`, showing Reeves at the Research on American Institutions conference at Hoover in May 2023. Replaces the distant Harvard auditorium view on Home only.
- Teaching: the existing Lightroom export `editorial/classroom.jpg`.
- Talks and events: `andrew-reeves-carolyn-bourdeaux.jpg`, a conversation with Carolyn Bourdeaux at the January 14, 2026 event. Credit: Sid Hastings/WashU. Replaces the Kugler photograph on Home only.

All three use 3:2 display frames, IvyPresto titles and short factual captions. Mobile image widths range from 112 to 160 pixels instead of 96 pixels. The Hoover image uses a 1.35 CSS scale anchored at the top right to emphasize Reeves and his gesture; the classroom uses a 1.3 scale anchored at 30%/30%; the Bourdeaux image keeps both participants without additional zoom. Caption context is exposed through `aria-describedby`, and the existing keyboard focus treatment remains.

These changes use existing responsive assets and reversible CSS crops. No source photographs, colors, faces, backgrounds or student portraits were altered. The Harvard and Kugler photographs remain available elsewhere on the site. Captions and event identifications follow the existing verified About gallery records.
