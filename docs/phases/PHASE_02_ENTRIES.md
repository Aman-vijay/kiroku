# Phase 2 — Daily entries & dashboard (full plan)

**Status:** ✅ Done (2026-07-17)  
**Depends on:** Phase 1 (auth) ✅  
**Unlocks:** Phase 3 (templates need real entry text)  
**Parent:** [ROADMAP.md](../ROADMAP.md)

---

## 1. Purpose

After login, the product must answer: **“What did I do today?”**

Phase 2 delivers:

1. Persist free-text daily progress in Neon.  
2. One entry per user per calendar day.  
3. A useful authenticated dashboard (list, open today, empty states).  
4. Create / edit / delete flows with validation and auth checks.  
5. A simple streak derived from consecutive days with entries.

**Out of scope for Phase 2:** card templates, PNG export, public share links, mood/metrics, discover feed, AI.

---

## 2. User journey (post-login)

```text
Sign in
  → /app dashboard
      · Greeting + streak
      · “Log today” (or “Edit today” if exists)
      · Recent entries list (date, title/snippet)
  → /app/entries/new  OR  /app/entries/$entryId  OR  /app/entries/by-date/$date
      · Optional title + required body (textarea)
      · Save → back to dashboard with success toast
  → Optional: delete with confirm
```

### UX rules

| Rule | Detail |
|------|--------|
| Free text only | `title` optional, `body` required (min length ≥ 1 after trim) |
| One per day | DB unique `(user_id, entry_date)`; upsert semantics for “today” |
| Timezone | Use **user-local calendar date** from the client for “today”; store as `date` (no timezone shift) |
| Visibility default | `private` (share comes in Phase 4; column reserved) |
| Empty state | First-run copy: “Write your first day.” + primary CTA |

---

## 3. Data model

### Table `entry`

```sql
entry (
  id            text PRIMARY KEY,           -- nanoid or uuid
  user_id       text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  entry_date    date NOT NULL,              -- calendar day, not timestamptz
  title         text,                       -- nullable
  body          text NOT NULL,
  visibility    text NOT NULL DEFAULT 'private'
                  CHECK (visibility IN ('private', 'unlisted')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, entry_date)
);

CREATE INDEX entry_user_date_idx ON entry (user_id, entry_date DESC);
```

### Drizzle location

```text
src/lib/db/schema/entry.ts
src/lib/db/schema/index.ts   # re-export
```

### Why `date` not `timestamptz` for the day key

“July 15” is a **calendar** concept. Storing local YYYY-MM-DD as `date` avoids UTC midnight bugs. Pass `entryDate` as string `YYYY-MM-DD` from the client; validate with Zod.

---

## 4. Validation (Zod)

```text
src/lib/validations/entry.ts
```

| Schema | Rules |
|--------|--------|
| `entryDateSchema` | regex `^\d{4}-\d{2}-\d{2}$` + real date |
| `createEntrySchema` | `entryDate`, `title?` max 120, `body` 1–10_000 chars, `visibility?` |
| `updateEntrySchema` | same fields partial + `id` |
| `listEntriesQuerySchema` | optional `limit` (default 30, max 100), optional `cursor` (date) |

Export inferred types for UI + server. **Validate on server always**; client validation is UX only.

---

## 5. Server layer (best practices)

### Files

```text
src/server/session.ts          # requireSession() shared helper
src/server/entries.ts          # all entry createServerFn
src/features/entries/          # UI only (forms, list, empty)
```

### Auth gate pattern (mandatory)

```ts
// Pseudocode — every mutation/query
const session = await requireSession() // throws redirect or error if null
// Always filter by session.user.id — never trust client-sent userId
```

### Server functions

| Function | Method | Behavior |
|----------|--------|----------|
| `listEntries` | GET | Current user, ordered by `entry_date` desc, limited |
| `getEntryById` | GET | By id **and** userId; 404 if missing/other user |
| `getEntryByDate` | GET | By date + userId |
| `upsertEntry` | POST | Insert or update on `(userId, entryDate)` conflict |
| `deleteEntry` | POST | Delete if owns id |

### Practices

| Practice | Do |
|----------|-----|
| Ownership | Every query includes `eq(entry.userId, session.user.id)` |
| No mass assignment | Only Zod-allowed fields written |
| Errors | Map to safe messages; log server detail |
| Idempotent save | Prefer **upsert** for “save today” to avoid unique races |
| IDs | Generate server-side (`nanoid`) |
| updated_at | Set on every update |
| Thin routes | Routes call server fns / loaders; no raw SQL in components |

### Optional but recommended in Phase 2

- Extract `requireSession()` so Phase 3–4 don’t re-copy `getSession` + redirect.  
- Return **serializable** plain objects (dates as ISO strings).

---

## 6. Client data strategy

### Recommendation

| Concern | Tool |
|---------|------|
| Route initial data | TanStack Router `loader` + `getEntryByDate` / `listEntries` |
| Mutations + cache | **TanStack Query** (`@tanstack/react-query`) if loaders alone get messy |
| Form draft only | Local React state or RHF — **not** Zustand yet (save Zustand for Phase 3 card UI) |
| Forms | React Hook Form + Zod resolver **or** controlled form if keeping deps minimal |

**Pragmatic path for small surface:**

1. Loaders for list + edit page.  
2. `useServerFn` / direct server fn calls on submit.  
3. `router.invalidate()` after save.  

Add full TanStack Query when list invalidation or optimistic UI becomes painful.

### Do **not** in Phase 2

- Put entries in Zustand as source of truth  
- Fetch without auth on public routes  
- Client-only “fake” saves  

---

## 7. Routes & UI structure

### Routes

```text
src/routes/app/
  route.tsx              # optional layout: auth guard for all /app/*
  index.tsx              # dashboard
  entries.index.tsx      # optional full history (or only dashboard)
  entries.new.tsx        # create for a date (default today)
  entries.$entryId.tsx   # edit existing
```

**Auth layout:** move `beforeLoad` session check to `app/route.tsx` so every child is protected once.

### Components (`features/entries`)

```text
features/entries/
  components/
    EntryForm.tsx          # title + body + submit
    EntryList.tsx          # dashboard list rows
    EntryListItem.tsx
    EntryEmptyState.tsx
    StreakBadge.tsx
  lib/
    dates.ts               # todayLocalISO(), formatDisplayDate()
    streak.ts              # pure function from sorted dates
  index.ts
```

### shadcn to add (as needed)

```bash
npx shadcn@latest add button input textarea card label sonner
# optional: alert-dialog for delete, skeleton for loading
```

### Dashboard content blocks

1. **Header:** “Hi, {name}” + streak badge  
2. **Primary CTA:** Log / Edit today  
3. **List:** last N days with link to edit  
4. **Empty:** illustration-free clean empty state  

---

## 8. Streak algorithm (pure, testable)

```text
Input: sorted unique entry_date strings (YYYY-MM-DD), newest first or sort inside
Today = client local today (or pass as arg for tests)

streak = 0
cursor = today
if no entry on today, cursor = yesterday  // optional: allow "still on streak if missed today not yet logged"
// v1 simpler rule:
// Count consecutive days ending at the latest entry date that chains back day-by-day.
// Display "0" if never logged.
```

**v1 product rule (lock this):**

- Streak = number of consecutive calendar days with an entry, ending on **the most recent entry date** (not necessarily today).  
- If user skips a day, streak resets at the gap.  
- Pure function in `features/entries/lib/streak.ts` + Vitest.

---

## 9. Implementation order (execute in this sequence)

Do **not** jump to UI before schema + server are solid.

| Step | Task | Exit check |
|------|------|------------|
| 2.1 | `entry` Drizzle schema + export | types compile |
| 2.2 | `drizzle-kit generate` + apply to Neon (`push` or SQL) | tables visible in Neon |
| 2.3 | Zod schemas + unit tests | `npm run test` green |
| 2.4 | `requireSession` helper | used by at least one fn |
| 2.5 | Server fns: list, get, upsert, delete | manual via temporary log or script |
| 2.6 | shadcn primitives | imports work |
| 2.7 | `EntryForm` + new/edit routes | save persists after reload |
| 2.8 | Dashboard list + streak + empty | happy path E2E manual |
| 2.9 | Delete + error toasts | edge cases ok |
| 2.10 | CHANGELOG + ROADMAP checkboxes | docs match reality |

If context limits hit mid-sequence: complete the **current step**, update CHANGELOG “In progress”, stop. Prefer a working 2.1–2.5 over a half-broken UI.

---

## 10. File checklist (expected end state)

```text
src/lib/db/schema/entry.ts
src/lib/validations/entry.ts
src/server/session.ts
src/server/entries.ts
src/features/entries/components/EntryForm.tsx
src/features/entries/components/EntryList.tsx
src/features/entries/components/EntryEmptyState.tsx
src/features/entries/components/StreakBadge.tsx
src/features/entries/lib/dates.ts
src/features/entries/lib/streak.ts
src/features/entries/index.ts
src/routes/app/route.tsx
src/routes/app/index.tsx                 # dashboard
src/routes/app/entries.new.tsx
src/routes/app/entries.$entryId.tsx
src/features/entries/lib/streak.test.ts  # or tests/ under vitest
drizzle/0001_*.sql                       # migration for entry
```

---

## 11. Security checklist

- [ ] No entry readable/writable without session  
- [ ] No IDOR: cannot edit another user’s `entryId`  
- [ ] `userId` never taken from request body for ownership  
- [ ] Zod max lengths on body/title (DoS / abuse)  
- [ ] CSRF: rely on Better Auth cookie + same-site defaults; server fns only from app origin  
- [ ] Don’t log full entry bodies in production logs  

---

## 12. Testing plan

| Layer | What |
|-------|------|
| Unit | `streak.ts`, `dates.ts`, Zod parse success/fail |
| Manual | Sign in → create today → refresh → edit → delete → unique day upsert |
| SQL | Neon table has row with correct `user_id` + `entry_date` |

Automated HTTP e2e optional later (Phase 5).

---

## 13. Acceptance criteria (Phase 2 done)

1. Authenticated user can create a free-text entry for today.  
2. Reload shows the same entry (Neon persistence).  
3. Second save for same day **updates** (no duplicate rows).  
4. User can open an older entry and edit body/title.  
5. User can delete own entry.  
6. Dashboard lists entries; empty state when none.  
7. Streak number appears and matches algorithm for sample data.  
8. Unauthenticated access to `/app/*` redirects to `/login`.  
9. ROADMAP Phase 2 boxes checked; CHANGELOG Phase 2 filled.  

---

## 14. Explicit non-goals (resist scope creep)

- Template picker / card preview  
- Image export / share URLs  
- Tags, mood, hours, rich markdown editor  
- Multi-entry per day  
- Public feed  
- Offline sync  

Those belong to Phase 3+.

---

## 15. Suggested commit / PR slice (if you split work)

| PR | Scope |
|----|--------|
| PR-A | Schema + migration + Zod + streak pure fns |
| PR-B | Server functions + requireSession |
| PR-C | Dashboard + form UI + routes |

Each PR should leave `main` buildable.

---

## 16. Session notes (fill while implementing)

| Date | Completed | Next | Blockers |
|------|-----------|------|----------|
| 2026-07-17 | 2.1–2.10 schema, server, UI, migrate, docs | Manual E2E in browser | — |

---

## 17. Ready to implement?

When you say **“implement Phase 2”**, execute steps **2.1 → 2.10** in order, tick [ROADMAP.md](../ROADMAP.md), and append to [CHANGELOG.md](../CHANGELOG.md).

If limits are low: stop after the last completed step and document partial progress — do not half-apply a migration without noting it.
