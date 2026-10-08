import { GAMING_ACCOUNTS } from "@/lib/gaming";

export function GamingLive() {
  return (
    <div className="space-y-4">
      <MarkdownHeading>Accounts</MarkdownHeading>
      <p className="text-[13px] text-dim italic">
        Tracker.gg for the rank. Sony and Valve for the rest of the confession.
      </p>
      <AccountsTable />
    </div>
  );
}

function AccountsTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[14px] leading-6">
        <thead>
          <tr className="bg-[#232323] text-left text-dim">
            <th className="border border-line px-3 py-1.5 font-medium">
              platform
            </th>
            <th className="border border-line px-3 py-1.5 font-medium">id</th>
            <th className="border border-line px-3 py-1.5 font-medium">
              tracker
            </th>
          </tr>
        </thead>
        <tbody>
          {GAMING_ACCOUNTS.map((account) => (
            <tr key={account.platform} className="text-fg">
              <td className="border border-line px-3 py-1.5">{account.platform}</td>
              <td className="border border-line px-3 py-1.5 font-semibold">
                {account.id}
              </td>
              <td className="border border-line px-3 py-1.5">
                <a
                  href={account.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:underline"
                >
                  {account.tracker}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MarkdownHeading({ children }: { children: string }) {
  return (
    <h2 className="border-b border-line pt-4 pb-1.5 text-[18px] font-semibold text-fg">
      {children}
    </h2>
  );
}
