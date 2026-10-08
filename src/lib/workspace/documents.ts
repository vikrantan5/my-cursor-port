import { projectDocuments } from "./project-documents";
import type { DocumentContent } from "./types";

export const documents: Record<string, DocumentContent> = {
  readme: {
    kind: "markdown",
    title: "Vikrant Singh",
    status: "live",
    blocks: [
      {
        type: "callout",
        text: "IT undergrad who ships fullstack apps by day and reviews facts on FactDefiner by night. 300+ LeetCode problems solved and counting.",
      },
      {
        type: "p",
        text: "Kolkata. B.Tech in Information Technology at Netaji Subhash Engineering College, class of 2027, YGPA 8.47/10. Strong on Data Structures, Algorithms, OOP, and DBMS, and happiest building API-driven web apps and data ingestion pipelines with JavaScript/TypeScript, Node.js, SQL, and MongoDB.",
      },
      {
        type: "p",
        text: "I build the full thing — scraping pipeline, database schema, auth, billing — not just the UI. HireAI exists because job boards are a mess and recruiters don't read résumés carefully. MovieLab exists because I wanted a movie app that didn't refetch the same page twice. This portfolio exists because a plain landing page felt like undercounting the work.",
      },
      {
        type: "h2",
        text: "Currently building",
      },
      {
        type: "p",
        text: "HireAI, a recruitment platform with a Playwright job-ingestion pipeline, seven Firestore collections, Groq-generated interview questions, and Razorpay subscription billing. Already past 100 users. The receipts are in major-projects/hireai.md.",
      },
      {
        type: "links",
        items: [
          { label: "github.com/vikrantan5 — the repos", href: "https://github.com/vikrantan5" },
        ],
      },
      {
        type: "h2",
        text: "How to read this window",
      },
      {
        type: "ul",
        items: [
          "about.md — the human version.",
          "career.md — internship, education, and the stuff I won.",
          "projects.ts — the index. major-projects/ — the actual write-ups.",
          "major-projects/hireai.md, movielab.md — the systems, in detail.",
          "extras/ — hobbies, achievements, the YouTube channel.",
          "Outline — the career timeline, because scrolling is slower than clicking.",
        ],
      },
      {
        type: "h2",
        text: "Also on the internet",
      },
      {
        type: "links",
        items: [
          { label: "github.com/vikrantan5 — repos, some finished", href: "https://github.com/vikrantan5" },
          { label: "linkedin.com/in/vikrant-singh5 — the professional version", href: "https://www.linkedin.com/in/vikrant-singh5/" },
          { label: "youtube.com/@Factdefiner — FactDefiner Vikrant", href: "https://www.youtube.com/@Factdefiner" },
        ],
      },
    ],
  },
  about: {
    kind: "markdown",
    title: "about.md",
    status: "live",
    blocks: [
      {
        type: "callout",
        text: "IT undergraduate who treats side projects like exam prep: painful, scheduled too late at night, and somehow still finished. Open to internships and full-time roles, closed for small talk about sleep schedules.",
      },
      {
        type: "p",
        text: "I'm a fullstack engineer-in-training who likes TypeScript enough to fight with it, Python enough to automate the boring parts, and SQL enough to actually think in joins. The through-line is not a single stack — it's 'build the whole pipeline, not just the page.' HireAI exists because job listings across the internet are duplicated, inconsistent, and unranked. MovieLab exists because I wanted to see how far Redux Toolkit caching could go on a free TMDB quota.",
      },
      {
        type: "h2",
        text: "Operating system",
      },
      {
        type: "ul",
        items: [
          "Kolkata, at Netaji Subhash Engineering College, Information Technology, class of 2027.",
          "300+ LeetCode problems solved — competitive programming was never the goal, consistency was.",
          "FactDefiner Vikrant on YouTube — fact-based content, filmed between assignments.",
          "Hackathons and algorithm contests whenever the timing works out.",
        ],
      },
      {
        type: "p",
        text: "I make videos as FactDefiner Vikrant, which is not a career pivot. It's a content habit that runs parallel to the engineering one.",
      },
    ],
  },
  career: {
    kind: "markdown",
    title: "career.md",
    status: "live",
    blocks: [
      {
        type: "callout",
        text: "The résumé version says 'Information Technology undergraduate with hands-on experience building API-driven web applications.' This is the slightly longer version.",
      },
      {
        type: "h2",
        text: "Tending To Infinity — Full Stack Developer Intern",
      },
      {
        type: "p",
        text: "Oct 2025 → Nov 2025. Built responsive, cross-browser web applications using Next.js, JavaScript, HTML, and CSS. Implemented server-side rendering and a reusable component library, which improved Lighthouse performance scores by roughly 30% on the pages that got migrated. Worked inside a Git-based branching workflow, and spent real time debugging and profiling during code review and QA cycles — the less glamorous half of the job that actually teaches you something.",
      },
      {
        type: "h2",
        text: "Netaji Subhash Engineering College",
      },
      {
        type: "p",
        text: "B.Tech in Information Technology, 2023 → 2027, YGPA 8.47/10. The coursework that actually shows up in the projects: Data Structures & Algorithms, Object-Oriented Programming, DBMS & SQL, and System Design. The 300+ solved LeetCode problems are the unofficial lab component nobody assigned.",
      },
      {
        type: "h2",
        text: "Achievements",
      },
      {
        type: "ul",
        items: [
          "1st place, Algothon (GFG x NSEC) — designed and implemented an optimized algorithmic solution under a fixed time limit.",
          "Best Innovation Idea, Hult Prize — presented a scalable business innovation concept.",
        ],
      },
    ],
  },
  projects: {
    kind: "code",
    language: "typescript",
    lines: [
      "// vikrantan5/projects.ts",
      "// compiled from github, resume, and a habit of finishing things",
      "// long versions: major-projects/hireai.md, movielab.md",
      "",
      "export type Project = {",
      "  name: string;",
      "  pitch: string;",
      "  stack: string[];",
      "  shipped: boolean;",
      "  originStory: string;",
      "};",
      "",
      "export const status = {",
      "  studying: \"B.Tech Information Technology, Netaji Subhash Engineering College\",",
      "  ygpa: 8.47,",
      "  internshipsDone: [\"Tending To Infinity\"],",
      "  leetcodeSolved: 300,",
      "};",
      "",
      "export const shipped: Project[] = [",
      "  {",
      "    name: \"HireAI\",",
      "    pitch: \"AI-powered recruitment platform: scrape jobs, dedupe them, generate interview questions, bill the subscription\",",
      "    stack: [\"Next.js\", \"TypeScript\", \"Firestore\", \"Groq API\", \"Playwright\", \"Razorpay\"],",
      "    shipped: true,",
      "    originStory: \"job boards were a mess of duplicate listings. 100+ users later, still is, just less so.\",",
      "  },",
      "  {",
      "    name: \"MovieLab\",",
      "    pitch: \"movie discovery platform on React and TMDB, with Redux Toolkit doing the caching nobody asked for\",",
      "    stack: [\"React.js\", \"Redux Toolkit\", \"TMDB API\"],",
      "    shipped: true,",
      "    originStory: \"wanted to see how far a free TMDB quota could stretch. Cut redundant calls by ~20%.\",",
      "  },",
      "];",
      "",
      "// The index is here. The systems are in major-projects/*.md.",
      "",
    ],
  },
  hobbies: {
    kind: "markdown",
    title: "hobbies.md",
    status: "live",
    blocks: [
      {
        type: "callout",
        text: "When I'm not shipping code I'm either filming FactDefiner videos or stuck on problem #287 on LeetCode. Both feel like the same muscle.",
      },
      {
        type: "p",
        text: "The rest of this window is internships and projects. This file is the camera, the contests, and the parts that don't show up on a transcript.",
      },
      {
        type: "h2",
        text: "The list, compressed",
      },
      {
        type: "ul",
        items: [
          "FactDefiner Vikrant — a YouTube channel for fact-based content, filmed between assignments and deploys.",
          "LeetCode — 300+ problems solved, less about competitive programming and more about not losing the habit.",
          "Hackathons — Algothon and Hult Prize happened because a team needed one more person who'd actually stay up for it.",
          "Side projects that don't make the major-projects list yet — there's always one half-finished.",
        ],
      },
    ],
  },
  achievements: {
    kind: "markdown",
    title: "achievements.md",
    status: "live",
    blocks: [
      {
        type: "callout",
        text: "Two wins, one YGPA, and a LeetCode counter that keeps climbing.",
      },
      {
        type: "ul",
        items: [
          "1st place — Algothon (GFG x NSEC): designed and implemented an optimized algorithmic solution under a fixed time limit.",
          "Best Innovation Idea — Hult Prize: presented a scalable business innovation concept to judges who were not engineers, which is its own skill.",
          "YGPA 8.47 / 10 — B.Tech Information Technology, Netaji Subhash Engineering College.",
          "300+ LeetCode problems solved — the unofficial, unassigned lab component.",
        ],
      },
    ],
  },
  youtube: {
    kind: "markdown",
    title: "youtube.md",
    status: "live",
    blocks: [
      {
        type: "callout",
        text: "Channel name: FactDefiner Vikrant. Fact-based content, filmed in whatever time is left after shipping code.",
      },
      {
        type: "p",
        text: "Same person, different camera angle. FactDefiner Vikrant is where I post fact-checking and knowledge-style content — a different muscle than debugging Firestore indexes, but the same habit of finishing what I start.",
      },
      { type: "live", source: "youtube" },
      {
        type: "h2",
        text: "Elsewhere",
      },
      {
        type: "links",
        items: [
          { label: "youtube.com/@Factdefiner — FactDefiner Vikrant", href: "https://www.youtube.com/@Factdefiner" },
        ],
      },
    ],
  },
  ...projectDocuments,
};
