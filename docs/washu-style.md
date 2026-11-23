# WashU style on the personal website

The site follows WashU's visual and editorial guidance while keeping Andrew Reeves's name as its primary identity. The CV page uses the shared design and sentence-case labels, with no redundant eyebrow or introductory label. Preserve its update date and the downloadable CV document. All visual overrides belong under `.editorial-site`; do not change shared base styles to implement this direction.

## Typography and color

- Use IvyPresto Headline for headings, with IvyStyle Sans for body copy, the personal masthead, navigation and labels. This follows the serif-heading/sans-serif-body hierarchy of current WashU sites. Retain WashU's approved system alternatives, Georgia and Calibri, as fallbacks, followed by Times New Roman for serif text and Segoe UI/Arial for sans serif text.
- Load the owner's Adobe Fonts project, [Andrew Reeves Website](https://fonts.adobe.com/my_fonts?project_id=yjm8eqw#web_projects-section), once through the shared layout using `https://use.typekit.net/yjm8eqw.css`. It contains IvyPresto Headline regular/italic (400) and IvyStyle Sans regular/italic (400), semibold (600), and bold/bold italic (700). Both families use `font-display: swap` so text remains readable while the fonts load. Adobe hosts the fonts; keep the subscription/project active and do not self-host the font files or borrow another site's kit.
- Use white, neutral dark text, WashU red (`#BA0C2F`) and warm gray (`#D7D2CB`). Lead with red in the masthead rule, active navigation, primary actions and mobile photo navigation. Reserve dark red (`#971B2F`) for hover states and dark green (`#13322B`) for secondary accents. Keep reading text and major headings dark, use warm gray for rules, and give the footer a black background with white text.
- Prefer sentence case and left alignment. Preserve the capitalization of proper names, publication titles and formal course/event titles.
- Use one visible compact, full-color WashU logo as a secondary signature beside the personal name above 760 pixels. At 760 pixels and below, show only the personal name and menu control in the masthead and place the logo after the links in the expanded menu. Preserve the CV page's existing header, including its stacked mobile signature. The complete shield and wordmark must remain together and unaltered. Display it at 32 pixels high on larger screens and 30 pixels on phones, with separation from the name and navigation and a minimum 44-pixel target for the menu logo link.

### Logo provenance

`public/brand/washu-logo.svg` is the unmodified inline SVG artwork from the header of [University Marketing & Communications](https://marcomm.washu.edu/), captured November 23, 2026. Its paths, colors and proportions are preserved; it is served as an image with an accessible university-name alternative and a link to WashU. Do not redraw, recolor, crop or separate the wordmark and shield.

The favicon files are unmodified copies of the assets linked by [washu.edu](https://washu.edu/) on November 23, 2026: [32-pixel PNG](https://washu.edu/app/themes/antipasto/assets/img/favicon/favicon-32x32.png), [16-pixel PNG](https://washu.edu/app/themes/antipasto/assets/img/favicon/favicon-16x16.png), [180-pixel Apple touch icon](https://washu.edu/app/themes/antipasto/assets/img/favicon/apple-touch-icon.png), and [Safari pinned-tab SVG](https://washu.edu/app/themes/antipasto/assets/img/favicon/safari-pinned-tab.svg). Serve them from `public/brand/`, retaining WashU's `#971B2F` pinned-tab color. The legacy `public/favicon.png` is the same 32-pixel PNG. Do not redraw or recolor the artwork.

### Footer

Follow the contact-and-navigation structure of the [Office of the Chancellor biography footer](https://andrewdmartin.washu.edu/biography/), reviewed November 23, 2026. Use a black surface, white IvyStyle Sans text, small uppercase section labels, underlined links and a fine divider. Keep Reeves's own contact details, academic profiles and personal copyright attribution. Place contact information beside two columns of site links on desktop; stack Contact and Explore on mobile. Footer links retain a minimum 44-pixel target height and a visible white keyboard-focus outline. The shared footer also appears on the CV page without changing its content or downloadable document.

## Editorial conventions

- Write in third person, using direct, factual language.
- Use “Washington University in St. Louis” on first reference in a biography and “WashU” on later references. Preserve formal unit names, including “Arts & Sciences.”
- Lowercase generic titles in running prose. Capitalize the full named professorship, with “the” before it. Keep the endowed-chair headline requested for this personal homepage; news-headline rules do not dictate this introduction.
- Use “and” rather than an ampersand in generic labels. Keep ampersands in formal names and publication titles.
- Omit the serial comma in simple editorial lists; retain it where needed for clarity and in formal names. Do not normalize original abstracts, quotations, endorsements, published titles, author lists or citations to house style.
- Use AP month abbreviations when a day is present: “Sept. 29, 2025.” Spell out a month without a day: “September 2024.” Preserve machine-readable dates and scholarly citation formats.
- Preserve the larger clickable student portraits, existing photo credits and appointment-release controls.

## Official sources

Reviewed November 2026:

- [Typography](https://marcomm.washu.edu/typography/)
- [Brand color palette](https://marcomm.washu.edu/brand-color-palette/)
- [Editorial style guide](https://marcomm.washu.edu/editorial-style-guide/)
- [Web and webform best practices](https://marcomm.washu.edu/web-and-webform-best-practices/)
- [Named professorships](https://marcomm.washu.edu/style-guide-entries/named-professorships/)
- [Dates](https://marcomm.washu.edu/style-guide-entries/dates/)
- [Arts & Sciences](https://marcomm.washu.edu/style-guide-entries/arts-sciences/)
- [Official logo usage guide](https://marcomm.washu.edu/official-logo-usage-guide/)

## Editorial hierarchy and leadership

The homepage uses the appointment title as its heading, with the university on a separate line. Keep the appointment date guard intact. Recent articles use concise versions of the research archive’s curated findings, preserving qualifications about scope, association and effect size. Two long article titles omit their subtitles on the homepage; accessible link names, publication pages and citations retain the full titles. Research topic links belong with Recent articles. University leadership follows the photo strip and describes the three roles and their responsibilities, without a pull quote or specific event and project examples. Page, book, publication, course and student headings use IvyPresto Headline at regular weight; body copy and navigation use IvyStyle Sans. Avoid labels that repeat an adjacent heading.

Leadership descriptions explain what each entity is and what it does for readers outside WashU; the adjacent titles identify Reeves’s roles. Frick’s description identifies its work as translational research and conveys its scale through Robert and Barbara Frick’s $22 million commitment and its support for programs that can be adopted elsewhere. Omit the administrative relationship. Describe the funding as a commitment rather than implying that the full pledge has been received. Sources: [Weidenbaum Center](https://wc.washu.edu/), [Frick Initiatives](https://frick.washu.edu/), [Frick expansion announcement](https://source.washu.edu/2026/08/expanded-frick-initiatives-move-civic-research-into-practice/), [Chancellor’s Office](https://andrewdmartin.washu.edu/people/), and [Ordered Liberty](https://orderedliberty.washu.edu/). Recordings and historical speaker details remain on Talks.

Present the three leadership entries as rows divided by fine warm-gray rules. Put a small WashU-red role label above each IvyPresto Headline entity name. Use a compact title column on desktop and stack each title above its description on tablet and mobile. Separate Frick’s purpose and scale into paragraphs, with the commitment in regular body weight. Start the Chancellor’s Office description with Reeves’s responsibilities. Preserve the approved wording; derive search descriptions from the same paragraph data. Give the Law and Hoover affiliations a separate closing line.

## Photography and recorded events

The homepage uses restrained Lightroom edits of its existing photographs: lift shadow detail, protect highlights and reduce competing color casts. Keep the originals and all student portraits unchanged. Export full-size JPEG copies under `public/images/editorial/`; the existing image pipeline supplies responsive WebP versions. See [photo treatment notes](photo-treatment.md) for sources and Lightroom settings.

Use one recording-preview component with a 16:9 image, a thin WashU-red rule and a clearly labeled red play control. Use photographs from the actual event when available and retain photographer credits; otherwise retain the recording’s original YouTube thumbnail. Keep titles in live IvyPresto text beneath the image, with balanced wrapping. Load the video only after activation and preserve the direct YouTube link as a fallback.

## Teaching, Media and Contact

Teaching retains the real classroom photograph. Present courses before teaching awards, using compact rows with titles, dated syllabus or offering labels and resource links beside the descriptions. Stack these on mobile. Course illustrations are omitted from the page; the source images and course descriptions remain unchanged.

Media opens with the two 2026 coverage entries. Keep research coverage distinct from authored essays and op-eds. Earlier entries remain in the static HTML inside native expandable lists, with their original titles, outlets, dates and links. The Harvard panel is a smaller supporting photograph and description below the lists, with a link to Talks and events.

Contact puts email and telephone above compact office and mailing details. The “Biography and photo” section provides a selectable short biography, an enhanced copy button and a download of the full-resolution portrait supplied by the owner. Keep the existing cropped preview on the page and serve the unmodified original only when downloaded. The biography uses the shared appointment resolver; do not hard-code the future chair title. Keep these resources discoverable from Media and site search. At the owner's request on November 23, 2026, omit a portrait credit for now rather than supply an unverified photographer name.
