// Shared TypeScript interfaces for CMS-ready data structures

export interface EventDisplay {
  slug: string;
  name: string;
  type: string;
  coverImage: string;
  date: string;
  shortDescription: string;
  status: "upcoming" | "past";
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: "workshops" | "hackathons" | "competitions" | "club-activities";
  caption?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  photo: string;
  team: string;
  bio: string;
  graduationYear: number;
  achievements?: string[];
  socials: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

export interface AlumniMember {
  id: string;
  name: string;
  photo: string;
  graduationYear: number;
  company: string;
  role: string;
  bio?: string;
  achievements?: string[];
  socials: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

export interface InterviewGuide {
  id: string;
  candidateName: string;
  department: string;
  yearOfGrad: number;
  company: string;
  pdfPath: string;
  experience: string;
  prepTips?: string;
  additionalNotes?: string;
  selected: boolean;
}

