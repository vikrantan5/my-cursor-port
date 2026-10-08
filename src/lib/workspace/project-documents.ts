import type { DocumentContent } from "./types";

export const projectDocuments: Record<string, DocumentContent> = {
  hireai: {
    kind: "markdown",
    title: "HireAI",
    status: "live",
    blocks: [
      {
        type: "callout",
        text: "Built solo, shipped to 100+ users. Playwright goes and finds the jobs, Groq writes the interview questions, and the subscription actually gets billed through Razorpay.",
      },
      {
        type: "p",
        text: "HireAI is a full-stack recruitment platform with separate recruiter and job-seeker workflows: job posting, applications, interview scheduling, and feedback tracking. The data model spans seven Firestore collections — users, companies, jobs, applications, interviews, feedback, subscriptions — with composite indexes chosen to serve both sides of the marketplace without client-side filtering.",
      },
      {
        type: "h2",
        text: "Ingestion pipeline",
      },
      {
        type: "ul",
        items: [
          "A Playwright-based job ingestion pipeline collects listings from multiple sources on a schedule.",
          "Every listing is normalized into a single schema before it reaches Firestore.",
          "Duplicates are removed using content hashing combined with fuzzy title and company matching, so the same role posted twice does not show up twice.",
        ],
      },
      {
        type: "h2",
        text: "Interview intelligence",
      },
      {
        type: "p",
        text: "An LLM integrated through the Groq API (Llama) generates role-specific interview questions straight from the job description, seniority level, and required skill set — no generic question bank. On the other end, a transcript-based feedback pipeline takes the raw interview transcript and turns it into structured output: per-competency scores, strengths, improvement areas, and a final recommendation.",
      },
      {
        type: "h2",
        text: "Auth & billing",
      },
      {
        type: "ul",
        items: [
          "Firebase Authentication with role-based access control separates recruiter and job-seeker surfaces.",
          "Razorpay-backed subscription billing handles the recruiter-side paywall.",
        ],
      },
    ],
  },
  movielab: {
    kind: "markdown",
    title: "MovieLab",
    status: "live",
    blocks: [
      {
        type: "callout",
        text: "A smaller, faster-moving build: a movie discovery app where the interesting part is not the UI, it's making sure the same TMDB request doesn't fire twice.",
      },
      {
        type: "p",
        text: "MovieLab is a responsive movie discovery platform built on React.js with browse, dynamic search, and detail views backed by the TMDB API. Nothing exotic — the goal was a clean, fast catalog browsing experience.",
      },
      {
        type: "h2",
        text: "State & caching",
      },
      {
        type: "p",
        text: "Application state is centralized in Redux Toolkit, and fetched results are cached there too. During typical navigation — back and forth between search, browse, and detail pages — that caching cut redundant TMDB API calls by roughly 20%, which matters once you're on a free-tier rate limit.",
      },
    ],
  },
};
