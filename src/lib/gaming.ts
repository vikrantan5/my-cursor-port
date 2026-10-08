export type GamingAccount = {
  platform: string;
  id: string;
  tracker: string;
  href: string;
};

export const GAMING_ACCOUNTS: GamingAccount[] = [
  {
    platform: "valorant",
    id: "iresharma#noob",
    tracker: "tracker.gg",
    href: "https://tracker.gg/valorant/profile/riot/iresharma%23noob/overview",
  },
  {
    platform: "playstation",
    id: "iresharma",
    tracker: "psnprofiles",
    href: "https://psnprofiles.com/iresharma",
  },
  {
    platform: "steam",
    id: "ireshrma",
    tracker: "steamcommunity",
    href: "https://steamcommunity.com/id/ireshrma",
  },
];

export const GAMING_TRACKERS: Array<{ label: string; href: string }> = [
  {
    label: "tracker.gg/valorant — iresharma#noob",
    href: "https://tracker.gg/valorant/profile/riot/iresharma%23noob/overview",
  },
  {
    label: "blitz.gg/valorant — same account, different overlay",
    href: "https://blitz.gg/valorant/profile/iresharma-noob",
  },
  {
    label: "psnprofiles.com/iresharma — trophies, allegedly",
    href: "https://psnprofiles.com/iresharma",
  },
  {
    label: "steamcommunity.com/id/ireshrma — the Valve half",
    href: "https://steamcommunity.com/id/ireshrma",
  },
];
