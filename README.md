# Apply

Personal job hunting app. Aggregates offers from multiple platforms, tracks applications, and helps manage interview processes — all in one place.

## How it works

Apply uses your existing browser session to scrape job platforms — no credentials stored, no API keys needed. The scraper saves results locally, and the web app reads them to display a unified feed you can filter, save, and act on.

```
pnpm scrape  →  .local/output/jobs.json  →  web app (localhost:3000)
```

Supported platforms: LinkedIn, Welcome to the Jungle, HelloWork, Jobs that Make Sense.

## Features

- **Offers** — Browse and filter aggregated job listings across all platforms
- **Applications** — Track every application with cover letter, date, and status (Pending / Accepted / Rejected)
- **Processes** — Manage interview stages (HR call, Manager interview, Design case, Team fit…)
- **Settings** — Profile, search criteria, platform connections

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, Server Components) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Auth | NextAuth v4 — LinkedIn OAuth |
| Database | File-based JSON → Supabase PostgreSQL (planned) |
| Scraper | Node.js + Playwright (cookie-based) |
| i18n | EN / FR |
| Package manager | pnpm workspaces |

## Project structure

```
scouty/
├── apps/
│   └── web/                        # Next.js app
│       └── src/
│           ├── app/
│           │   ├── (auth)/         # Authenticated routes: /, /offers, /applications, /processes, /settings
│           │   ├── (public)/       # Public routes: /login
│           │   └── api/            # settings, auth, linkedin/profile
│           ├── components/
│           │   ├── layout/         # AppShell, Sidebar
│           │   ├── jobs/           # JobCard, JobGrid, JobFilters
│           │   ├── settings/       # SettingsShell + tabs (Profile, Criteria, Platforms)
│           │   ├── changelog/      # WhatsNew sheet
│           │   └── ui/             # shadcn/ui components — do not modify
│           ├── lib/                # jobs.ts, settings.ts, sources.ts, i18n.ts
│           └── types/
│               └── jobs.ts         # Job, Source, ScrapedOutput
└── packages/
    └── scraper/                    # Playwright scraper
        ├── src/
        │   ├── index.ts            # Orchestrates all scrapers → .local/output/jobs.json
        │   ├── auth.ts             # One-time cookie login per platform
        │   ├── config.ts           # Search URLs per platform
        │   ├── types.ts            # Job, ScrapedOutput
        │   └── scrapers/           # linkedin, wttj, hellowork, jobsthatmakesense
        └── dev/                    # Dev/debug scripts (not run in production)
            ├── scrape-wttj.ts      # Test WTTJ scraper in isolation
            ├── debug-wttj.ts       # Step-by-step selector debugger
            └── debug-wttj-card.ts  # Dump raw card HTML
```

## Getting started

```bash
pnpm install
```

Copy the environment file and fill in your values:

```bash
cp apps/web/.env.example apps/web/.env.local
```

### Scraper

```bash
# Step 1 — log in to each platform (opens a browser window, saves cookies locally)
pnpm auth

# Step 2 — scrape all platforms → .local/output/jobs.json
pnpm scrape

# Scrape a single platform
pnpm scrape:wttj
```

### Web app

```bash
pnpm web          # dev → http://localhost:3000
pnpm web:build    # production build
```

## Roadmap

### In progress
- [ ] Supabase Auth — LinkedIn OAuth via Supabase OIDC
- [ ] Supabase PostgreSQL — user profiles, search criteria, applications

### Pages
- [ ] **Offers** — rework job listing page (filters, sorting, card design)
- [ ] **Applications** — list of applied jobs with cover letter, date, status
- [ ] **Processes** — interview pipeline (HR call, Manager, Design case, Team fit…)
- [ ] **Home** — dashboard with stats and activity overview

### Integrations
- [ ] Electron desktop app (mac-first, like Claude / amie)
- [ ] Claude — writing style settings, cover letter generation
- [ ] Gmail — auto-detect application replies, update status automatically
- [ ] Notion — sync applications to a Notion database

### Settings
- [ ] Writing style configuration
- [ ] Claude API key management
- [ ] Notion / Gmail OAuth connections
