import { doctoralStudents, undergraduateHonorsTheses } from "../data/doctoralStudents.ts";
import { courses, courseArchive } from "../data/teaching.ts";
import { events } from "../data/talks.ts";
import { leadershipRoles } from "../data/leadership.ts";
import { contentAnchor, eventAnchor } from "./content-anchors.ts";

export interface SiteSearchEntry {
  title: string;
  summary: string;
  type: string;
  year?: string | number;
  searchText: string;
  url: string;
}

const entry = (item: Omit<SiteSearchEntry, "searchText">, keywords = ""): SiteSearchEntry => ({
  ...item,
  searchText: [item.title, item.summary, item.type, item.year, keywords].filter(Boolean).join(" ").toLowerCase()
});

const pages = [
  { title: "About Andrew Reeves", url: "/about/", summary: "Biography, research interests, university leadership and photographs.", keywords: "Harvard PhD Hoover visiting fellow professor of law by courtesy" },
  { title: "University leadership", url: "/#leadership", summary: "The Weidenbaum Center, Frick Initiatives and Office of the Chancellor.", keywords: "administration administrative portfolio Ordered Liberty" },
  { title: "Research", url: "/research/", summary: "Publications, abstracts, PDFs and replication materials.", keywords: "presidency federal spending political geography public opinion" },
  { title: "Books", url: "/books/", summary: "No Blank Check and The Particularistic President, with reviews and publication information.", keywords: "Cambridge presidential power" },
  { title: "Teaching", url: "/teaching/", summary: "Courses, syllabi and teaching awards in American politics.", keywords: "David Hadas Delores K. Kennedy undergraduate graduate" },
  { title: "Students", url: "/students/", summary: "Doctoral advising, undergraduate honors theses and student profiles.", keywords: "mentorship mentoring alumni" },
  { title: "News and media", url: "/news/", summary: "Essays, commentary and news coverage of Reeves’s research.", keywords: "press op-eds journalism" },
  { title: "Talks and events", url: "/talks/", summary: "Recordings of public talks, panels and Weidenbaum Center conversations.", keywords: "video YouTube speakers" },
  { title: "Contact", url: "/contact/", summary: "Email, office hours, telephone and mailing address.", keywords: "reeves@wustl.edu Seigle Hall office appointment" },
  { title: "Curriculum vitae", url: "/cv/", summary: "Download Andrew Reeves’s academic CV.", keywords: "resume vita academic record" }
] as const;

export const supplementalSearchEntries: SiteSearchEntry[] = [
  ...pages.map(({ keywords, ...page }) => entry({ ...page, type: "Page" }, keywords)),
  ...leadershipRoles.map((role) => entry({
    title: role.name,
    summary: `${role.role}. ${role.description} ${role.example.before}${role.example.label}${role.example.after}`,
    type: "Leadership",
    url: `/#${role.id}`
  })),
  ...[...doctoralStudents, ...undergraduateHonorsTheses].map((student) => entry({
    title: student.name,
    summary: [student.degree, student.current_position, student.dissertation_or_thesis_title || student.research_description].filter(Boolean).join(". "),
    type: "Student",
    year: student.year,
    url: `/students/#${contentAnchor("student", student.name)}`
  }, [student.institution, student.role, student.category, ...(student.awards ?? [])].join(" "))),
  ...courses.map((course) => entry({
    title: course.title,
    summary: `${course.termLabel} · ${course.term}. ${course.paragraphs.join(" ")}`,
    type: "Course",
    url: `/teaching/#${contentAnchor("course", course.title)}`
  }, course.type)),
  ...Object.entries(courseArchive).flatMap(([level, titles]) => titles
    .filter((title) => !courses.some((course) => course.title.startsWith(title)))
    .map((title) => entry({ title, summary: `Past ${level} course taught by Andrew Reeves.`, type: "Course", url: "/teaching/#course-archive" }))),
  ...events.map((event) => entry({
    title: event.label,
    summary: event.summary,
    type: "Talk",
    year: event.date.slice(0, 4),
    url: `/talks/#${eventAnchor(event.watch)}`
  }, [event.title, event.dateLabel, "recording Weidenbaum Center"].join(" ")))
];
