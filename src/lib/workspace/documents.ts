import { GAMING_TRACKERS } from "@/lib/gaming";
import { projectDocuments } from "./project-documents";
import type { DocumentContent } from "./types";

export const documents: Record<string, DocumentContent> = {
  readme: {
    kind: "markdown",
    title: "Iresh Sharma",
    status: "live",
    blocks: [
      {
        type: "callout",
        text: "Fullstack by day. WatchIreshStruggle by night. The old website still thinks I work at Twilio. This window is the patch.",
      },
      {
        type: "p",
        text: "Bengaluru. Member of Technical Staff at Salesforce, currently helping build native Voice infra. Before that: Twilio, SuperTokens, a stack of internships and campus clubs, and a freelance habit I have not successfully quit. NIE Mysore, Computer Science, class of someone who started a GitHub account in 2017 and never emotionally left.",
      },
      {
        type: "p",
        text: "I ship production systems at scale and then immediately start a scrappy MVP because idle hands open Cursor. Kafka at tens of millions of events a minute, Flutter SDKs, Gmail APIs, 3D printers, basketball, hip-hop, and a LeetCode repo whose README admits competitive programming never really attracted me. That is the brand.",
      },
      {
        type: "h2",
        text: "Currently building",
      },
      {
        type: "p",
        text: "CodeLoom, a coding agent that has now opened more pull requests on its own repo than I have on most of mine. Engine, cloud sandboxes, a web client, a Go TUI: six repos, one socket. The receipts are in major-projects/codeloom.md, including the one where it failed to recognise itself as Python. The green dot in the status bar opens it. It will not stop bragging.",
      },
      {
        type: "links",
        items: [
          { label: "codeloom.iresharma.com/engine/results — every run, itemised", href: "https://codeloom.iresharma.com/engine/results" },
          { label: "github.com/iresharma/codeloom — the umbrella repo", href: "https://github.com/iresharma/codeloom" },
        ],
      },
      {
        type: "h2",
        text: "How to read this window",
      },
      {
        type: "ul",
        items: [
          "about.md — the human patch notes.",
          "career.md — jobs, in chronological self-roast.",
          "projects.ts — the index. projects/ — the actual writeups.",
          "projects/codeloom.md, lens-distill.md, seeksphere.md, reach.md, g-notify.md — roast, then the real systems.",
          "extras/ — hobbies, gaming (PSN, Steam, Valorant), YouTube, the blog.",
          "Outline — posts and projects, because I process trauma as markdown.",
        ],
      },
      {
        type: "h2",
        text: "Also on the internet",
      },
      {
        type: "links",
        items: [
          { label: "blog.iresharma.com — WatchIreshStruggle", href: "https://blog.iresharma.com" },
          { label: "github.com/iresharma — 100+ repos, some finished", href: "https://github.com/iresharma" },
          { label: "linkedin.com/in/iresharma — the professional fiction", href: "https://linkedin.com/in/iresharma" },
          { label: "youtube.com/@iresharma — same brand, moving pictures", href: "https://www.youtube.com/@iresharma" },
          { label: "leetcode.com/u/iresharma — I swore I was done with this", href: "https://leetcode.com/u/iresharma/" },
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
        text: "Engineering Voice infra at Salesforce by day. Hacking on products that become blog posts by night. Open for freelance, closed for small talk about work-life balance.",
      },
      {
        type: "p",
        text: "I am a fullstack engineer who treats side projects like cardio: painful, public, and somehow always scheduled after midnight. I like TypeScript enough to argue with it, Python enough to automate my YouTube problem, and Flutter enough to have owned an SDK at a startup that authenticates half the internet's side projects.",
      },
      {
        type: "p",
        text: "The through-line is not a stack. It is 'I would rather build the tool than do the chore.' G-Notify exists because Gmail would not send HTML. The Shorts generator exists because making vertical videos by hand felt like a war crime. Lens Distill exists because I could not finish Venture Deals. SeekSphere exists because filter drawers are a query planner with worse UX. CodeLoom exists because grep is not comprehension, and now it reviews its own pull requests. This portfolio exists because a normal landing page felt like lying. The long versions are in projects/.",
      },
      {
        type: "h2",
        text: "Operating system",
      },
      {
        type: "ul",
        items: [
          "Bengaluru, after Mysuru, after NIE.",
          "GDSC Lead, IEEE webmaster, campus ambassador — I collected titles like they were Pokémon.",
          "Photography when the light is good. Hip-hop when it is not.",
          "Basketball as cardio, allegedly.",
          "3D printing as a second compiler, except the errors are plastic.",
        ],
      },
      {
        type: "p",
        text: "I write at WatchIreshStruggle, which is not a humble brag. It is a content strategy and a warning label.",
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
        text: "The LinkedIn version is 'shipped production systems at scale.' The comments version is below.",
      },
      {
        type: "h2",
        text: "Salesforce — Member of Technical Staff",
      },
      {
        type: "p",
        text: "Dec 2025 → now. Native Voice infra. I went from Twilio, a company whose entire personality is APIs for talking, to Salesforce, a company whose entire personality is CRM, to work on… talking. The bit writes itself. Specialist on paper. Still googling internal acronyms in private.",
      },
      {
        type: "h2",
        text: "Twilio — L1, then L2, plus a summer as an intern who stayed in the plot",
      },
      {
        type: "p",
        text: "Intern on Flex in 2022: Java microservice for account config, a CRM plugin that stitched the same customer's calls across channels, and a reliability fix so the thing could boot without memcached. Then I came back as L1 in 2023 and did the grown-up sequel: Kafka Streams chewing tens of millions of events a minute under a sub-5-second SLA. Disaster recovery that copied terabytes across Aurora and DynamoDB with a 30-minute delay and the reporting APIs to prove nobody had lied. Notifications that pager-duty your custom rules and then apologize when the system recovers. Also UI, because fullstack means you don't get to pick.",
      },
      {
        type: "p",
        text: "L2 lasted four months in 2025 and then Salesforce called. I like to think I speedran Big Tech.",
      },
      {
        type: "h2",
        text: "SuperTokens — Software Engineer",
      },
      {
        type: "p",
        text: "Nov 2022 → Aug 2023. Open-source auth. I touched the Flutter, Go, Node, and Python SDKs so developers in four languages could have the same identity crisis. Owned search on the user-management dashboard. Lived in Discord helping people who had read the docs and chosen violence. Started by taking the Flutter SDK, adding Dio, and updating drivers. Ended by knowing too much about sessions.",
      },
      {
        type: "h2",
        text: "The origin story, compressed",
      },
      {
        type: "ul",
        items: [
          "Triomics, 2022 — joined mid-release, fixed codegen, inactivity auth, and enough UI that the pixels stopped arguing.",
          "Exinous, 2022 — custom enterprise software. ERPs. The word 'custom' was doing a lot of work.",
          "Learners Digital, 2020–21 — shipped a cross-platform edtech app. Play Store. Real users. Real crashlytics.",
          "Deshik Labs, 2020–22 — Mysuru fullstack years. This is where I learned that 'full stack' is a personality.",
          "AcadBoost, 2020 — recorded a web course. I have been WatchIreshStruggle longer than the blog admits.",
          "NIE Mysore, CSE 2019–23 — GDSC Lead, DSC web lead, IEEE Computer Society tech lead, IEEE webmaster. I was, briefly, a student org.",
        ],
      },
    ],
  },
  projects: {
    kind: "code",
    language: "typescript",
    lines: [
      "// iresharma/projects.ts",
      "// compiled from github, linkedin, and poor impulse control",
      "// long versions: projects/codeloom.md, lens-distill.md, seeksphere.md, reach.md, g-notify.md",
      "",
      "export type Project = {",
      "  name: string;",
      "  pitch: string;",
      "  stack: string[];",
      "  shipped: boolean;",
      "  originStory: string;",
      "};",
      "",
      "export const dayJob = {",
      "  company: \"Salesforce\",",
      "  doing: \"native Voice infra\",",
      "  previously: [\"Twilio\", \"SuperTokens\"],",
      "};",
      "",
      "export const shipped: Project[] = [",
      "  {",
      "    name: \"CodeLoom\",",
      "    pitch: \"coding agent: orchestrator, six subagents, worktrees, a PR at the end. You keep merge\",",
      "    stack: [\"Python engine\", \"FastAPI + Docker\", \"Next.js\", \"Go TUI\", \"tree-sitter\", \"LSP\"],",
      "    shipped: true,",
      "    originStory: \"educative attempt, typo in the GitHub bio, now opens PRs on its own repo\",",
      "  },",
      "  {",
      "    name: \"Lens Distill\",",
      "    pitch: \"PDF plus a topic lens becomes claims, a vocabulary, and a concept graph\",",
      "    stack: [\"Next.js\", \"Neon pgvector\", \"Haiku\", \"Sonnet\", \"Opus\"],",
      "    shipped: true,",
      "    originStory: \"I could not finish Venture Deals. I built a pipeline. I still have not read Venture Deals.\",",
      "  },",
      "  {",
      "    name: \"SeekSphere\",",
      "    pitch: \"natural language in, SQL-shaped catalog results out, Clerk-shaped SDK\",",
      "    stack: [\"intent classifier\", \"LLM-to-SQL\", \"MCP connectors\", \"@seeksphere/sdk\"],",
      "    shipped: true,",
      "    originStory: \"filters are a query planner with worse UX. SuperTokens muscle memory.\",",
      "  },",
      "  {",
      "    name: \"Reach\",",
      "    pitch: \"work desk for creators who also have a calendar, inbox, and a Shopify tab they should close\",",
      "    stack: [\"Remix\", \"Next\", \"shadcn\", \"AI tools I will not name in a type\"],",
      "    shipped: true,",
      "    originStory: \"started as a SaaS, became a lifestyle, still in the repo as reach-io-remix and reachv2\",",
      "  },",
      "  {",
      "    name: \"G-Notify\",",
      "    pitch: \"HTML mailer that talks to Gmail APIs because nodemailer felt like cheating\",",
      "    stack: [\"Nuxt\", \"Express\", \"GAPIs\", \"the GDSC core-team recruiting spreadsheet\"],",
      "    shipped: true,",
      "    originStory: \"I was GDSC Lead. Twenty offer emails. Gmail said no to HTML. I said fine, I'll do it myself.\",",
      "  },",
      "  {",
      "    name: \"Shorts Content Generator\",",
      "    pitch: \"text in, YouTube Short out, ~22 seconds, CPU first, Pexels for the B-roll\",",
      "    stack: [\"Python\", \"MoviePy\", \"Coqui TTS\", \"five fallbacks because TTS is a gaslight\"],",
      "    shipped: true,",
      "    originStory: \"open sourced because paying for faceless-video SaaS felt like a skill issue\",",
      "  },",
      "  {",
      "    name: \"git-accounts-manager\",",
      "    pitch: \"Electron app for people with too many GitHub identities and one laptop\",",
      "    stack: [\"Electron\", \"ssh-agent diplomacy\"],",
      "    shipped: true,",
      "    originStory: \"work account, personal account, the third one I do not talk about\",",
      "  },",
      "  {",
      "    name: \"GpayRedesign\",",
      "    pitch: \"Flutter UI that Google Pay could have shipped if Google Pay asked me\",",
      "    stack: [\"Flutter\", \"audacity\"],",
      "    shipped: true,",
      "    originStory: \"redesign energy. 2020. We do not apologize for the era.\",",
      "  },",
      "  {",
      "    name: \"Sapphire\",",
      "    pitch: \"a Python templating engine whose files end in .sph, on purpose\",",
      "    stack: [\"Python\", \"the belief that Jinja needed a rival\"],",
      "    shipped: true,",
      "    originStory: \"small effort. big extension. nobody asked.\",",
      "  },",
      "  {",
      "    name: \"Variable bitrate streaming server\",",
      "    pitch: \"video in, HLS + MPEG-DASH out, a web page to pretend I was Netflix\",",
      "    stack: [\"ffmpeg\", \"hope\", \"a 2019 blog post\"],",
      "    shipped: true,",
      "    originStory: \"I was in college and thought protocols were a personality\",",
      "  },",
      "];",
      "",
      "export const also = [",
      "  \"create-react-app-v2 — I forked the generator because the official one made me refactor\",",
      "  \"106 public repos — this is not a flex, it is a cry for help\",",
      "];",
      "",
      "// The index is a bit. The systems are in projects/*.md.",
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
        text: "When I am not coding I like to play basketball, try photography, listen to hip-hop, and learn 3D printing. That sentence is from the old site. It was optimistic about the 'not coding' part.",
      },
      {
        type: "p",
        text: "The rest of this window is jobs and repos. This file is basketball, printers, boards, cameras, and playlists. Games got their own file because I doxed the rank on purpose.",
      },
      {
        type: "h2",
        text: "The list, compressed",
      },
      {
        type: "ul",
        items: [
          "Basketball — pickup, not a podcast. Bengaluru courts are a distributed system. I defend, allegedly.",
          "3D printing — another Benchy, slightly wrong. Slicer settings are compiler flags. Photography of the print is the only stage that ships.",
          "IoT — boards that speak UART and spite. Firmware at 3am, after Voice infra at 3pm.",
          "Photography and hip-hop — good light, worse playlists, walk home, open Cursor.",
        ],
      },
    ],
  },
  gaming: {
    kind: "markdown",
    title: "gaming.md",
    status: "live",
    blocks: [
      {
        type: "callout",
        text: "The dock shipped. PSN, Steam, and a Valorant tracker sitting next to the résumé on purpose.",
      },
      {
        type: "p",
        text: "Hobbies.md got the analog stuff. This file is ranked anxiety with URLs. Riot ID iresharma#noob, PSN iresharma, Steam ireshrma. Add me if the tag does not scare you.",
      },
      {
        type: "p",
        text: "I have 106 GitHub repos and a LeetCode profile I maintain after saying competitive programming never attracted me. The trackers below have the same energy: casual in the copy, unhinged in the friend request.",
      },
      { type: "live", source: "gaming" },
      {
        type: "h2",
        text: "Elsewhere",
      },
      {
        type: "links",
        items: GAMING_TRACKERS,
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
        text: "Channel name: WatchIreshStruggle. I then wrote a pipeline that makes Shorts in 22 seconds. The bit is load-bearing.",
      },
      {
        type: "p",
        text: "Same brand as the blog, moving pictures. I show up on camera the way I show up in markdown: a fullstack engineer who will automate the embarrassment if it takes more than one take. The Shorts generator exists because opening CapCut felt like a war crime. The channel exists because the blog needed a face, and I was available.",
      },
      {
        type: "p",
        text: "If you wanted a polished creator-economy funnel you came to the wrong extras folder. Subscribe if you like Voice infra by day and watching someone debug a TTS fallback ladder by night. Numbers below are live-ish. The jokes are cached forever.",
      },
      { type: "live", source: "youtube" },
      {
        type: "h2",
        text: "Elsewhere",
      },
      {
        type: "links",
        items: [
          {
            label: "youtube.com/@iresharma — WatchIreshStruggle",
            href: "https://www.youtube.com/@iresharma",
          },
          {
            label: "The 22-second Shorts generator, as a blog post",
            href: "https://blog.iresharma.com/building-an-ai-powered-youtube-shorts-generator-a-complete-technical-deep-dive",
          },
        ],
      },
    ],
  },
  blog: {
    kind: "markdown",
    title: "blog.md",
    status: "live",
    blocks: [
      {
        type: "callout",
        text: "WatchIreshStruggle. Hashnode. Bengaluru. Building Voice by day, publishing the outage report by night.",
      },
      {
        type: "p",
        text: "I write when a side project becomes a confession. Latest hits: why a coding agent needs tree-sitter and LSP, the pipeline I built because I could not finish Venture Deals, and a local-first Shorts factory. Older hits include Reach's tech stack, learning gRPC the hard way, an Appwrite hackathon, and Nuxt SSG from when I still believed in static generation as a personality.",
      },
      {
        type: "p",
        text: "Individual posts also live in the Outline, like a second index I will not keep in sync. This file is the front door. That panel is the grep. Numbers below are scraped off the homepage once a day, because paying Hashnode for JSON felt like a bit.",
      },
      { type: "live", source: "blog" },
      {
        type: "h2",
        text: "Elsewhere",
      },
      {
        type: "links",
        items: [
          { label: "blog.iresharma.com — WatchIreshStruggle", href: "https://blog.iresharma.com" },
          {
            label: "hashnode.com/@Iresharma",
            href: "https://hashnode.com/@Iresharma",
          },
        ],
      },
    ],
  },
  "post-agents": {
    kind: "markdown",
    title: "why-agents-read-code-three-ways.md",
    status: "live",
    blocks: [
      {
        type: "callout",
        text: "WatchIreshStruggle · Aug 2026 · 8 min. The first problem is not generation. It is comprehension. Relatable.",
      },
      {
        type: "p",
        text: "If you are building something like Devin, the model cannot just grep a five-file toy repo and call it architecture. I wrote about why a coding agent needs tree-sitter for cheap local lookups and LSP for the expensive global ones — goto definition, find references, hover, diagnostics — and why conflating them either wastes tokens or wastes time.",
      },
      {
        type: "p",
        text: "Tree-sitter is instant and does not care if the rest of the project is on fire. LSP is slow to start and actually understands imports. The punchline is in the system prompt: prefer the cheapest tool that answers the question. I have been trying to live like that. I have not succeeded. Hence this portfolio.",
      },
      {
        type: "links",
        items: [
          {
            label: "Read the post on WatchIreshStruggle",
            href: "https://blog.iresharma.com/why-a-coding-agent-needs-three-different-ways-to-read-code",
          },
        ],
      },
    ],
  },
  "post-venture": {
    kind: "markdown",
    title: "i-never-finished-venture-deals.md",
    status: "live",
    blocks: [
      {
        type: "callout",
        text: "WatchIreshStruggle · Aug 2026 · 17 min. I grep books. Books do not grep. So I built Lens Distill.",
      },
      {
        type: "p",
        text: "I started Venture Deals three times. I finished a pipeline instead. PDF in, atomic claims out, each citing the exact paragraphs they came from, plus a concept graph. Seven stages. Haiku extracts, Sonnet merges duplicates, Opus builds the graph, pgvector holds the embeddings. On that book: 3,001 paragraphs became 978 claims, 54 concepts, 318 edges. About an hour. About two dollars. Zero pages actually read in order.",
      },
      {
        type: "p",
        text: "The part worth stealing: I label every paragraph [p412] in the prompt so citations are a range check, not a vibe. The part worth fearing: a silent fallback shipped an empty graph and the UI looked fine. I wrote the post so future me cannot pretend that was a feature.",
      },
      {
        type: "links",
        items: [
          {
            label: "Read the post — I never finished Venture Deals, so I built a pipeline",
            href: "https://blog.iresharma.com/i-never-finished-venture-deals-so-i-built-a-pipeline-to-read-it-for-me",
          },
        ],
      },
    ],
  },
  "post-shorts": {
    kind: "markdown",
    title: "youtube-shorts-in-22-seconds.md",
    status: "live",
    blocks: [
      {
        type: "callout",
        text: "WatchIreshStruggle · Jun 2025 · 5 min. Local-first. CPU. Five TTS engines. One personality.",
      },
      {
        type: "p",
        text: "I open-sourced a Python pipeline that turns text into a YouTube Short in about 22 seconds. MoviePy, Coqui TTS, Pexels for images, a fallback ladder that goes neural → cloud → pyttsx3 → macOS say → espeak, which is the five stages of grief. Perfect audio-video sync, 9:16, and the kind of architecture post you write when you are both proud and a little scared of how far you will go to avoid opening CapCut.",
      },
      {
        type: "p",
        text: "This is the same man who named his YouTube channel WatchIreshStruggle and then automated the struggle. I contain multitudes, and also a videoOrchestrator.py.",
      },
      {
        type: "links",
        items: [
          {
            label: "Read the deep dive",
            href: "https://blog.iresharma.com/building-an-ai-powered-youtube-shorts-generator-a-complete-technical-deep-dive",
          },
          {
            label: "GitHub — Shorts-Content-Generator",
            href: "https://github.com/iresharma/Shorts-Content-Generator",
          },
        ],
      },
    ],
  },
  ...projectDocuments,
};
