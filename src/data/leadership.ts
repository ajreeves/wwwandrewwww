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
    paragraphs: [{ text: "The Weidenbaum Center supports social science research and brings scholars, policymakers and the public into conversation. As director, he leads its research support and public programs in economics, political science, sociology and public policy." }]
  },
  {
    id: "frick-initiatives",
    name: "Frick Initiatives",
    role: "Director",
    url: "https://frick.washu.edu/",
    paragraphs: [
      { text: "Expanded through a $22 million commitment from Robert and Barbara Frick, the Frick Initiatives support translational research, teaching and community projects that strengthen civil society." },
      {
        text: "He directs the development of programs that other schools, businesses and communities can adopt."
      }
    ]
  },
  {
    id: "chancellor-advisor",
    name: "Office of the Chancellor",
    role: "Senior Advisor to the Chancellor",
    url: "https://andrewdmartin.washu.edu/people/",
    paragraphs: [{ text: "The Ordered Liberty Project supports free expression, open inquiry and discussion across political and intellectual differences at WashU. As senior advisor to the chancellor, he co-chairs the project." }]
  }
];

// Search uses the same wording without presentation markup.
export const leadershipRoles = roles.map((role) => ({
  ...role,
  description: role.paragraphs.map((paragraph) => paragraph.text).join(" ")
}));
