// Explain each entity for readers outside WashU; titles identify Reeves's role.
// Frick's expansion and commitment: https://source.washu.edu/2026/08/expanded-frick-initiatives-move-civic-research-into-practice/
interface LeadershipParagraph {
  text: string;
  emphasis?: string;
  supporting?: boolean;
}

interface LeadershipRole {
  id: string;
  name: string;
  role: string;
  url: string;
  paragraphs: LeadershipParagraph[];
}

const roles: LeadershipRole[] = [
  {
    id: "weidenbaum-center",
    name: "Weidenbaum Center on the Economy, Government, and Public Policy",
    role: "Director",
    url: "https://wc.washu.edu/",
    paragraphs: [{ text: "A research institute funding scholarship in economics, political science, sociology and public policy, with public programs that bring scholars, policymakers and the community together." }]
  },
  {
    id: "frick-initiatives",
    name: "Frick Initiatives",
    role: "Director",
    url: "https://frick.washu.edu/",
    paragraphs: [
      { text: "Translational research, teaching and community projects to strengthen civil society. A $22 million commitment from Robert and Barbara Frick supports programs that other schools, businesses and communities can adopt." }
    ]
  },
  {
    id: "chancellor-advisor",
    name: "Office of the Chancellor",
    role: "Senior Advisor to the Chancellor",
    url: "https://andrewdmartin.washu.edu/people/",
    paragraphs: [{ text: "He co-chairs the Ordered Liberty Project, which supports free expression, open inquiry and discussion across political and intellectual differences at WashU." }]
  }
];

// Search uses the same wording without presentation markup.
export const leadershipRoles = roles.map((role) => ({
  ...role,
  description: role.paragraphs.map((paragraph) => paragraph.text).join(" ")
}));
