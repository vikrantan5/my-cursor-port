export type ProjectPageMeta = {
  id: string;
  slug: string;
  fileName: string;
  title: string;
  product: string;
  year: string;
  tagline: string;
  description: string;
};

export const PROJECT_PAGES: ProjectPageMeta[] = [
  {
    id: "hireai",
    slug: "hireai",
    fileName: "hireai.md",
    title: "HireAI",
    product: "AI-powered career & recruitment platform",
    year: "2025",
    tagline: "Playwright scrapes the jobs, Groq writes the interview questions, Razorpay collects the subscription.",
    description:
      "HireAI is Vikrant Singh's full-stack recruitment platform: a Playwright job-ingestion pipeline, seven Firestore collections, Groq-powered interview generation, and Razorpay billing — used by 100+ users.",
  },
  {
    id: "movielab",
    slug: "movielab",
    fileName: "movielab.md",
    title: "MovieLab",
    product: "movie discovery platform",
    year: "2024",
    tagline: "Redux Toolkit caches the TMDB calls so scrolling through movies doesn't burn the API quota.",
    description:
      "MovieLab is Vikrant Singh's movie discovery platform built on React and the TMDB API, with Redux Toolkit trimming redundant calls by roughly 20%.",
  },
];

export const PROJECT_SLUGS = PROJECT_PAGES.map((project) => project.slug);

export function getProjectPage(slug: string): ProjectPageMeta | undefined {
  return PROJECT_PAGES.find((project) => project.slug === slug);
}

export function isProjectFile(id: string): boolean {
  return PROJECT_PAGES.some((project) => project.id === id);
}
