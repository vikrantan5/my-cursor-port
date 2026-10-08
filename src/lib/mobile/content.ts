export type ChipId = "experience" | "projects" | "hobbies" | "achievements";

export type Chip = {
  id: ChipId;
  label: string;
  prompt: string;
  reply: string;
};

export const ABOUT_MESSAGE =
  "Hey — I'm Vikrant. IT undergrad at Netaji Subhash Engineering College, Kolkata, building fullstack apps and obsessing over DSA. Shipped HireAI (100+ users) and MovieLab, interned at Tending To Infinity, and I'm sitting on 300+ LeetCode problems solved. FactDefiner Vikrant on YouTube is the camera-facing version. This is the phone-sized version. The Cursor window is on a computer.";

export const CHIPS: Chip[] = [
  {
    id: "experience",
    label: "Experience",
    prompt: "Walk me through Vikrant's experience",
    reply:
      "Full Stack Developer Intern at Tending To Infinity, Oct–Nov 2025: Next.js, SSR, a reusable component library, Lighthouse scores up ~30% on the pages he touched. Before and around that: B.Tech Information Technology at Netaji Subhash Engineering College, 2023–2027, YGPA 8.47/10, and a steady grind through Data Structures, Algorithms, OOP, and DBMS.",
  },
  {
    id: "projects",
    label: "Projects",
    prompt: "What has Vikrant actually shipped?",
    reply:
      "Two, both real: HireAI, an AI-powered recruitment platform with a Playwright job-ingestion pipeline, seven Firestore collections, Groq-generated interview questions, and Razorpay billing — used by 100+ people. And MovieLab, a React + TMDB movie discovery app where Redux Toolkit caching cut redundant API calls by ~20%. The index is projects.ts, the long versions are in major-projects/.",
  },
  {
    id: "hobbies",
    label: "Hobbies",
    prompt: "What does Vikrant do when he is not coding?",
    reply:
      "Runs FactDefiner Vikrant on YouTube, making fact-based content on the side. The rest of the time he's grinding LeetCode (300+ solved and counting) or deep in a hackathon — extras/hobbies.md has the rest.",
  },
  {
    id: "achievements",
    label: "Achievements",
    prompt: "What has Vikrant won?",
    reply:
      "1st place at Algothon (GFG x NSEC) for an optimized algorithmic solution under a fixed time limit, and Best Innovation Idea at Hult Prize for a scalable business concept. Both in extras/achievements.md, next to the LeetCode count.",
  },
];
