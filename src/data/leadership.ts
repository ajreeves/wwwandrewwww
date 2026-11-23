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
    paragraphs: [{ text: "A WashU research institute supporting scholarship in economics, political science, sociology and public policy. It funds faculty research and hosts public programs connecting scholars, policymakers and the wider community." }]
  },
  {
    id: "frick-initiatives",
    name: "Frick Initiatives",
    role: "Director",
    url: "https://frick.washu.edu/",
    paragraphs: [
      { text: "A WashU initiative supporting translational research, teaching and community projects in civil discourse, free speech, free and open markets, and personal responsibility." },
      {
        text: "Expanded by a $22 million commitment from Robert and Barbara Frick, it develops programs that other schools, businesses and communities can adopt."
      }
    ]
  },
  {
    id: "chancellor-advisor",
    name: "Office of the Chancellor",
    role: "Senior Advisor to the Chancellor",
    url: "https://andrewdmartin.washu.edu/people/",
    paragraphs: [{ text: "Reeves serves as senior advisor and co-chairs the Ordered Liberty Project, a WashU initiative supporting free expression, open inquiry and discussion across political and intellectual differences." }]
  }
];

// Search uses the same wording without presentation markup.
export const leadershipRoles = roles.map((role) => ({
  ...role,
  description: role.paragraphs.map((paragraph) => paragraph.text).join(" ")
}));
