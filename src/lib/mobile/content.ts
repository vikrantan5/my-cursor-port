export type ChipId = "experience" | "projects" | "hobbies" | "writing";

export type Chip = {
  id: ChipId;
  label: string;
  prompt: string;
  reply: string;
};

export const ABOUT_MESSAGE =
  "Hey — I'm Iresh. Fullstack MTS at Salesforce, currently on native Voice infra in Bengaluru. Before that: Twilio (Kafka, disaster recovery, Flex), SuperTokens (Flutter/Go/Node/Python SDKs), and a freelance habit with 100+ GitHub repos. I named the blog WatchIreshStruggle on purpose. This is the phone-sized version. The Cursor window is on a computer.";

export const CHIPS: Chip[] = [
  {
    id: "experience",
    label: "Experience",
    prompt: "Walk me through Iresh's experience",
    reply:
      "Salesforce now, building Voice. Twilio before that — intern on Flex, then L1 streaming tens of millions of events a minute, then L2 for a speedrun of four months. SuperTokens for auth SDKs and dashboard search. Triomics, Exinous, Learners Digital, Deshik, NIE GDSC Lead. The LinkedIn is long. The plot is 'kept shipping and collecting titles like Pokémon.'",
  },
  {
    id: "projects",
    label: "Projects",
    prompt: "What has Iresh actually shipped?",
    reply:
      "The long versions live in projects/: CodeLoom (coding agent across six repos — engine, cloud sandboxes, web, Go TUI — that opens PRs on its own repo), Lens Distill (seven-stage claim pipeline on Venture Deals), SeekSphere (NL search that compiles to SQL), Reach (Remix to a Go/gRPC k8s circus), G-Notify (Gmail APIs, no nodemailer). The index is projects.ts. The systems are the markdown.",
  },
  {
    id: "hobbies",
    label: "Hobbies",
    prompt: "What does Iresh do when he is not shipping?",
    reply:
      "Basketball, 3D printing, IoT, photography, hip-hop — extras/hobbies.md. Games live in extras/gaming.md: Valorant iresharma#noob, PSN iresharma, Steam ireshrma. Tracker.gg has the rank. I will not screenshot it here.",
  },
  {
    id: "writing",
    label: "Writing",
    prompt: "Where can I read Iresh's writing?",
    reply:
      "WatchIreshStruggle at blog.iresharma.com — same name as the YouTube channel, which tells you everything. Latest: why coding agents need tree-sitter and LSP, the pipeline I built because I couldn't finish Venture Deals, and a 22-second Shorts generator. I process trauma as markdown.",
  },
];