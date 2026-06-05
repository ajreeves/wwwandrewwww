export type StudentCategory = "doctoral" | "undergraduate";

export type AdvisingRelationship =
  | "Chair"
  | "Committee chair"
  | "Committee member"
  | "Outside committee member"
  | "Honors thesis advisor";

export interface StudentRecord {
  name: string;
  category: StudentCategory;
  role: AdvisingRelationship;
  year: number | "In progress";
  degree: string;
  institution: string;
  research_description?: string;
  dissertation_or_thesis_title?: string;
  current_position?: string;
  awards?: string[];
  homepage_url?: string;
  profile_url?: string;
  photo_url?: string;
  photo_source?: string;
  image_url?: string;
  image_alt?: string;
  image_source?: string;
  image_kind?: "site_screenshot" | "profile_photo";
  related_publications?: string[];
  notes?: string;
}

const noVerifiedPhoto = "No verified professional photo embedded; use monogram placeholder.";

export const doctoralStudents: StudentRecord[] = [
  {
    name: "Jordon Newton",
    category: "doctoral",
    role: "Committee member",
    year: 2026,
    degree: "PhD, Political Science",
    institution: "Washington University in St. Louis",
    research_description: "Research connected to migration, political geography, and the spatial organization of American politics.",
    homepage_url: "https://www.jnewton.org/",
    image_url: "/images/students/jordon-newton-site.png",
    image_alt: "Screenshot of Jordon Newton's professional website.",
    image_source: "https://www.jnewton.org/",
    image_kind: "site_screenshot",
    photo_source: noVerifiedPhoto,
    related_publications: ["short-haul-moves"],
    notes: "Homepage supplied by Andrew Reeves and verified by screenshot capture; advising year updated from the May 24, 2026 CV."
  },
  {
    name: "Jordan Duffin Wong",
    category: "doctoral",
    role: "Committee chair",
    year: 2025,
    degree: "PhD, Political Science",
    institution: "Washington University in St. Louis",
    research_description: "Work connected to municipal administration, representation, rural planning, and public institutions.",
    current_position: "Rural Planner, Five Rule Rural Planning",
    homepage_url: "https://jordanduffinw.github.io/",
    image_url: "/images/students/jordan-duffin-wong-site.png",
    image_alt: "Screenshot of Jordan Duffin Wong's professional website.",
    image_source: "https://jordanduffinw.github.io/",
    image_kind: "site_screenshot",
    photo_source: noVerifiedPhoto,
    related_publications: ["municipal-administration"],
    notes: "Homepage supplied by Andrew Reeves and verified by screenshot capture."
  },
  {
    name: "Aleph Shin",
    category: "doctoral",
    role: "Outside committee member",
    year: 2024,
    degree: "PhD, Economics",
    institution: "Washington University in St. Louis",
    research_description: "Doctoral committee work in economics.",
    profile_url: "https://www.linkedin.com/in/xshin/",
    image_url: "/images/students/aleph-shin-linkedin.png",
    image_alt: "Screenshot of Aleph Shin's LinkedIn profile.",
    image_source: "https://www.linkedin.com/in/xshin/",
    image_kind: "site_screenshot",
    photo_source: noVerifiedPhoto,
    notes: "LinkedIn profile supplied by Andrew Reeves and verified by authenticated screenshot capture."
  },
  {
    name: "Hyunjoo Oh",
    category: "doctoral",
    role: "Outside committee member",
    year: 2024,
    degree: "PhD, Business",
    institution: "Washington University in St. Louis",
    research_description: "Doctoral committee work in business and strategy.",
    current_position: "Head of Strategy, NeuroFusion Inc.",
    profile_url: "https://www.linkedin.com/in/hyunjoo-oh/",
    image_url: "/images/students/hyunjoo-oh-linkedin.png",
    image_alt: "Screenshot of Hyunjoo Oh's LinkedIn profile.",
    image_source: "https://www.linkedin.com/in/hyunjoo-oh/",
    image_kind: "site_screenshot",
    photo_source: noVerifiedPhoto,
    notes: "LinkedIn profile supplied by Andrew Reeves and verified by authenticated screenshot capture."
  },
  {
    name: "Lucas Boschelli",
    category: "doctoral",
    role: "Committee member",
    year: 2024,
    degree: "PhD, Political Science",
    institution: "Washington University in St. Louis",
    research_description: "Doctoral committee work in political science with applied quantitative research connections.",
    current_position: "Senior Data Scientist, Maritz",
    homepage_url: "https://lucasboschelli.org/",
    image_url: "/images/students/lucas-boschelli-site.png",
    image_alt: "Screenshot of Lucas Boschelli's professional website.",
    image_source: "https://lucasboschelli.org/",
    image_kind: "site_screenshot",
    photo_source: noVerifiedPhoto,
    notes: "Homepage supplied by Andrew Reeves and verified by screenshot capture."
  },
  {
    name: "Ben Noble",
    category: "doctoral",
    role: "Chair",
    year: 2023,
    degree: "PhD, Political Science",
    institution: "Washington University in St. Louis",
    research_description: "Research on presidential power, congressional politics, executive rhetoric, and democratic accountability.",
    current_position: "Assistant Professor of Political Science, UC San Diego",
    awards: ["George C. Edwards III Dissertation Award"],
    homepage_url: "https://benjaminnoble.org/",
    profile_url: "https://polisci.ucsd.edu/people/faculty/faculty-directory/currently-active-faculty/noble-profile.html",
    image_url: "/images/students/ben-noble-site.png",
    image_alt: "Screenshot of Ben Noble's professional website.",
    image_source: "https://benjaminnoble.org/",
    image_kind: "site_screenshot",
    photo_source: noVerifiedPhoto,
    related_publications: ["crime", "crisis"],
    notes: "UC San Diego profile verifies current appointment and personal website."
  },
  {
    name: "Patrick Rickert",
    category: "doctoral",
    role: "Committee member",
    year: 2023,
    degree: "PhD, Political Science",
    institution: "Washington University in St. Louis",
    research_description: "Research connected to American national institutions, political development, and quantitative methodology.",
    current_position: "Assistant Professor of Political Science, Rollins College",
    homepage_url: "https://sites.google.com/view/patrick-rickert/",
    image_url: "/images/students/patrick-rickert-site.png",
    image_alt: "Screenshot of Patrick Rickert's professional website.",
    image_source: "https://sites.google.com/view/patrick-rickert/",
    image_kind: "site_screenshot",
    photo_source: noVerifiedPhoto,
    notes: "Homepage supplied by Andrew Reeves and verified by screenshot capture."
  },
  {
    name: "Zoe Ang",
    category: "doctoral",
    role: "Committee chair",
    year: 2023,
    degree: "PhD, Political Science",
    institution: "Washington University in St. Louis",
    research_description: "Research on public opinion, executive power, crisis politics, and presidential accountability.",
    current_position: "Data Scientist, Clayco",
    profile_url: "https://www.linkedin.com/in/zoeang/",
    image_url: "/images/students/zoe-ang-linkedin.png",
    image_alt: "Screenshot of Zoe Ang's LinkedIn profile.",
    image_source: "https://www.linkedin.com/in/zoeang/",
    image_kind: "site_screenshot",
    photo_source: noVerifiedPhoto,
    related_publications: ["partisanship-economic-assessments", "crisis"],
    notes: "LinkedIn profile supplied by Andrew Reeves and verified by authenticated screenshot capture."
  },
  {
    name: "David Miller",
    category: "doctoral",
    role: "Chair",
    year: 2020,
    degree: "PhD, Political Science",
    institution: "Washington University in St. Louis",
    research_description: "Research on crisis management, blame, delegation, and public evaluations of political leadership.",
    current_position: "Assistant Professor, American University",
    awards: ["George C. Edwards III Dissertation Award"],
    homepage_url: "https://www.davidryanmiller.com/",
    image_url: "/images/students/david-miller-site.png",
    image_alt: "Screenshot of David Ryan Miller's professional website.",
    image_source: "https://www.davidryanmiller.com/",
    image_kind: "site_screenshot",
    photo_source: noVerifiedPhoto,
    related_publications: ["pass-the-buck", "commissions", "electionsbib"],
    notes: "Homepage supplied by Andrew Reeves and verified by screenshot capture."
  },
  {
    name: "Min Hee Seo",
    category: "doctoral",
    role: "Committee member",
    year: 2020,
    degree: "PhD, Political Science",
    institution: "Washington University in St. Louis",
    research_description: "Work connected to public opinion, institutional context, and political behavior.",
    current_position: "Health Data Scientist, U.S. News & World Report",
    profile_url: "https://www.linkedin.com/in/min-hee-seo/",
    image_url: "/images/students/min-hee-seo-linkedin.png",
    image_alt: "Screenshot of Min Hee Seo's LinkedIn profile.",
    image_source: "https://www.linkedin.com/in/min-hee-seo/",
    image_kind: "site_screenshot",
    photo_source: noVerifiedPhoto,
    related_publications: ["contextual-determinants", "lines", "polling-place-quality", "polling"],
    notes: "LinkedIn profile supplied by Andrew Reeves and verified by authenticated screenshot capture."
  },
  {
    name: "Joshua Boston",
    category: "doctoral",
    role: "Committee member",
    year: 2019,
    degree: "PhD, Political Science",
    institution: "Washington University in St. Louis",
    research_description: "Research on American legal and political institutions, courts, representation, and election administration.",
    current_position: "Associate Professor of Political Science, Bowling Green State University",
    homepage_url: "https://www.joshuaboston.com/",
    image_url: "/images/students/joshua-boston-site.png",
    image_alt: "Screenshot of Joshua Boston's professional website.",
    image_source: "https://www.joshuaboston.com/",
    image_kind: "site_screenshot",
    photo_source: noVerifiedPhoto,
    related_publications: ["lines", "polling-place-quality", "polling"],
    notes: "Homepage verifies current appointment and WashU PhD."
  },
  {
    name: "Myunghoon Kang",
    category: "doctoral",
    role: "Committee member",
    year: 2019,
    degree: "PhD, Political Science",
    institution: "Washington University in St. Louis",
    research_description: "Research on political institutions, political behavior, public policy, and environmental politics.",
    current_position: "Associate Professor, Pohang University of Science and Technology",
    homepage_url: "https://sites.google.com/view/myunghoon/home",
    profile_url: "https://postech.ac.kr/eng/research/researcher_search_list.do?id=2ee4c28811b498945b87f5d3a4aaadf0&mode=view&pager.offset=144&pagerLimit=12",
    image_url: "/images/students/myunghoon-kang-site.png",
    image_alt: "Screenshot of Myunghoon Kang's professional website.",
    image_source: "https://sites.google.com/view/myunghoon/home",
    image_kind: "site_screenshot",
    photo_source: noVerifiedPhoto,
    notes: "POSTECH researcher profile and personal homepage verify appointment."
  },
  {
    name: "Emily Moore",
    category: "doctoral",
    role: "Committee member",
    year: 2018,
    degree: "PhD, Political Science",
    institution: "Washington University in St. Louis",
    research_description: "Doctoral committee work in political science with applied quantitative connections.",
    current_position: "Statistician/Data Scientist, St. Louis County Assessor's Office",
    profile_url: "https://www.linkedin.com/in/emily-h-moore-phd-81536710a/",
    image_url: "/images/students/emily-moore-linkedin.png",
    image_alt: "Screenshot of Emily Moore's LinkedIn profile.",
    image_source: "https://www.linkedin.com/in/emily-h-moore-phd-81536710a/",
    image_kind: "site_screenshot",
    photo_source: noVerifiedPhoto,
    notes: "LinkedIn profile supplied by Andrew Reeves and verified by authenticated screenshot capture."
  },
  {
    name: "Taeyong Park",
    category: "doctoral",
    role: "Committee member",
    year: 2017,
    degree: "PhD, Political Science",
    institution: "Washington University in St. Louis",
    research_description: "Research on local economic context, voting, and quantitative methods.",
    current_position: "Assistant Teaching Professor, Statistics, Carnegie Mellon University Qatar",
    profile_url: "https://scholars.cmu.edu/7506-taeyong-park",
    image_url: "/images/students/taeyong-park-site.png",
    image_alt: "Screenshot of Taeyong Park's Carnegie Mellon Scholars profile.",
    image_source: "https://scholars.cmu.edu/7506-taeyong-park",
    image_kind: "site_screenshot",
    photo_source: noVerifiedPhoto,
    related_publications: ["local-unemployment"],
    notes: "CMU Scholars profile supplied by Andrew Reeves and verified by screenshot capture."
  },
  {
    name: "Patrick Tucker",
    category: "doctoral",
    role: "Committee member",
    year: 2017,
    degree: "PhD, Political Science",
    institution: "Washington University in St. Louis",
    research_description: "Doctoral committee work in political science and quantitative research.",
    current_position: "Senior Statistician, Edison Research",
    homepage_url: "http://www.patricktucker.org/",
    image_url: "/images/students/patrick-tucker-site.png",
    image_alt: "Screenshot of Patrick Tucker's professional website.",
    image_source: "http://www.patricktucker.org/",
    image_kind: "site_screenshot",
    photo_source: noVerifiedPhoto,
    notes: "Homepage supplied by Andrew Reeves and verified by screenshot capture."
  },
  {
    name: "Alexander Oliver",
    category: "doctoral",
    role: "Committee member",
    year: 2016,
    degree: "PhD, Political Science",
    institution: "Boston University",
    research_description: "Research connected to disaster politics, public opinion, and political behavior.",
    current_position: "Chief Data Scientist, Evolving Strategies",
    homepage_url: "https://www.alexoliver.io/",
    image_url: "/images/students/alexander-oliver-site.png",
    image_alt: "Screenshot of Alexander Oliver's professional website.",
    image_source: "https://www.alexoliver.io/",
    image_kind: "site_screenshot",
    photo_source: noVerifiedPhoto,
    related_publications: ["disaster-relief"],
    notes: "Homepage supplied by Andrew Reeves and verified by screenshot capture."
  },
  {
    name: "Laura Lucas",
    category: "doctoral",
    role: "Committee member",
    year: 2014,
    degree: "PhD, Political Science",
    institution: "Boston University",
    research_description: "Doctoral committee work in political science.",
    current_position: "Director of Research and Training, International Consortium for Law and Development",
    profile_url: "https://www.linkedin.com/in/lauraclucas/",
    image_url: "/images/students/laura-lucas-linkedin.png",
    image_alt: "Screenshot of Laura Lucas's LinkedIn profile.",
    image_source: "https://www.linkedin.com/in/lauraclucas/",
    image_kind: "site_screenshot",
    photo_source: noVerifiedPhoto,
    notes: "LinkedIn profile supplied by Andrew Reeves and verified by authenticated profile capture."
  },
  {
    name: "Alex Whalen",
    category: "doctoral",
    role: "Committee member",
    year: 2014,
    degree: "PhD, Political Science",
    institution: "Boston University",
    research_description: "Doctoral committee work in political science.",
    homepage_url: "https://alexwhalen.com/political-science",
    image_url: "/images/students/alex-whalen-site.png",
    image_alt: "Screenshot of Alex Whalen's political science page.",
    image_source: "https://alexwhalen.com/political-science",
    image_kind: "site_screenshot",
    photo_source: noVerifiedPhoto,
    notes: "Homepage supplied by Andrew Reeves and verified by screenshot capture."
  }
];

export const undergraduateHonorsTheses: StudentRecord[] = [
  {
    name: "Elizabeth Obrand",
    category: "undergraduate",
    role: "Honors thesis advisor",
    year: 2021,
    degree: "BA, Political Science",
    institution: "Washington University in St. Louis",
    research_description: "Undergraduate honors thesis in Political Science.",
    dissertation_or_thesis_title: "The Role of Partisanship on Citizens' Evaluations of Electoral Institutions",
    profile_url: "https://www.linkedin.com/in/elizabeth-candell-39728315a/",
    image_url: "/images/students/elizabeth-obrand-linkedin.png",
    image_alt: "Screenshot of Elizabeth Obrand's LinkedIn profile.",
    image_source: "https://www.linkedin.com/in/elizabeth-candell-39728315a/",
    image_kind: "site_screenshot",
    awards: ["Winner of Antoinette Dames Prize for Outstanding Senior Honors Thesis in Political Science"]
  },
  {
    name: "Sophia Keskey",
    category: "undergraduate",
    role: "Honors thesis advisor",
    year: 2017,
    degree: "BA, Political Science",
    institution: "Washington University in St. Louis",
    research_description: "Undergraduate honors thesis in Political Science.",
    dissertation_or_thesis_title: "The Politics of Capacity: No Child Left Behind",
    homepage_url: "https://sophiakeskey.net/",
    profile_url: "https://www.linkedin.com/in/sophia-keskey-5939939b/",
    image_url: "/images/students/sophia-keskey-linkedin.png",
    image_alt: "Screenshot of Sophia Keskey's LinkedIn profile.",
    image_source: "https://www.linkedin.com/in/sophia-keskey-5939939b/",
    image_kind: "site_screenshot",
    awards: ["Winner of Grossman-Alexander Prize"]
  },
  {
    name: "Selena Nandiwada",
    category: "undergraduate",
    role: "Honors thesis advisor",
    year: 2022,
    degree: "BA, Political Science",
    institution: "Washington University in St. Louis",
    research_description: "Undergraduate honors thesis in Political Science.",
    dissertation_or_thesis_title: "The #MeToo Movement in Politics: Party Rhetoric versus Party Action",
    profile_url: "https://www.linkedin.com/in/selena-nandiwada-4143871b2/",
    image_url: "/images/students/selena-nandiwada-linkedin.png",
    image_alt: "Screenshot of Selena Nandiwada's LinkedIn profile.",
    image_source: "https://www.linkedin.com/in/selena-nandiwada-4143871b2/",
    image_kind: "site_screenshot"
  },
  {
    name: "Gianni Galasso",
    category: "undergraduate",
    role: "Honors thesis advisor",
    year: 2022,
    degree: "BA, Political Science",
    institution: "Washington University in St. Louis",
    research_description: "Undergraduate honors thesis in Political Science.",
    dissertation_or_thesis_title: "Building Young Citizens: The Relationship Between Civic Education and Civic Engagement",
    profile_url: "https://www.linkedin.com/in/giannigalasso/",
    image_url: "/images/students/gianni-galasso-linkedin.png",
    image_alt: "Screenshot of Gianni Galasso's LinkedIn profile.",
    image_source: "https://www.linkedin.com/in/giannigalasso/",
    image_kind: "site_screenshot",
    awards: ["Winner of Antoinette Dames Prize for Outstanding Senior Honors Thesis in Political Science"]
  },
  {
    name: "Nolen Bowerman",
    category: "undergraduate",
    role: "Honors thesis advisor",
    year: 2023,
    degree: "BA, Political Science",
    institution: "Washington University in St. Louis",
    research_description: "Undergraduate honors thesis in Political Science.",
    dissertation_or_thesis_title: "The Electoral Effects of Natural Disasters and Disaster Response",
    profile_url: "https://www.linkedin.com/in/nolen-bowerman-909544178/",
    image_url: "/images/students/nolen-bowerman-linkedin.png",
    image_alt: "Screenshot of Nolen Bowerman's LinkedIn profile.",
    image_source: "https://www.linkedin.com/in/nolen-bowerman-909544178/",
    image_kind: "site_screenshot"
  }
];

export const undergraduateHonorsNote =
  "Undergraduate honors thesis advising records are shown when public-facing details are available.";
