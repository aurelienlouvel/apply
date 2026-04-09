export type ItemType = 'new' | 'fix' | 'improvement';

export interface ChangelogItem {
  type: ItemType;
  text: string;
}

export interface ChangelogVersion {
  version: string;
  date: string;
  items: ChangelogItem[];
}

export const CURRENT_VERSION = '0.2.0';

export const CHANGELOG: ChangelogVersion[] = [
  {
    version: '0.2.0',
    date: '2026-04-09',
    items: [
      { type: 'new', text: 'Sign in with LinkedIn (OAuth 2.0) — name, photo & email auto-filled' },
      { type: 'new', text: 'Language switcher — English & Français' },
      { type: 'new', text: 'Sidebar profile section with quick-action menu' },
      { type: 'new', text: "What's New changelog panel" },
      { type: 'improvement', text: 'Profile tab redesigned with LinkedIn avatar & sync button' },
      { type: 'improvement', text: 'All UI now in English with French option' },
    ],
  },
  {
    version: '0.1.0',
    date: '2026-04-01',
    items: [
      { type: 'new', text: 'Job listings from WTTJ, LinkedIn, HelloWork, Jobs that Make Sense' },
      { type: 'new', text: 'Filter by source and contract type' },
      { type: 'new', text: 'Settings page — profile, search criteria, platform connections' },
      { type: 'new', text: 'Playwright cookie-based scraper with multi-query support' },
    ],
  },
];
