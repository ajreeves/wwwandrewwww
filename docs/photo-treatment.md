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

The homepage navigation uses three documentary photographs with consistent 3:2 frames and serif destination titles:

- Research: `andrew-reeves-hoover-rai-conference.jpg`, showing Reeves at the Research on American Institutions conference at Hoover in May 2023. CSS crop: scale 1.5, origin 100%/0%; saturation 0.8, contrast 0.96, brightness 1.04.
- Teaching: the existing Lightroom export `editorial/classroom.jpg`. CSS crop: scale 1.45, origin 30%/20%; saturation 0.9, contrast 0.98.
- Talks and events: the Lightroom export `editorial/adriana-kugler-conversation.jpg`, keeping both participants visible. No additional zoom; saturation 0.9, contrast 0.98, brightness 1.03. Credit: Jerry Naunheim Jr./WashU.

Visible labels identify destinations only: Research, Teaching, and Talks and events. Location and participant captions were removed because they confused the meaning of the navigation links. Descriptive alternative text retains the actual photo context. The conversation photograph credit sits below the set, outside the links. Mobile image widths range from 112 to 160 pixels. Keyboard focus remains visible.

The Bourdeaux photograph remains in the About gallery and Talks page; its darker background and spotlight were less consistent with this homepage set. The Harvard photograph also remains elsewhere on the site. These changes use existing responsive assets and reversible CSS cropping and color treatment. No source photographs, faces, backgrounds, student portraits or original image files were altered.
