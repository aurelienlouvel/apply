# apps/web — Claude instructions

> For git conventions and monorepo structure, see the root [CLAUDE.md](../../CLAUDE.md).

## Stack

- **Framework** — Next.js 16 (App Router, Server Components)
- **Language** — TypeScript (strict mode)
- **Styling** — Tailwind CSS v4 + shadcn/ui
- **Auth** — NextAuth v4 (LinkedIn OAuth)
- **Database** — File-based JSON → Supabase PostgreSQL (planned)
- **Deployment** — Vercel
- **Package manager** — pnpm

## Code conventions

- Components: PascalCase (`JobCard.tsx`, `AppShell.tsx`)
- Utilities and lib files: camelCase (`formatDate.ts`, `jobs.ts`)
- Named exports only — no default exports
- Types in dedicated files: `src/types/[domain].ts`
- Server Components by default — use `'use client'` only when necessary (interactivity, hooks)

## Project structure

```
src/
├── app/
│   ├── (auth)/         # Authenticated routes: /, /offers, /applications, /processes, /settings
│   ├── (public)/       # Public routes: /login
│   └── api/            # Route handlers: settings, auth, linkedin/profile
├── components/
│   ├── layout/         # AppShell, Sidebar
│   ├── jobs/           # JobCard, JobGrid, JobFilters
│   ├── settings/       # SettingsShell + tabs (Profile, Criteria, Platforms)
│   ├── changelog/      # WhatsNew sheet
│   ├── providers/      # Providers (SessionProvider, LocaleProvider)
│   └── ui/             # shadcn/ui components — do not modify
├── lib/
│   ├── jobs.ts         # Read scraped jobs from .local/output/jobs.json
│   ├── settings.ts     # Read/write user settings from data/settings.json
│   ├── sources.ts      # Platform metadata (labels, colors, cookie keys)
│   ├── i18n.ts         # EN / FR translations
│   └── utils.ts        # Shared helpers
└── types/
    └── jobs.ts         # Job, Source, ScrapedOutput
```
