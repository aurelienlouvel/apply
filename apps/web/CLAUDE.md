# Stack technique
- Framework : Next.js 16 (App Router)
- Langage : TypeScript (strict mode)
- Styling : Tailwind CSS v4 + shadcn/ui
- Base de données : Supabase (PostgreSQL)
- Auth : Supabase Auth
- Déploiement : Vercel
- Package manager : pnpm

# Conventions de code
- Nommage des composants : PascalCase (ex: UserProfile.tsx)
- Nommage des fichiers utilitaires : camelCase (ex: formatDate.ts)
- Toujours utiliser les Server Components par défaut
- 'use client' uniquement quand c'est nécessaire (interactivité, hooks)
- Exports nommés (pas de default export)
- Types dans des fichiers séparés : src/types/[domaine].ts

# Structure du projet
- src/app/(auth)/ : pages authentifiées
- src/app/(public)/ : pages publiques
- src/components/ : Composants React réutilisables
- src/components/ui/ : Composants shadcn/ui (NE PAS MODIFIER)
- src/lib/ : Utilitaires et helpers
- src/lib/supabase/ : Client et requêtes Supabase
- src/types/ : Types TypeScript
- supabase/migrations/ : Migrations SQL
