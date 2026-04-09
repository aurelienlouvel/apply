# Scouty

Personal job hunting app. Centralizes offers from multiple platforms, tracks applications, and helps prepare interviews.

## How it works

Scouty connects to job platforms via your browser cookies — no credentials stored. It aggregates offers across platforms into one place, lets you track every application, and helps you manage interview processes.

Supported platforms: LinkedIn, Welcome to the Jungle, HelloWork, Glassdoor, Jobs that Make Sense, Collective, Contra.

## Features

- **Offers** — Browse and filter aggregated job listings across all platforms
- **Applications** — Track every application with cover letter, date, and status (Pending / Accepted / Rejected)
- **Processes** — Manage interview stages (HR call, Manager interview, Design case, Team fit…)
- **Settings** — Profile, search criteria, platform connections (accessible via profile menu)

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, Server Components) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui (`@base-ui/react`) |
| Auth | NextAuth v4 — LinkedIn OAuth (Supabase Auth planned) |
| Database | File-based JSON → Supabase PostgreSQL (planned) |
| Scraper | Node.js + Playwright (cookie-based, no credentials) |
| i18n | EN / FR |
| Package manager | pnpm workspaces |

## Project structure

```
scouty/
├── web/                        # Next.js app (Vercel)
│   └── src/
│       ├── app/
│       │   ├── (auth)/         # Authenticated: /, /offers, /applications, /processes, /settings
│       │   ├── (public)/       # Public: /login
│       │   └── api/            # settings, auth, linkedin/profile
│       ├── components/
│       │   ├── layout/         # AppShell (collapsible), Sidebar
│       │   ├── jobs/           # JobCard, JobGrid, JobFilters
│       │   ├── settings/       # SettingsShell + tabs (Profile, Criteria, Platforms)
│       │   ├── changelog/      # WhatsNew sheet
│       │   ├── providers/      # Providers (SessionProvider + LocaleProvider)
│       │   └── ui/             # shadcn components — do not modify
│       ├── lib/                # jobs.ts, settings.ts, sources.ts, i18n.ts, changelog.ts
│       └── types/
│           └── jobs.ts         # Job, Source, ScrapedOutput
└── src/                        # Scraper (Playwright)
    ├── index.ts                # Orchestrates scrapers, writes output/jobs.json
    ├── auth.ts                 # One-time cookie login per platform
    └── scrapers/               # linkedin, wttj, hellowork, jobsthatmakesense
```

## Getting started

```bash
pnpm install

# Web app
pnpm web          # dev → http://localhost:3000
pnpm web:build    # production build

# Scraper
pnpm auth         # open browser, log in to each platform, saves cookies
pnpm scrape       # scrape all platforms → output/jobs.json
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
