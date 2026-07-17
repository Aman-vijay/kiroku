# Kiroku — Phase Changelog

Record **what actually shipped** per phase so the repo stays understandable months later.  
Format: date · summary · key paths · verify steps.

---

## Phase 0 — Product shell & architecture

**Status:** ✅ Done  
**When:** 2026-07-15  

### Goals

Turn the TanStack starter into a clean Kiroku app shell with a maintainable folder layout.

### Changes made

| Area | What changed |
|------|----------------|
| Cleanup | Removed blog content-collections, MDX demos, about/blog/rss/demo routes, TanStack logos |
| Structure | Introduced `features/*`, `components/layout`, `lib/db`, `server`, `stores`, `types`, `hooks` |
| Branding | Landing page, Header/Footer, constants → **Kiroku** |
| Config | Dropped content-collections from Vite/package; added `.env.example`; README rewritten |
| Routes | Kept thin: `/`, `/login`, `/app`, `/api/auth/$` |

### Key paths

```text
src/components/layout/*
src/features/{auth,entries,templates,share}/
src/lib/constants.ts
src/routes/index.tsx
docs/PRODUCT_PLAN.md
```

### Verify

- `npm run build` succeeds  
- Landing loads without demo/blog nav  

---

## Phase 1 — Neon + Drizzle + Better Auth

**Status:** ✅ Done (user confirmed login works)  
**When:** 2026-07-15  

### Goals

Persist users/sessions in Neon; email + Google auth; protected app shell.

### Changes made

| Area | What changed |
|------|----------------|
| DB | `@neondatabase/serverless` + `drizzle-orm` + `drizzle-kit` |
| Schema | Better Auth tables: `user`, `session`, `account`, `verification` |
| Neon | Project `kiroku` (id `summer-flower-30879304`); tables applied |
| Auth server | `betterAuth` + `drizzleAdapter` + Google social + `tanstackStartCookies` |
| Auth client | `authClient` sign-in/up, Google social |
| API | Existing `/api/auth/$` handler |
| Session | `getSession` server function |
| UI | Real `/login` form; `/app` redirects if unauthenticated |
| Scripts | `db:push`, `db:generate`, `db:migrate`, `db:studio`, `db:test` |
| Migrations | `drizzle/0000_*.sql` generated for reproducibility |

### Key paths

```text
src/lib/db/index.ts
src/lib/db/schema/auth.ts
src/lib/auth.ts
src/lib/auth-client.ts
src/server/auth.ts
src/routes/login.tsx
src/routes/app/index.tsx
drizzle.config.ts
scripts/test-neon.mjs
drizzle/
```

### Env required

```text
DATABASE_URL
BETTER_AUTH_SECRET
BETTER_AUTH_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

### Verify

- `npm run db:test` → `NEON_OK`  
- Sign up / sign in / Google → lands on `/app`  
- Sign out clears session; `/app` redirects to `/login`  

### Not in this phase (intentionally)

- Entry domain tables  
- TanStack Query / Zustand for product data  
- Card templates / share export  

---

## Design system — Impeccable

**Status:** ✅ Installed & applied  
**When:** 2026-07-17  

### Changes made

| Area | What changed |
|------|----------------|
| Install | `npx impeccable install` (skill v3.9.1); live config under `.impeccable/` |
| Context | Root `PRODUCT.md` + `DESIGN.md` (Stitch format) |
| Tokens | Replaced tropical lagoon/cream theme with restrained indigo + coral on pure white |
| Type | DM Sans (single family, product register) |
| Chrome | Header, footer, auth header, theme toggle restyled |
| Pages | Landing, login, dashboard rewritten to new components |
| CSS | `btn-*`, `field-*`, `panel`, `segmented`, reduced-motion support |

### Key paths

```text
PRODUCT.md
DESIGN.md
.impeccable/live/config.json
src/styles.css
src/routes/index.tsx
src/routes/login.tsx
src/routes/app/index.tsx
src/components/layout/*
```

### Verify

- `npm run build` succeeds  
- Visual: pure white bg, indigo primary, no decorative grid / glass cards  

---

## Phase 2 — Daily entries & dashboard

**Status:** ✅ Done  
**When:** 2026-07-17  
**Spec:** [phases/PHASE_02_ENTRIES.md](./phases/PHASE_02_ENTRIES.md)

### Goals

Authenticated users create/edit one free-text entry per day; dashboard lists history and streak.

### Changes made

| Area | What changed |
|------|----------------|
| Schema | `entry` table: id, user_id, entry_date, title, body, visibility, timestamps; unique `(user_id, entry_date)` |
| Migration | `drizzle/0001_elite_shatterstar.sql` applied to Neon |
| Validation | Zod: create / update / list / date schemas |
| Server | `requireSession`; list / getById / getByDate / upsert / update / delete |
| UI | Dashboard loader, EntryForm, list, empty state, streak badge |
| Routes | `/app` layout guard; `/app/entries/new`; `/app/entries/$entryId` |
| Tests | Vitest: streak + date helpers |

### Key paths

```text
src/lib/db/schema/entry.ts
src/lib/validations/entry.ts
src/server/session.ts
src/server/entries.ts
src/features/entries/*
src/routes/app/route.tsx
src/routes/app/index.tsx
src/routes/app/entries.new.tsx
src/routes/app/entries.$entryId.tsx
drizzle/0001_elite_shatterstar.sql
```

### Verify

- `npm run test` green  
- `npm run build` green  
- Sign in → Log today → save → reload → entry still there  
- Second save same day updates (no duplicate)  
- Edit / delete own entry  

### Not in this phase (intentionally)

- Templates / card builder  
- PNG export / share links  
- TanStack Query / Zustand  
- Sonner toasts (inline errors only)

---

## Cleanup — over-engineering cut

**Status:** ✅ Done  
**When:** 2026-07-17  

### Cut

- Dual lockfile: removed `pnpm-lock.yaml` (npm only)
- Deps: `@better-auth/infra`, ssr-query, cva, lucide, clsx, tailwind-merge, tw-animate, testing-library, tsx
- Stubs: share/templates features, stores, hooks, types, ui/.gitkeep
- `cn()` util; AuthHeader moved under layout
- Dead barrels, drizzle relations, redundant index, CSS shadcn/legacy fat

---

## Phase 3 — Templates & card builder

**Status:** ✅ Done  
**When:** 2026-07-17  

### Changes made

| Area | What changed |
|------|----------------|
| Schema | `entry.template_id` default `minimal-ink` |
| Migration | `drizzle/0002_glossy_talisman.sql` applied |
| Templates | Registry + Minimal / Chibi / Pixel React cards |
| UI | Side-by-side form + live 1080×1350 scaled preview |
| Persist | upsert/update save `templateId` |

### Key paths

```text
src/lib/templates.ts
src/features/entries/components/cards/*
src/features/entries/components/CardPreview.tsx
src/features/entries/components/TemplatePicker.tsx
src/features/entries/components/EntryForm.tsx
drizzle/0002_glossy_talisman.sql
```

### Verify

- Open new/edit entry → switch templates → preview updates  
- Save → reload → same template selected  

### Not in this phase

- PNG export / Web Share  
- Motion library  
- Zustand  

---

## Phase 4 — Share pipeline

**Status:** ✅ Done  
**When:** 2026-07-17  

### Changes made

| Area | What changed |
|------|----------------|
| Dep | `modern-screenshot` for client PNG |
| Export | Download PNG + Web Share (file) with download fallback |
| Schema | `entry.share_slug` unique nullable |
| Server | `enableEntryShare` / `disableEntryShare` / `getPublicEntry` |
| UI | `ShareActions` on entry form (saved entries only for links) |
| Route | Public `/s/$slug` with OG title/description, `noindex` |

### Key paths

```text
src/features/entries/lib/export-card.ts
src/features/entries/components/ShareActions.tsx
src/server/entries.ts
src/routes/s.$slug.tsx
drizzle/0003_sticky_talon.sql
```

### Verify

- Edit entry → Download PNG  
- Get unlisted link → open `/s/{slug}` logged out  
- Unlist → link 404s  

### Not in this phase

- Object storage / OG image URL  
- Separate `entry_share` table

---

## Phase 5 — Polish & tests

**Status:** ✅ Done  
**When:** 2026-07-17  

### Changes made

| Area | What changed |
|------|----------------|
| Dashboard | Entries as template card grid (not text list) |
| Loading | `pendingComponent` on dashboard + router defaults |
| Errors | Default error + not-found components |
| a11y | Form labels/aria, card link labels, focus rings |
| Tests | `templates.test.ts` + streak tests |

### Key paths

```text
src/features/entries/components/EntryCardGrid.tsx
src/routes/app/index.tsx
src/components/RouteFallback.tsx
src/router.tsx
src/lib/templates.test.ts
```

---

## Phase 6 — Deploy

**Status:** 🟡 Next  

