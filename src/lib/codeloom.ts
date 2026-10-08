// Numbers from the engine run reports on codeloom.iresharma.com/engine/results
// and from the PRs themselves. Snapshot: 2026-09-28.

export type CodeLoomRun = {
  repo: string;
  task: string;
  prUrl: string;
  prNumber: number;
  prState: "open" | "merged" | "closed";
  costUsd: number;
  elapsedSeconds: number;
  toolCalls: number;
  tokens: number;
  diff: string;
  verify: string;
  verdict: "pass" | "partial" | "fail";
};

export const CODELOOM_RESULTS_URL = "https://codeloom.iresharma.com/engine/results";

export const CODELOOM_RUNS: CodeLoomRun[] = [
  {
    repo: "iresharma/tracer",
    task: "Authentication in front of the collector",
    prUrl: "https://github.com/iresharma/tracer/pull/7",
    prNumber: 7,
    prState: "open",
    costUsd: 1.41,
    elapsedSeconds: 126,
    toolCalls: 142,
    tokens: 2_897_790,
    diff: "+654 −19",
    verify: "builds, tests pass",
    verdict: "pass",
  },
  {
    repo: "iresharma/reach-auth-proxy",
    task: "Redis caching for the kanban endpoints",
    prUrl: "https://github.com/iresharma/reach-auth-proxy/pull/20",
    prNumber: 20,
    prState: "open",
    costUsd: 0.79,
    elapsedSeconds: 85,
    toolCalls: 64,
    tokens: 1_265_198,
    diff: "+20 −117",
    verify: "builds, repo has no tests",
    verdict: "partial",
  },
  {
    repo: "iresharma/codeloom.engine",
    task: "Harden its own HTTP tool, prototype a binary",
    prUrl: "https://github.com/iresharma/codeloom.engine/pull/44",
    prNumber: 44,
    prState: "closed",
    costUsd: 3.67,
    elapsedSeconds: 197,
    toolCalls: 248,
    tokens: 7_944_517,
    diff: "+915 −30",
    verify: "language: unknown — did not recognise itself",
    verdict: "fail",
  },
];

export const CODELOOM_SELF_PRS = { opened: 28, merged: 18, closed: 10 };

export function formatUsd(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function formatTokens(value: number): string {
  return `${(value / 1_000_000).toFixed(1)}M`;
}

export function codeloomReceiptsText(): string {
  const runs = CODELOOM_RUNS.map(
    (run) =>
      `- ${run.repo} PR #${run.prNumber} (${run.prState}): ${run.task}. ${formatUsd(run.costUsd)}, ${run.elapsedSeconds}s, ${run.toolCalls} tool calls, ${formatTokens(run.tokens)} tokens, ${run.diff}, verify: ${run.verify}.`,
  );
  return [
    "CodeLoom engine PR receipts:",
    ...runs,
    `On its own repo: ${CODELOOM_SELF_PRS.opened} engine/* PRs, ${CODELOOM_SELF_PRS.merged} merged, ${CODELOOM_SELF_PRS.closed} closed.`,
  ].join("\n");
}
