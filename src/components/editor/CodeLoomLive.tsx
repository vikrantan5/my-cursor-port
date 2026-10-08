import type { ReactNode } from "react";
import { GitMerge, GitPullRequest, GitPullRequestClosed } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  CODELOOM_RESULTS_URL,
  CODELOOM_RUNS,
  CODELOOM_SELF_PRS,
  formatTokens,
  formatUsd,
  type CodeLoomRun,
} from "@/lib/codeloom";

const VERDICT_CLASS: Record<CodeLoomRun["verdict"], string> = {
  pass: "text-[#89d185]",
  partial: "text-warning",
  fail: "text-[#f48771]",
};

export function CodeLoomLive() {
  const total = CODELOOM_RUNS.reduce((sum, run) => sum + run.costUsd, 0);

  return (
    <div className="space-y-4">
      <MarkdownHeading>Receipts</MarkdownHeading>
      <p className="text-[13px] text-dim italic">
        Real tasks, real repos, real invoices. Copied from the{" "}
        <a
          href={CODELOOM_RESULTS_URL}
          target="_blank"
          rel="noreferrer"
          className="text-accent not-italic hover:underline"
        >
          engine run reports
        </a>
        . Nobody rounded anything in the bot&apos;s favour.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px] leading-6">
          <thead>
            <tr className="bg-[#232323] text-left text-dim">
              <Th>pr</Th>
              <Th>task</Th>
              <Th>run</Th>
              <Th>verify</Th>
            </tr>
          </thead>
          <tbody>
            {CODELOOM_RUNS.map((run) => (
              <tr key={run.prUrl} className="align-top text-fg">
                <Td>
                  <a
                    href={run.prUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 whitespace-nowrap text-accent hover:underline"
                  >
                    <PrIcon state={run.prState} />
                    {run.repo.split("/")[1]}#{run.prNumber}
                  </a>
                  <span className="text-[11px] text-dim">
                    {run.prState} · {run.diff}
                  </span>
                </Td>
                <Td>{run.task}</Td>
                <Td className="font-mono whitespace-nowrap">
                  {formatUsd(run.costUsd)} · {run.elapsedSeconds}s
                  <span className="block text-[11px] text-dim">
                    {run.toolCalls} tools · {formatTokens(run.tokens)} tok
                  </span>
                </Td>
                <Td className={VERDICT_CLASS[run.verdict]}>
                  {run.verify}
                </Td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[#232323] text-dim">
              <td colSpan={2} className="border border-line px-3 py-1.5">
                on its own repo: {CODELOOM_SELF_PRS.opened} PRs ·{" "}
                <span className="text-[#89d185]">{CODELOOM_SELF_PRS.merged} merged</span> ·{" "}
                <span className="text-[#f48771]">{CODELOOM_SELF_PRS.closed} closed</span>
              </td>
              <td colSpan={2} className="border border-line px-3 py-1.5 font-mono">
                {formatUsd(total)} for all three
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function PrIcon({ state }: { state: CodeLoomRun["prState"] }) {
  if (state === "merged") {
    return <GitMerge className="size-3.5 shrink-0 text-[#a371f7]" strokeWidth={1.8} />;
  }
  if (state === "closed") {
    return <GitPullRequestClosed className="size-3.5 shrink-0 text-[#f48771]" strokeWidth={1.8} />;
  }
  return <GitPullRequest className="size-3.5 shrink-0 text-[#89d185]" strokeWidth={1.8} />;
}

function Th({ children }: { children: string }) {
  return <th className="border border-line px-3 py-1.5 font-medium">{children}</th>;
}

function Td({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn("border border-line px-3 py-1.5", className)}>{children}</td>;
}

function MarkdownHeading({ children }: { children: string }) {
  return (
    <h2 className="border-b border-line pt-4 pb-1.5 text-[18px] font-semibold text-fg">
      {children}
    </h2>
  );
}
