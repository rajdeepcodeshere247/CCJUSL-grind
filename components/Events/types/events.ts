export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  status: "Open" | "Closed" | "Coming Soon";
  tags: string[];
  finalsDate?: string;
  lastDate?: string;
  teamSize: string;
  prizePool: string;
  format: string;
  color: string;
  category: string;
  driveLink?: string;
  pdfLink?: string;
  link?: string;
}
