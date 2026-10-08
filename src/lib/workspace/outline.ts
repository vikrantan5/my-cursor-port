import type { OutlineItem, OutlineSymbol } from "./types";
import { headingId } from "./slug";

const CAREER = {
  salesforce: headingId("Salesforce — Member of Technical Staff"),
  twilio: headingId(
    "Twilio — L1, then L2, plus a summer as an intern who stayed in the plot",
  ),
  supertokens: headingId("SuperTokens — Software Engineer"),
  origin: headingId("The origin story, compressed"),
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

const salesforce: OutlineSymbol = {
  id: "tl-salesforce",
  label: "Salesforce",
  detail: "Dec 2025 →",
  kind: "class",
  fileId: "career",
  heading: CAREER.salesforce,
  children: [
    role("tl-sf-mts", "Member of Technical Staff", "Voice infra", CAREER.salesforce),
  ],
};

const twilio: OutlineSymbol = {
  id: "tl-twilio",
  label: "Twilio",
  detail: "2022–25",
  kind: "class",
  fileId: "career",
  heading: CAREER.twilio,
  children: [
    role("tl-twilio-l2", "L2", "2025 · four months", CAREER.twilio),
    role("tl-twilio-l1", "L1", "2023–25 · Kafka / DR", CAREER.twilio),
    role("tl-twilio-intern", "Intern", "2022 · Flex", CAREER.twilio),
  ],
};

const supertokens: OutlineSymbol = {
  id: "tl-supertokens",
  label: "SuperTokens",
  detail: "2022–23",
  kind: "class",
  fileId: "career",
  heading: CAREER.supertokens,
  children: [
    role("tl-st-swe", "Software Engineer", "Auth SDKs", CAREER.supertokens),
  ],
};

const origin: OutlineSymbol = {
  id: "tl-origin",
  label: "Origin story",
  detail: "2019–22",
  kind: "module",
  fileId: "career",
  heading: CAREER.origin,
  children: [
    {
      id: "tl-triomics",
      label: "Triomics",
      detail: "2022",
      kind: "property",
      fileId: "career",
      heading: CAREER.origin,
    },
    {
      id: "tl-exinous",
      label: "Exinous",
      detail: "2022",
      kind: "property",
      fileId: "career",
      heading: CAREER.origin,
    },
    {
      id: "tl-learners",
      label: "Learners Digital",
      detail: "2020–21",
      kind: "property",
      fileId: "career",
      heading: CAREER.origin,
    },
    {
      id: "tl-deshik",
      label: "Deshik Labs",
      detail: "2020–22",
      kind: "property",
      fileId: "career",
      heading: CAREER.origin,
    },
    {
      id: "tl-acadboost",
      label: "AcadBoost",
      detail: "2020",
      kind: "property",
      fileId: "career",
      heading: CAREER.origin,
    },
    {
      id: "tl-nie",
      label: "NIE Mysore",
      detail: "CSE 2019–23",
      kind: "enum",
      fileId: "career",
      heading: CAREER.origin,
    },
  ],
};

export const careerTimeline: OutlineSymbol[] = [
  salesforce,
  twilio,
  supertokens,
  origin,
];

export const writingOutline: OutlineSymbol = {
  id: "tl-writing",
  label: "Writing",
  detail: "WatchIreshStruggle",
  kind: "module",
  fileId: "blog",
  children: [
    {
      id: "post-agents",
      label: "why-agents-read-code-three-ways.md",
      detail: "Aug 2026",
      kind: "markdown",
      fileId: "post-agents",
    },
    {
      id: "post-venture",
      label: "i-never-finished-venture-deals.md",
      detail: "Aug 2026",
      kind: "markdown",
      fileId: "post-venture",
    },
    {
      id: "post-shorts",
      label: "youtube-shorts-in-22-seconds.md",
      detail: "Jun 2025",
      kind: "markdown",
      fileId: "post-shorts",
    },
  ],
};

export const outlineItems: OutlineItem[] = (writingOutline.children ?? []).map(
  (child) => ({
    id: child.fileId,
    name: child.label,
    hint: child.detail ?? "",
  }),
);

export function flattenOutline(nodes: OutlineSymbol[]): OutlineSymbol[] {
  return nodes.flatMap((node) => [node, ...flattenOutline(node.children ?? [])]);
}

export function outlineTree(oldestFirst = false): OutlineSymbol[] {
  const career = oldestFirst
    ? careerTimeline
        .slice()
        .reverse()
        .map((node) => ({
          ...node,
          children: node.children ? node.children.slice().reverse() : undefined,
        }))
    : careerTimeline;
  return [...career, writingOutline];
}

export function expandableIds(nodes: OutlineSymbol[]): string[] {
  return flattenOutline(nodes)
    .filter((node) => (node.children?.length ?? 0) > 0)
    .map((node) => node.id);
}
