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
    id: "codeloom",
    slug: "codeloom",
    fileName: "codeloom.md",
    title: "CodeLoom",
    product: "autonomous coding agent",
    year: "2026",
    tagline: "An engine, six subagents, cloud sandboxes, and a PR at the end. It opens PRs on itself.",
    description:
      "CodeLoom is Iresh Sharma's coding agent: a Python engine speaking NDJSON over a Unix socket, an orchestrator with six subagent personalities in git worktrees, a guarded write funnel, tree-sitter and LSP, Docker sandboxes, and web and Go TUI clients.",
  },
  {
    id: "lens-distill",
    slug: "lens-distill",
    fileName: "lens-distill.md",
    title: "Lens Distill",
    product: "claim distillation pipeline",
    year: "2026",
    tagline: "PDF plus a topic lens becomes cited claims, a vocabulary, and a concept graph.",
    description:
      "Lens Distill is Iresh Sharma's seven-stage book pipeline: parse, chunk, embed, extract, dedupe, canonicalize, and graph — Haiku, Sonnet, Opus, Neon pgvector, deterministic citation checks.",
  },
  {
    id: "seeksphere",
    slug: "seeksphere",
    fileName: "seeksphere.md",
    title: "SeekSphere",
    product: "natural-language e-commerce search",
    year: "2025",
    tagline: "Filter-heavy catalogs become a conversational query and a SQL-shaped answer.",
    description:
      "SeekSphere is Iresh Sharma's intelligent search platform for e-commerce: intent classification, LLM-to-SQL, an MCP connector layer, and a developer SDK modeled on Clerk and SuperTokens.",
  },
  {
    id: "reach",
    slug: "reach",
    fileName: "reach.md",
    title: "Reach",
    product: "creator work desk",
    year: "2022–24",
    tagline: "Calendar, mail, content, Linktree pages, Shopify, and analytics — then a k8s sequel.",
    description:
      "Reach is Iresh Sharma's SaaS for content teams. Remix to microservices: a Go auth proxy, gRPC, Postgres, Redis, Cloudflare R2, Kafka, Next.js ISR brand pages, and page analytics.",
  },
  {
    id: "g-notify",
    slug: "g-notify",
    fileName: "g-notify.md",
    title: "G-Notify",
    product: "HTML mailer on Gmail APIs",
    year: "2021–23",
    tagline: "Mass HTML mail without nodemailer, because Gmail would not send the offer letters.",
    description:
      "G-Notify is Iresh Sharma's Nuxt and Express HTML mailer. It talks to Gmail APIs directly with googleapis and MIME, stores templates in Mongo, and grew out of GDSC recruiting.",
  },
];

export const PROJECT_SLUGS = PROJECT_PAGES.map((project) => project.slug);

export function getProjectPage(slug: string): ProjectPageMeta | undefined {
  return PROJECT_PAGES.find((project) => project.slug === slug);
}

export function isProjectFile(id: string): boolean {
  return PROJECT_PAGES.some((project) => project.id === id);
}
