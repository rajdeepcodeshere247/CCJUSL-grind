import { TeamMember } from "@/types";

export const teamCategories = [
  { key: "core", label: "Core Team" },
  { key: "cp", label: "CP Team" },
  { key: "development", label: "Development Team" },
  { key: "aiml", label: "AI/ML Team" },
  { key: "design", label: "Design Team" },
  { key: "pr", label: "PR Team" },
  { key: "logistics", label: "Logistics Team" },
  { key: "sponsorship", label: "Sponsorship Team" },
] as const;

export const teamMembers: TeamMember[] = [
  // Core Team
  {
    id: "t1",
    name: "Sanjib Murmu",
    position: "PR team member",
    photo: "/images/ccjusl-logo.png",
    team: "pr",
    graduationYear: 2029,
    bio: "I have been actively involved with several clubs, where I developed a strong passion for creative storytelling and content creation. Video editing and delivering high-quality work within tight deadlines are among my key strengths. Alongside this, I am a passionate developer who enjoys exploring new technologies, continuously refining my skills, and leveraging AI-driven tools to enhance productivity and streamline workflows.",
    socials: { linkedin: "https://www.linkedin.com/in/sanjibmurmu/", github: "https://github.com/SanjibMurmu" },
  },
  {
    id: "t2",
    name: "Dipram Biswas",
    position: "Design Team Coordinator",
    photo: "/images/ccjusl-logo.png",
    team: "design",
    graduationYear: 2028,
    bio: "I’m a designer and creative front-end developer working remotely, operating within structured, requirement-driven workflows. My work is focused on solving real problems by combining design, interaction, and development to create clear, consistent, and visually strong digital experiences.",
    achievements: [
      "Designed the CodeClub JUSL logo",
      "Tech Lead of Srijan'2026",
      "Immense experience in UI/UX and branding"
    ],
    socials: { linkedin: "https://www.linkedin.com/in/dipram-biswas/", github: "https://github.com/Dipram-9090" },
  },
  {
    id: "t3",
    name: "Rahul Pandey",
    position: "Dev Team",
    photo: "/images/ccjusl-logo.png",
    team: "development",
    graduationYear: 2027,
    bio: "Full Stack Dev and Machine Learning Enthusiast",
    achievements: [
      "Internship at Wells Fargo",
      "Made the Sherlocked'26 competition app",
      "HackForge 2025 Winner",
    ],
    socials: { linkedin: "https://www.linkedin.com/in/rahul-pandey2005", github: "https://github.com/rahul-p19" },
  },
  {
    id: "t4",
    name: "Tanish Majumdar",
    position: "Dev Team",
    photo: "/images/ccjusl-logo.png",
    team: "development",
    graduationYear: 2027,
    bio: "Dabble a bit in web dev,devops,ci/cd. Love to play basketball and watch f1.",
    achievements: [
      "Internship at Polycab"
    ],
    socials: { linkedin: "https://www.linkedin.com/in/tanish34", github: "https://github.com/tanish35" },
  },

  {
    id: "t5",
    name: "Anik Acharya",
    position: "Design Team",
    photo: "/images/ccjusl-logo.png",
    team: "design",
    graduationYear: 2029,
    bio: "Knows html,css and js",
    achievements: [
      "Designed winners posters for Code Club JUSL"
    ],
    socials: { linkedin: "https://www.linkedin.com/in/anik-acharya-99a349399?utm_source=share_via&utm_content=profile&utm_medium=member_android", github: "https://github.com/anikacharya07" },
  },
  {
    id: "t6",
    name: "Swarnendu Banerjee",
    position: "AI/ML Team",
    photo: "/images/ccjusl-logo.png",
    team: "aiml",
    graduationYear: 2027,
    bio: "Passionate about building scalable and reliable software systems, exploring distributed architectures, cloud technologies, observability, automation, and AI-driven solutions to improve system performance and reliability.",
    achievements: [
      "Winner at Hacktropica(MLH)",
      "4th position in COMSYS Hackathon IV",
      "Guardian@Leetcode",
      "Internship at PayPal"
    ],
    socials: { linkedin: "https://www.linkedin.com/in/swarnendu-banerjee-78aa49298/", github: "https://github.com/Pookie-n-Rookie" },
  },
  {
    id: "t7",
    name: "Ankit Kundu",
    position: "CP Team",
    photo: "/images/ccjusl-logo.png",
    team: "cp",
    graduationYear: 2027,
    bio: "I have a lot of interest in competitive programming, but I often fall short in contests. Proudly. I am an amateur CP coder.",
    achievements: [
      "Internship at Sprinklr"
    ],
    socials: { linkedin: "https://www.linkedin.com/in/ankit-kundu-50522a2b2", github: "https://github.com/ankitkundu837" },
  },

  // Development Team
  {
    id: "t8",
    name: "Sauhardya Hazra",
    position: "PR team",
    photo: "/images/ccjusl-logo.png",
    team: "pr",
    graduationYear: 2028,
    bio: "I am an IT engineering student with a strong interest in programming, artificial intelligence, and problem-solving. I enjoy learning new technologies, building projects, and participating in coding competitions. I am always eager to improve my technical skills and work collaboratively with others.",
    socials: { linkedin: "https://www.linkedin.com/in/sauhardya-hazra-b44110324", github: "https://github.com/Sauhardya007" },
  },
  {
    id: "t9",
    name: "Krish Agarwal",
    position: "Logistics Team",
    photo: "/images/ccjusl-logo.png",
    team: "logistics",
    graduationYear: 2028,
    bio: "I'm Krish Agarwal, Logistics lead, very active, trying to give the best for the club.",
    achievements: [
      "Organised Hackforge"
    ],
    socials: { linkedin: "https://www.linkedin.com/in/krish-agarwal-b67b57321/", github: "https://github.com/krishjuit" },
  },
  {
    id: "t10",
    name: "Sourav Mondal",
    position: "Backend Developer",
    photo: "/images/ccjusl-logo.png",
    team: "development",
    graduationYear: 2026,
    bio: "Backend enthusiast experienced in Node.js, databases, and API design.",
    achievements: [
      "Built event registration system handling 1000+ requests",
      "Designed PostgreSQL schema for member management",
      "Integrated OAuth 2.0 authentication for club portal",
    ],
    socials: { github: "#" },
  },

  // AI/ML Team
  {
    id: "t11",
    name: "Ritika Ghosh",
    position: "AI/ML Lead",
    photo: "/images/ccjusl-logo.png",
    team: "aiml",
    graduationYear: 2025,
    bio: "Researcher in deep learning and NLP. Leads workshops on machine learning fundamentals and advanced topics.",
    achievements: [
      "Published paper on NLP at inter-college symposium",
      "Organized Epochalypse ML competition with 150+ teams",
      "Conducted 10+ ML workshop sessions for 200+ students",
    ],
    socials: { linkedin: "#", github: "#" },
  },
  {
    id: "t12",
    name: "Aditya Bose",
    position: "Data Science Coordinator",
    photo: "/images/ccjusl-logo.png",
    team: "aiml",
    graduationYear: 2026,
    bio: "Passionate about data science and its applications in solving real-world problems.",
    achievements: [
      "Top 5% finish in Kaggle competition (5000+ participants)",
      "Led data science reading group with weekly sessions",
      "Mentored 20+ students through their first ML project",
    ],
    socials: { linkedin: "#", github: "#" },
  },
  {
    id: "t13",
    name: "Neha Saha",
    position: "ML Researcher",
    photo: "/images/ccjusl-logo.png",
    team: "aiml",
    graduationYear: 2027,
    bio: "Working on computer vision projects and contributing to open-source ML libraries.",
    achievements: [
      "Contributed to open-source PyTorch extension library",
      "Built real-time object detection demo for club showcase",
      "Created workshop content on CNNs used by 100+ students",
    ],
    socials: { github: "#" },
  },

  // Design Team
  {
    id: "t14",
    name: "Ishaan Dutta",
    position: "Design Lead",
    photo: "/images/ccjusl-logo.png",
    team: "design",
    graduationYear: 2025,
    bio: "Graphic designer and UI/UX enthusiast. Creates all visual assets for CodeClub events and branding.",
    achievements: [
      "Redesigned club brand identity adopted across all channels",
      "Produced 50+ event posters and social media creatives",
      "Won best design award at IIT Kharagpur tech fest",
    ],
    socials: { linkedin: "#" },
  },
  {
    id: "t15",
    name: "Tanisha Majumdar",
    position: "Visual Designer",
    photo: "/images/ccjusl-logo.png",
    team: "design",
    graduationYear: 2026,
    bio: "Creative thinker with expertise in Figma and Adobe Creative Suite.",
    achievements: [
      "Designed UI for club's internal event management tool",
      "Produced promo video for HackForge that reached 10K+ views",
      "Created illustration series used in club merchandise",
    ],
    socials: { linkedin: "#" },
  },

  // PR Team
  {
    id: "t16",
    name: "Rohan Pal",
    position: "PR Lead",
    photo: "/images/ccjusl-logo.png",
    team: "pr",
    graduationYear: 2025,
    bio: "Manages the public face of CodeClub JUSL across all social platforms and university channels.",
    achievements: [
      "Grew Instagram following from 800 to 3200 in one year",
      "Secured club features in 3 tech news publications",
      "Established LinkedIn presence reaching 2000+ followers",
    ],
    socials: { linkedin: "#", twitter: "#" },
  },
  {
    id: "t17",
    name: "Megha Sarkar",
    position: "Content Writer",
    photo: "/images/ccjusl-logo.png",
    team: "pr",
    graduationYear: 2026,
    bio: "Skilled writer who crafts engaging content for events, blogs, and social media.",
    achievements: [
      "Authored 15+ club blog posts averaging 500+ reads each",
      "Wrote event descriptions increasing registrations by 30%",
      "Launched monthly club newsletter with 400+ subscribers",
    ],
    socials: { linkedin: "#" },
  },
  {
    id: "t18",
    name: "Ankit Kumar",
    position: "Social Media Manager",
    photo: "/images/ccjusl-logo.png",
    team: "pr",
    graduationYear: 2027,
    bio: "Keeps the club's social media presence active and engaging.",
    achievements: [
      "Maintained 95% posting consistency across platforms",
      "Viral reel hitting 50K+ views during HackForge 2024",
      "Ran targeted campaign that doubled event sign-ups",
    ],
    socials: { linkedin: "#" },
  },

  // Logistics Team
  {
    id: "t19",
    name: "Sudipta Nag",
    position: "Logistics Lead",
    photo: "/images/ccjusl-logo.png",
    team: "logistics",
    graduationYear: 2025,
    bio: "The operational backbone of every CodeClub event. Ensures everything runs smoothly on event day.",
    achievements: [
      "Flawlessly executed logistics for 8 large-scale events",
      "Reduced event setup time by 35% with improved processes",
      "Managed a 15-person volunteer team during HackForge",
    ],
    socials: { linkedin: "#" },
  },
  {
    id: "t20",
    name: "Pooja Bhattacharya",
    position: "Logistics Coordinator",
    photo: "/images/ccjusl-logo.png",
    team: "logistics",
    graduationYear: 2026,
    bio: "Detail-oriented organizer who manages the behind-the-scenes work for all club activities.",
    achievements: [
      "Sourced and managed equipment inventory worth ₹50K+",
      "Coordinated transportation for 3 off-campus events",
      "Built volunteer onboarding process reducing no-shows by 50%",
    ],
    socials: { linkedin: "#" },
  },

  // Sponsorship Team
  {
    id: "t21",
    name: "Debanjan Roy",
    position: "Sponsorship Lead",
    photo: "/images/ccjusl-logo.png",
    team: "sponsorship",
    graduationYear: 2025,
    bio: "Builds and maintains relationships with corporate sponsors and partners to support club activities.",
    achievements: [
      "Raised ₹1.5L+ in sponsorships for HackForge 2024",
      "Onboarded 5 new corporate partners in one academic year",
      "Drafted sponsorship deck adopted as club standard",
    ],
    socials: { linkedin: "#" },
  },
  {
    id: "t22",
    name: "Shreya Chakraborty",
    position: "Partnership Coordinator",
    photo: "/images/ccjusl-logo.png",
    team: "sponsorship",
    graduationYear: 2026,
    bio: "Focuses on creating mutually beneficial partnerships between the club and industry partners.",
    achievements: [
      "Negotiated in-kind sponsorship covering 100% of event swag",
      "Maintained sponsor deliverable tracker with 100% on-time delivery",
      "Cultivated long-term relationship with 3 recurring sponsors",
    ],
    socials: { linkedin: "#" },
  },
];
