# Kiroku — Roadmap & Status Board

**Last updated:** 2026-07-17  
**Product plan:** [PRODUCT_PLAN.md](./PRODUCT_PLAN.md)  
**Changelog by phase:** [CHANGELOG.md](./CHANGELOG.md)

Use this file as the single source of truth for **what phase we’re in**, **what’s done**, and **what’s next**. Check boxes as work lands. If context/token limits are tight mid-task, **stop and mark the item `blocked` or leave it unchecked** — do not force incomplete work.

---

## Current phase

| Field | Value |
|-------|--------|
| **Active** | **Phase 6 — Deploy** |
| **Previous complete** | Phase 0–5 (through polish) |
| **Next after active** | Soft launch / growth backlog |

---

## Phase status overview

| Phase | Name | Status | Doc |
|-------|------|--------|-----|
| 0 | Product shell & architecture | ✅ Done | [CHANGELOG](./CHANGELOG.md#phase-0) |
| 1 | Neon + Drizzle + Better Auth | ✅ Done (login verified) | [CHANGELOG](./CHANGELOG.md#phase-1) · [detail](./phases/PHASE_01_AUTH.md) |
| 2 | Daily entries & dashboard | ✅ Done | [CHANGELOG](./CHANGELOG.md#phase-2) · [detail](./phases/PHASE_02_ENTRIES.md) |
| 3 | Templates & card builder | ✅ Done | [CHANGELOG](./CHANGELOG.md#phase-3) |
| 4 | Share pipeline (PNG + unlisted links) | ✅ Done | [CHANGELOG](./CHANGELOG.md#phase-4) |
| 5 | Polish, a11y, tests | ✅ Done | [CHANGELOG](./CHANGELOG.md#phase-5) |
| 6 | Deploy (Vercel) + observability | 🟡 **Next** | — |
| 7+ | Growth backlog | ⬜ Backlog | PRODUCT_PLAN |

**Legend:** ✅ Done · 🟡 In progress / planned next · ⬜ Not started · ⛔ Blocked

---

## Master todo list

### Phase 0 — Shell ✅

- [x] Remove blog/demo/content-collections cruft
- [x] Feature-based folder structure
- [x] Kiroku landing + layout branding
- [x] `.env.example`, README structure notes
- [x] Production build green after cleanup

### Phase 1 — Auth & DB ✅

- [x] Neon project `kiroku` connected (`DATABASE_URL`)
- [x] Drizzle client (`neon-http`) + config + scripts
- [x] Better Auth tables: `user`, `session`, `account`, `verification`
- [x] Better Auth + Drizzle adapter + TanStack Start cookies
- [x] Email/password sign-up & sign-in
- [x] Google OAuth provider config
- [x] Login UI + protected `/app` dashboard shell
- [x] Session helper (`getSession` server fn)
- [x] Neon connectivity script (`npm run db:test`)
- [x] User confirmed login works end-to-end

### Design — Impeccable ✅

- [x] Install Impeccable skill / hooks in toolchain
- [x] Write `PRODUCT.md` + `DESIGN.md`
- [x] Replace tropical starter theme with restrained product system
- [x] Restyle landing, login, dashboard, layout chrome
- [x] Document in CHANGELOG

### Phase 2 — Entries & dashboard ✅

Full breakdown: [phases/PHASE_02_ENTRIES.md](./phases/PHASE_02_ENTRIES.md)

- [x] Schema: `entry` table + indexes + Drizzle types
- [x] Zod validation schemas (create / update / date)
- [x] Server functions: list / getByDate / upsert / delete (auth-gated)
- [x] One entry per user per calendar day (unique constraint)
- [x] Dashboard UI: recent list + “today” CTA + empty states
- [x] Entry editor route (new / edit by id)
- [x] Route loaders + `router.invalidate()` after mutations
- [x] Existing CSS field/btn primitives (no new shadcn yet)
- [x] Streak (simple derived count) on dashboard
- [x] Vitest: date/streak helpers
- [x] Migration applied to Neon (`drizzle/0001_*.sql`)
- [ ] Manual E2E: sign in → write today → reload → still there *(verify locally)*

### Phase 3 — Templates & cards ✅

- [x] Template registry + 3 templates (chibi, pixel, minimal)
- [x] Fixed 1080×1350 preview canvas (CSS scale in UI)
- [x] Card builder: entry text + template picker side-by-side
- [x] Persist `templateId` on entry
- [x] Cleanup: unused deps, stubs, dual lockfile, dead CSS

### Phase 4 — Share ✅

- [x] Client PNG export (`modern-screenshot`)
- [x] Download + Web Share API where available
- [x] `share_slug` on entry + public `/s/$slug` (no separate share table)
- [x] OG text meta for unlisted links (`noindex`)
- [ ] Optional later: image upload (Blob/R2) for rich unfurls

### Phase 5 — Polish ✅

- [x] Route pending / error / not-found fallbacks
- [x] Dashboard as template card grid
- [x] Form a11y (labels, aria-busy, focus on cards)
- [x] Template unit tests + existing streak tests
- [x] Inline status messages (no toast lib)

### Phase 6 — Deploy 🟡

- [ ] Vercel project + env vars
- [ ] Custom domain (optional)
- [ ] Analytics / Sentry (optional)

---

## How to maintain this board

1. **Start of a phase:** open that phase’s doc; keep this checklist as the rollup.  
2. **After each PR/session:** tick boxes here + append a short bullet under [CHANGELOG.md](./CHANGELOG.md).  
3. **If work is partial:** leave unchecked; add a note under “Session notes” in the phase doc.  
4. **If limits exhaust mid-task:** stop; write what was done + what’s left in CHANGELOG “In progress”; do not invent completion.  
5. **Do not skip phases** for share/cards before entries exist (Phase 2 is the dependency).

---

## Locked product decisions (v1)

| Decision | Choice |
|----------|--------|
| Entry content | Free text (optional title + body) |
| Auth | Email/password + Google (Better Auth) |
| Sharing | PNG download + private/unlisted links (no public feed) |
| Card size | Portrait **1080×1350** |
| Deploy | Vercel (monolith TanStack Start) |
| DB | Neon + Drizzle |
| Entries rule | **One entry per user per calendar day** |
