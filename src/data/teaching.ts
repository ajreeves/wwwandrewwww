export const courses = [
  {
    title: "The Practice of Citizenship: Cooperation and Obligations in Democratic Life",
    term: "Spring 2026",
    termLabel: "Syllabus",
    type: "Undergraduate Course",
    image: "/images/citizenship-course.jpg",
    alt: "Pericles delivering the funeral oration in Athens, painted by Philipp Foltz in 1852",
    caption: "Pericles delivering the funeral oration in Athens (Philipp Foltz, 1852).",
    paragraphs: [
      "This course asks how citizens cooperate and what they owe one another.",
      "Students read Aristotle, Martin Luther King Jr. and research on trust, polarization and civic education. They consider how people learn to take part in democracy and what responsibilities citizens and institutions share."
    ],
    links: [
      {
        label: "Syllabus",
        url: "/practice-of-citizenship-syllabus-spring-2026.pdf"
      }
    ],
    video: null
  },
  {
    title: "Introduction to American Politics",
    term: "Fall 2024",
    termLabel: "Syllabus",
    type: "Undergraduate Course",
    image: "/images/intro-course.jpg",
    alt: "Historical mural depicting America's founders",
    caption: "Introduction to American Politics course visual.",
    paragraphs: [
      "This course introduces American politics, with attention to polarization, pressures on institutions and dissatisfaction with the economy.",
      "Students start with basic political science concepts, then study how Congress, the courts and the presidency work and have changed over time. Reeves offers this course periodically."
    ],
    links: [
      {
        label: "Syllabus",
        url: "https://docs.google.com/document/u/0/d/e/2PACX-1vQEwsc-KnpOY1IIwf8QzK6P0d4cSRdFKf8xxJ9AEhS_55LbCgezSwSWuKN-Sse9Kg561KUWttA7S1-k/pub?pli=1"
      }
    ],
    video: "https://www.youtube.com/embed/ZcPzyOfqNKQ"
  },
  {
    title: "Business of Elections",
    term: "Fall 2024",
    termLabel: "Taught",
    type: "Undergraduate Course",
    image: "/images/business-of-elections-course.jpg",
    alt: "Illustration of a suited figure running beside an American flag and rising arrows",
    caption: "Business of Elections course visual.",
    paragraphs: [
      "This course analyzes presidential elections through political science and business strategy.",
      "Topics include campaign management, voter targeting, messaging and how national campaigns are organized."
    ],
    links: [
      {
        label: "Read about the course",
        url: "https://artsci.washu.edu/ampersand/how-presidential-election-start"
      }
    ],
    video: null
  }
] as const;

export const courseArchive = {
  undergraduate: [
    "The Practice of Citizenship",
    "Introduction to American Politics",
    "Campaigns and Elections",
    "Legislative Behavior",
    "The American Presidency",
    "American Elections and Voting Behavior",
    "Looking Back on the 2016 Election",
    "Trump's First 100 Days",
    "Business of Elections"
  ],
  graduate: [
    "American Politics Workshop",
    "Executive Politics",
    "Voting and Elections"
  ]
} as const;

