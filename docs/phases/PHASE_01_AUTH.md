# Phase 1 — Auth & database (complete)

**Status:** ✅ Done  
**Parent:** [ROADMAP.md](../ROADMAP.md) · [CHANGELOG](../CHANGELOG.md#phase-1)

## Outcome

Users can register/sign in (email or Google). Sessions live in Neon via Better Auth + Drizzle. `/app` is protected.

## Architecture (as shipped)

```text
Browser
  → authClient (better-auth/react)
  → POST/GET /api/auth/* (TanStack route handler)
  → betterAuth({ database: drizzleAdapter(db) })
  → Drizzle neon-http
  → Neon Postgres
```

Server session reads use `getSession` (`createServerFn` + request cookies).

## Best practices already applied

| Practice | How |
|----------|-----|
| Secrets only in env | `.env.local` never committed; `.env.example` has keys only |
| Auth tables owned by app | Better Auth schema in Drizzle, not external IdP-only |
| Cookie plugin for Start | `tanstackStartCookies()` last in plugins |
| Server-only DB client | `db` imported from server/auth paths, not client components |
| Route protection | `beforeLoad` + redirect on `/app` |
| Thin routes | Login/dashboard UI in routes; session logic in `server/` + `lib/` |

## Ops cheatsheet

```bash
npm run db:test      # Neon SELECT 1
npm run db:push      # push schema (needs TTY for confirm)
npm run db:generate  # SQL migrations under drizzle/
npm run db:studio    # browse tables
npm run dev          # app + auth
```

## Handoff to Phase 2

- User id for FKs: `session.user.id` (text)  
- Do not put entry CRUD in `auth.ts` — new `server/entries.ts` + `features/entries/*`  
- Reuse `getSession` (or extract `requireSession`) for every mutation  
