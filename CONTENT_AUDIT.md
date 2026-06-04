# Content Audit: Andrew Reeves Website

Audit date: 2026-05-31

Scope: local Astro site in this repository, including Home, Research, publication detail pages, Books, Projects, Writing, Teaching, CV, Contact, Search, Timeline, images, and links.

Primary sources consulted:

- Current CV PDF: https://andrewreeves.org/reevescv.pdf
- Washington University Political Science profile: https://polisci.washu.edu/people/andrew-reeves
- Washington University Arts & Sciences profile: https://artsci.washu.edu/faculty-staff/andrew-reeves
- Hoover profile: https://www.hoover.org/profiles/andrew-reeves
- Cambridge Core, No Blank Check: https://www.cambridge.org/core/books/no-blank-check/0FE4E2FC0D017DC70566FDFE94B89007
- Cambridge Core, The Particularistic President: https://www.cambridge.org/core/books/particularistic-president/1C2686B436BCBFAB3D46EDBD7C2A17C3
- WashU article, "When presidential power meets public opinion": https://polisci.washu.edu/news/when-presidential-power-meets-public-opinion

## Part I: Executive Summary

### Major Factual Concerns

1. The publication database is not publication-ready. Many records use `["Andrew Reeves", "Coauthors"]`, which is not a valid author list. This appears on at least 12 entries.
2. Several recent publication years are wrong or prematurely dated:
   - `Short-Haul Moves...` is listed locally as 2025, but the CV lists it as forthcoming.
   - `Elections and Representation in American Municipal Administration...` is listed locally as 2025, but the CV lists it as forthcoming.
   - `Rising Seas, Rising Concerns...` is listed locally as 2025, but the CV lists it as 2026.
3. Two of three Writing entries appear fabricated or placeholder:
   - `The Geography of Democratic Experience`
   - `The Public's Capacity to Tame Presidential Power`
4. The real WashU article `When presidential power meets public opinion` is by Shawn Ballard, not Andrew Reeves. It should not be presented as an essay authored by Reeves.
5. The Projects page mixes real institutional roles with invented or inferred "Research Program" entries.
6. The Teaching page has real course areas, but the course descriptions and `Research Design` item are not documented in the CV.
7. Most publication records have no external DOI, journal, SSRN, publisher, or paper links. Only the two books are linked.
8. The Timeline page includes both verified milestones and narrative/inferred milestones. `Director of the Weidenbaum Center` is dated 2024 locally but the CV says 2022-present.

### Highest-Risk Content

- All records with `Coauthors`.
- All publication years after 2024.
- Writing page entries without URLs.
- Project entries labeled as institutional projects when they are actually research areas.
- Summaries that state findings or causal claims without paper-level citations.

## Part II: Content Inventory

### Sitewide Layout

| Item | Status | Notes |
|---|---|---|
| Name, email, department, WashU affiliation | Confirmed | CV and institutional profiles confirm email, WashU affiliation, and professor role. |
| Footer claim: Professor of Political Science and Director of Weidenbaum Center | Confirmed | CV and Hoover profile confirm. |
| Google Scholar link | Confirmed link status 200 | Should remain. |
| LinkedIn link | Plausible but blocked in automated check | curl returned LinkedIn 999; this usually means bot blocking, not necessarily a dead link. |
| "Built for static hosting..." | Confirmed as technical site fact | Not a biographical issue. |

### Home

| Section | Status | Notes |
|---|---|---|
| Hero: "Political scientist studying how democratic institutions shape accountability..." | Plausible but interpretive | Supported broadly by profiles/CV, but should be footed in About/Research copy or toned down. |
| "Andrew Reeves studies when citizens hold political leaders accountable..." | Plausible but generalized | Accurate thematic synthesis, not a directly sourced fact. |
| "His work connects presidential power, federal governance..." | Plausible but inferred | Supported by publication record, but reads like narrative positioning. |
| Portrait | Confirmed image exists | Source appears to be current andrewreeves.org image. Missing credit. |
| Caption: Professor of Political Science | Confirmed | CV says Professor since 2021. |
| Caption: Director, Weidenbaum Center | Confirmed | CV says 2022-present. |
| Four research themes | Mostly confirmed as areas | Themes map to publication record; descriptions should be framed as "research areas" rather than factual findings. |
| Leadership/Public Engagement | Mostly confirmed, needs tightening | Director and Senior Advisor are confirmed. "builds interdisciplinary programs..." is interpretive and should be replaced by CV language. |
| Books | Mostly confirmed | Book facts are real. No Blank Check subtitle should use "towards" to match Cambridge/CV. |
| Essays and Commentary | Mixed | One real WashU article, but not authored by Reeves; two placeholders. |
| Selected Publications | Mixed | Titles exist, but summaries require citations and author/year metadata problems carry through from content collection. |
| Contact | Confirmed | Email matches CV. |

### Research

| Section | Status | Notes |
|---|---|---|
| Page intro | Plausible but interpretive | Supported broadly by Hoover and WashU profiles, but should cite/profile-link. |
| Featured cards | Mixed | Underlying records have metadata issues. |
| Research Constellation | Useful but partly invented | Nodes such as "Ordered Liberty" and "Election Administration" are real-ish topics, but map relationships are interpretive and not documented. |
| Publication Database | Incorrect as currently implemented | It is not a reliable database: missing links, incomplete author lists, wrong years, selected rather than complete. Rename to "Selected Publications" until fixed. |

### Books

| Book | Status | Problems |
|---|---|---|
| No Blank Check | Confirmed | Subtitle should be "towards" per Cambridge/CV. Publisher, coauthor, year confirmed. Cover matches. Missing cover credit; WashU article credits Peter Christenson for cover art. |
| The Particularistic President | Confirmed | Title, subtitle, coauthor, publisher, and 2015 publication date confirmed. Cover matches. Missing cover credit/source. |

### Projects

| Project | Status | Problems |
|---|---|---|
| Weidenbaum Center | Confirmed role, summary needs source | Director role confirmed. Description is generalized and should link to center page. |
| Ordered Liberty Project | Confirmed but imprecise | CV says Co-Chair, Ordered Liberty Project; local status says Senior Advisor to the Chancellor. Use exact CV language and link if public page exists. |
| Election Administration and Polling Place Quality | Research area, not documented project | Should be moved to Research themes or supported with publication links. |
| Political Geography and Place-Based Opinion | Research area, not documented project | Not a project unless there is a lab/grant/program page. |
| Presidential Particularism and Federal Allocation | Research area/book theme, not documented project | Should not be presented as a project without source. |

### Writing

| Entry | Status | Problems |
|---|---|---|
| When Presidential Power Meets Public Opinion | Real article | Published by WashU, by Shawn Ballard, dated 10.5.22. Not an Andrew Reeves-authored essay. |
| The Public's Capacity to Tame Presidential Power | Likely invented/placeholder | No URL; not in CV commentary list. |
| The Geography of Democratic Experience | Likely invented/placeholder | No URL; not in CV commentary list. |

### Teaching

| Item | Status | Problems |
|---|---|---|
| The American Presidency | Confirmed course title in CV | Description is invented unless syllabus exists. |
| Political Behavior | Plausible but not exact CV title | CV lists American Elections and Voting Behavior; use exact title. |
| Democratic Accountability | Not confirmed as course | Likely thematic placeholder. |
| Research Design | Not confirmed as course | Likely placeholder. |
| Pedagogical commitments paragraph | Unsupported | Promotional/interpretive; replace with factual course list from CV unless teaching statement exists. |

### CV

| Item | Status | Problems |
|---|---|---|
| Appointments list | Mostly confirmed | Missing Director, The Frick Initiatives; missing Professor of Law by courtesy; includes Hoover role confirmed by CV. |
| Books list | Confirmed | No Blank Check should use "towards" if full title shown. |
| Research areas | Plausible | Tags are interpretive, not CV facts. |
| Download CV | Confirmed | Local PDF exists and source is public CV. |

### Contact

| Item | Status | Problems |
|---|---|---|
| Email | Confirmed | CV confirms. |
| Department/WashU | Confirmed | CV/institutional profiles confirm. |
| Scholar/LinkedIn | Scholar confirmed; LinkedIn plausible | LinkedIn blocked automated status. |

### Timeline

| Entry | Status | Problems |
|---|---|---|
| The Particularistic President published, 2015 | Confirmed | OK. |
| APSR article on presidential particularism, 2015 | Confirmed | OK. |
| Public Cost of Unilateral Action, 2018 | Confirmed | OK. |
| No Blank Check published, 2022 | Confirmed | OK. |
| Director of the Weidenbaum Center, 2024 | Incorrect | CV says 2022-present. |
| Senior Advisor to the Chancellor / Ordered Liberty, 2025 | Mostly confirmed | CV confirms Senior Advisor and Co-Chair Ordered Liberty. Local description should use exact title. |
| Recent work on political geography and place, 2025 | Narrative/inferred | Not a single milestone; remove or replace with exact article titles/dates. |

## Part III: Fabrication and Placeholder Report

### Likely Invented or Placeholder

- "The Geography of Democratic Experience" as an essay.
- "The Public's Capacity to Tame Presidential Power" as an essay.
- Project: "Political Geography and Place-Based Opinion" as a project.
- Project: "Presidential Particularism and Federal Allocation" as a project.
- Project: "Election Administration and Polling Place Quality" as a project.
- Teaching item: "Democratic Accountability" as a course.
- Teaching item: "Research Design" as a course.
- Timeline entry: "Recent work on political geography and place."
- Research constellation relationships among books, projects, and themes.

### Unsupported or Too Promotional

- "A cross-disciplinary center connecting research on political economy, governance, public policy, and civic life."
- "His leadership work builds interdisciplinary programs around public policy, civic life, academic freedom, and open inquiry."
- "A body of work on polling places, poll workers, election access, and citizens' confidence in electoral administration."
- "Research programs and institutional projects connecting executive power, public policy, civic infrastructure, and the geography of democratic experience."
- "Public writing presented as a small editorial shelf rather than a chronological feed."
- "A concise scholarly profile..." on CV page.

### Requires Citation

- Any claim beginning "His work connects..."
- All publication summaries.
- All project descriptions.
- All course descriptions.
- All timeline descriptions.
- All research constellation node descriptions.

## Part IV: Publication Audit

| Local Entry | Verification Status | Required Correction |
|---|---|---|
| No Blank Check | Confirmed | Use "towards" in subtitle; link DOI/publisher. |
| The Particularistic President | Confirmed | OK; link DOI/publisher. |
| Short-Haul Moves... | Exists/forthcoming | Local title omits subtitle; year should be forthcoming unless publication page confirms year. Authors: James G. Gimpel, Jordon Newton, Andrew Reeves. |
| Municipal Administration... | Exists/forthcoming | Year should be forthcoming unless journal page confirms issue year. Authors: Wayde Z. C. Marsh, Michael P. Olson, Andrew Reeves, Jordan Duffin Wong. |
| Rising Seas... | Exists | Year should be 2026, not 2025. Authors: Tyler Reny, Andrew Reeves, Dino P. Christenson. |
| Guardians at the Gates... | Confirmed | Replace "Coauthors" with full author list from CV. |
| Urban-Rural Divide and Residential Contentment... | Confirmed | Authors: James G. Gimpel and Andrew Reeves. |
| Democratic Values and Support for Executive Power | Confirmed | Authors: Andrew Reeves and Jon C. Rogowski. |
| Reconsidering Bellwether Locations... | Confirmed | Authors: James G. Gimpel, Andrew Reeves, Sean Trende. |
| Unilateral Inaction... | Confirmed | OK authors/year/venue. |
| Partisanship, Economic Assessments... | Confirmed | Authors: Zoe Ang, Andrew Reeves, Jon C. Rogowski, Arjun Vishwanath. |
| Pass the Buck... | Confirmed | Authors: David R. Miller and Andrew Reeves. |
| Urban-Rural Gulf... | Confirmed | Authors: James G. Gimpel, Nathan Lovin, Bryant Moy, Andrew Reeves. |
| Local Unemployment... | Confirmed | Authors: Taeyong Park and Andrew Reeves. |
| The Public Cost of Unilateral Action | Confirmed | OK authors/year/venue. |
| Contextual Determinants... | Confirmed | OK authors/year/venue. |
| All the President's Senators... | Confirmed | Authors: Dino Christenson, Douglas Kriner, Andrew Reeves. Check exact title punctuation: CV says "Co-Partisans"; Cambridge citation index says "Copartisans." |
| Unilateral Powers... | Confirmed | OK authors/year/venue. |
| Electoral College... | Confirmed | OK authors/year/venue. |
| Ecologies of Unease... | Confirmed | Authors: Andrew Reeves and James G. Gimpel. |
| Political Disaster... | Confirmed | OK authors/year/venue. |
| Electoral Geography... | Confirmed chapter | Authors: James G. Gimpel and Andrew Reeves; venue should include Handbook title. |
| Polling Place Quality and Access | Confirmed chapter | Replace "Coauthors" with full chapter author list or shortened "Robert Stein et al." if style permits. |
| The Politics of Disaster Relief | Confirmed chapter | Authors: Alexander Oliver and Andrew Reeves, not Andrew Reeves alone. |

## Part V: Link Audit

| URL | Link Text | Destination | Status | Problems |
|---|---|---|---|---|
| / | Andrew Reeves home | Home | OK | Internal. |
| /research/ | Research / All research / Database | Research | OK | Internal. |
| /books/ | Books | Books | OK | Internal. |
| /projects/ | Projects | Projects | OK | Internal. |
| /writing/ | Writing / All writing | Writing | OK | Internal. |
| /teaching/ | Teaching | Teaching | OK | Internal. |
| /search/ | Search | Search | OK | Internal. |
| /cv/ | CV | CV | OK | Internal. |
| /contact/ | Contact | Contact | OK | Internal. |
| /timeline/ | career milestones timeline | Timeline | OK | Internal. |
| /reevescv.pdf | Download CV | Local PDF | OK | Confirm PDF is current before deploy. |
| mailto:reeves@wustl.edu | reeves@wustl.edu | Email | OK | Confirm preferred public email. |
| https://www.cambridge.org/core/books/no-blank-check/0FE4E2FC0D017DC70566FDFE94B89007 | Publisher page | Cambridge | 200 | Correct. |
| https://www.cambridge.org/core/books/particularistic-president/1C2686B436BCBFAB3D46EDBD7C2A17C3 | Publisher page | Cambridge | 200 | Correct. |
| https://polisci.washu.edu/news/when-presidential-power-meets-public-opinion | Writing link | WashU article | 200 | Real article, but not authored by Reeves. |
| https://scholar.google.com/citations?hl=en&user=xPSRkX4AAAAJ | Google Scholar | Scholar profile | 200 | OK. |
| https://www.linkedin.com/in/areeves/ | LinkedIn | LinkedIn profile | 999 via curl | Likely bot-blocked; manually verify in browser. |
| Google Fonts URLs | Fonts | Google Fonts | Not content audited | Technical dependency, not scholarly content. |

Missing links:

- Almost every publication needs a DOI, journal, publisher, SSRN, PDF, or Google Scholar link.
- Projects need source links.
- Teaching entries need syllabi, course catalog pages, or should be simplified to an exact course list.
- Timeline entries should link to sources or use only CV-backed facts.

## Part VI: Image Audit

| Image | Status | Alt Text | Problems |
|---|---|---|---|
| /images/andrew-reeves-portrait.jpg | Real image from current site | "Portrait of Andrew Reeves" | Missing photographer/source/credit. |
| /images/no-blank-check-cover.jpg | Correct book cover | "Cover of No Blank Check" | Missing cover art credit; WashU article credits Peter Christenson. |
| /images/particularistic-president-cover.jpg | Correct book cover | "Cover of The Particularistic President" | Missing publisher/source credit. |
| /favicon.png | Exists | N/A | No issue. |

## Part VII: Recommended Revisions

1. Rename "Publication Database" to "Selected Publications" until the metadata is complete.
2. Replace every `Coauthors` value with exact author lists from the CV.
3. Correct recent years and forthcoming status:
   - Short-Haul Moves: forthcoming.
   - Municipal Administration: forthcoming.
   - Rising Seas: 2026.
4. Add DOI/journal/publisher links for every publication.
5. Remove or rewrite placeholder writing entries. Use real CV commentary pieces instead:
   - 2025 Conversation article.
   - 2024 Los Angeles Times piece.
   - 2021 Conversation piece.
   - 2020 St. Louis Post-Dispatch piece.
6. Change the WashU news article label from "Writing" to "News/Profile" or remove from Writing.
7. Move invented Projects into Research as thematic areas, or provide external project pages.
8. Revise Teaching to exact CV course lists unless syllabi/course catalog links are available.
9. Correct Timeline:
   - Weidenbaum Center: 2022-present.
   - Ordered Liberty: Co-Chair, 2025-present.
   - Remove "Recent work..." or replace with exact article milestones.
10. Add a public source note or source links on CV/About/Research pages.
11. Add image credits or remove images whose provenance cannot be documented.
12. Avoid interpretive claims unless linked to a profile, publication abstract, or CV.
