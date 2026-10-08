import type { OutlineItem, OutlineSymbol } from "./types";
import { headingId } from "./slug";

const CAREER = {
  internship: headingId("Tending To Infinity — Full Stack Developer Intern"),
  education: headingId("Netaji Subhash Engineering College"),
  achievements: headingId("Achievements"),
} as const;

function role(
  id: string,
  label: string,
  detail: string,
  heading: string,
): OutlineSymbol {
  return {
    id,
    label,
    detail,
    kind: "method",
    fileId: "career",
    heading,
  };
}

const internship: OutlineSymbol = {
  id: "tl-ttoi",
  label: "Tending To Infinity",
  detail: "Oct–Nov 2025",
  kind: "class",
  fileId: "career",
  heading: CAREER.internship,
  children: [
    role("tl-ttoi-fsd", "Full Stack Developer Intern", "Next.js, SSR, Lighthouse +30%", CAREER.internship),
  ],
};

const education: OutlineSymbol = {
  id: "tl-nsec",
  label: "Netaji Subhash Engineering College",
  detail: "2023–2027",
  kind: "class",
  fileId: "career",
  heading: CAREER.education,
  children: [
    {
      id: "tl-nsec-btech",
      label: "B.Tech, Information Technology",
      detail: "YGPA 8.47 / 10",
      kind: "property",
      fileId: "career",
      heading: CAREER.education,
    },
  ],
};

const achievements: OutlineSymbol = {
  id: "tl-achievements",
  label: "Achievements",
  detail: "2024–25",
  kind: "module",
  fileId: "career",
  heading: CAREER.achievements,
  children: [
    {
      id: "tl-algothon",
      label: "Algothon — GFG x NSEC",
      detail: "1st place",
      kind: "enum",
      fileId: "career",
      heading: CAREER.achievements,
    },
    {
      id: "tl-hult",
      label: "Hult Prize",
      detail: "Best Innovation Idea",
      kind: "enum",
      fileId: "career",
      heading: CAREER.achievements,
    },
  ],
};

export const careerTimeline: OutlineSymbol[] = [internship, education, achievements];

export const outlineItems: OutlineItem[] = [];

export function flattenOutline(nodes: OutlineSymbol[]): OutlineSymbol[] {
  return nodes.flatMap((node) => [node, ...flattenOutline(node.children ?? [])]);
}

export function outlineTree(oldestFirst = false): OutlineSymbol[] {
  if (!oldestFirst) return careerTimeline;
  return careerTimeline
    .slice()
    .reverse()
    .map((node) => ({
      ...node,
      children: node.children ? node.children.slice().reverse() : undefined,
    }));
}

export function expandableIds(nodes: OutlineSymbol[]): string[] {
  return flattenOutline(nodes)
    .filter((node) => (node.children?.length ?? 0) > 0)
    .map((node) => node.id);
}
