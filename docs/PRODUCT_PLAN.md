# Kiroku — Daily Progress Sharing App

**Product vision:** Let people log a day’s progress, turn it into a beautiful themed card (chibi anime, 2D pixel, and more), save it, and share it on social media.

**Codename / repo:** `kiroku` (記録 — “record / log”)  
**Status:** Initial TanStack Start scaffold  
**Last updated:** 2026-07-15

---

## 1. Current project analysis

### What you already have (solid foundation)

| Area | Status | Notes |
|------|--------|--------|
| **Framework** | ✅ TanStack Start + React 19 + Vite 7 | Full-stack (SSR, server functions, API routes) |
| **Routing** | ✅ TanStack Router file-based | `src/routes/`, intent preload, scroll restoration |
| **Styling** | ✅ Tailwind CSS v4 + shadcn (New York / zinc) | `components.json` ready; add components via CLI |
| **Utils** | ✅ `clsx`, `tailwind-merge`, `cva`, Lucide | `src/lib/utils.ts` pattern in place |
| **Auth** | ⚠️ Better Auth scaffold only | Email/password enabled; **no DB adapter yet** (stateless) |
| **Validation** | ✅ Zod v4 in devDependencies | Move to `dependencies` when used in app code |
| **Content** | Demo blog via content-collections | Safe to keep for marketing later or delete |
| **Tests** | Vitest wired | No product tests yet |
| **Theme** | Light / dark / auto | Root script + `ThemeToggle` |

### Gaps (must build)

- No database, ORM, or migrations  
- Auth not persisted (no user table / sessions in DB)  
- No domain models: entries, templates, shares  
- No card builder, templates, or image export  
- No public share URLs / Open Graph previews  
- Missing product libs: Zustand, Motion, TanStack Query, form libs, image export  
- Demo routes/pages still dominate UX (`about`, blog demos, better-auth demo)

### Architecture insight (important)

**You do not need a separate Render backend** for v1.

TanStack Start already runs server code via:

- `createServerFn` (mutations / queries)
- API route handlers under `src/routes/api/`

Neon holds data; the Start app is the API. Split to a dedicated Node service only if you later need long-running jobs, heavy image pipelines, or multi-service scale.

---

## 2. Recommended stack (researched & justified)

### Core platform

| Layer | Choice | Why |
|-------|--------|-----|
| App | **TanStack Start** (keep) | Full-stack React, type-safe routes, official Neon partnership |
| Language | **TypeScript** (strict) | End-to-end types with Drizzle + Zod + Router |
| DB | **Neon** (serverless Postgres) | TanStack-recommended partner; branching for previews; free tier |
| ORM | **Drizzle ORM + drizzle-kit** | Lightweight, excellent Neon drivers, first-class Better Auth adapter |
| Auth | **Better Auth** (keep & harden) | Already scaffolded; official TanStack Start cookies plugin; owns users in your Neon DB; no per-MAU bill like Clerk |
| Client server-state | **TanStack Query** (+ existing SSR query package) | Cache, mutations, optimistic UI for entries |
| Client UI-state | **Zustand** | Card draft, template picker, share modal — not server data |
| Forms | **React Hook Form + Zod** (`@hookform/resolvers`) | Fast entry forms with typed validation |
| UI kit | **shadcn/ui + Tailwind v4** | Accessible primitives; you already configured New York / zinc |
| Animation | **Motion** (`motion` package) | Template transitions, share success, micro-interactions |
| Icons | **Lucide** (keep) | Matches shadcn |

### Auth decision: Better Auth vs Clerk vs Neon Auth

| | Better Auth | Clerk | Neon Auth |
|--|-------------|-------|-----------|
| Cost at scale | Free / self-hosted | Usage-based | Tied to Neon ecosystem |
| Data ownership | Users live in **your** Neon DB | External IdP | Varies |
| TanStack Start | Official integration + cookies plugin | Works; more glue | Less common path |
| Fit for Kiroku | **Best default** | Great if you want zero auth UX work and will pay | Overlap with Better Auth + Neon |

**Recommendation:** Stay on **Better Auth + Neon + Drizzle**. Add Google/GitHub OAuth when needed. Revisit Clerk only if you want managed orgs, advanced MFA UI, or enterprise SSO quickly.

### Card → image / social share

| Need | Library | Role |
|------|---------|------|
| Client PNG/JPEG export of the card | **`modern-screenshot`** (primary) or `html-to-image` | High-quality DOM snapshot for download / Web Share |
| Public link previews (Twitter/X, Discord, iMessage) | **Satori + `@resvg/resvg-js`** *or* static OG from stored image | Server-generated Open Graph images |
| Optional later polish | **Konva / react-konva** | Canvas editor if templates become free-form |

**Flow (v1):**

1. User fills entry → picks template → live React card preview.  
2. On “Export / Share”, client renders card DOM → PNG via `modern-screenshot`.  
3. Upload PNG to object storage (see below) **or** keep client-only download for MVP.  
4. Public page `/s/:slug` serves HTML + OG tags pointing at the image URL.

### Storage for share images

| Option | When |
|--------|------|
| **Cloudflare R2** or **AWS S3** (+ public CDN URL) | Production shares & OG |
| **Uploadthing** or **Vercel Blob** | Fastest DX if deploy target matches |
| Client-only download (no upload) | **MVP** — share via device download + Web Share API |

**Recommendation:** MVP = client export + optional Web Share API. Phase 4 = R2/S3 (or Vercel Blob) + public share links.

### Deployment (no separate backend required)

TanStack Start official hosts: **Cloudflare, Netlify, Railway** (plus strong **Vercel** support).

| Platform | Recommendation |
|----------|----------------|
| **Vercel** | Best DX + full Node APIs if you use heavy npm packages (e.g. resvg) |
| **Netlify** | Official partner; fine for Start apps; slightly weaker cold starts historically |
| **Cloudflare** | Best edge/cost; watch Node API compatibility for image libs |
| **Render (separate API)** | Skip for v1; only if you split services later |

**Recommendation:** Deploy the **whole** Start app on **Vercel** (or **Netlify** if you prefer). Neon stays external. No Render microservice until you need it.

### Libraries to add (phased)

```text
# Phase 1 — data & auth
drizzle-orm drizzle-kit @neondatabase/serverless
@better-auth/drizzle-adapter   # or current Better Auth drizzle adapter package
dotenv

# Phase 1–2 — app data layer
@tanstack/react-query
zustand
react-hook-form @hookform/resolvers
# zod already present — move to dependencies

# Phase 3 — UX polish
motion
date-fns   # or dayjs — entry calendars & “today”
nanoid     # public share slugs

# Phase 4 — cards & share
modern-screenshot
# later: satori @resvg/resvg-js  OR  store uploaded PNG for OG
```

### Libraries to avoid (for now)

- Redux / Jotai (Zustand is enough)  
- Prisma (heavier; Drizzle fits serverless Neon better here)  
- Separate Express/Fastify on Render  
- html2canvas (older; prefer modern-screenshot / html-to-image)  
- Clerk *and* Better Auth together (pick one)

---

## 3. Product model

### Core user journey

```text
Sign up / log in
  → Dashboard (streak, recent entries)
  → “Log today” form (optional title + free-text body)
  → Template gallery (chibi, pixel, minimal, …)
  → Live card preview (edit text + template + accent color)
  → Save entry
  → Export image / Share link / Native share
  → Optional: public page for the day
```

### Domain entities

```text
User          (Better Auth + profile fields: displayName, avatar, handle)
Entry         (userId, date, title?, body, visibility: private|unlisted)
Template      (slug, name, style family, config JSON, preview asset, isPremium?)
EntryShare    (entryId, templateId, slug, imageUrl?, themeOverrides JSON)
Streak        (derived or cached: consecutive days with entries)
```

### Template system (design for extensibility)

Each template is a **React component** registered in a catalog:

```ts
type TemplateId = 'chibi-day' | 'pixel-quest' | 'minimal-ink' | 'neon-grid' | ...

type TemplateProps = {
  title: string
  date: string
  mood?: string
  wins: string[]
  note?: string
  accent?: string
  username?: string
}
```

- Styles: pure Tailwind + CSS (pixel fonts, chibi illustrations as SVG/PNG assets).  
- Version templates with `version` so old shares don’t break.  
- v1: 3–5 templates hard-coded. Later: JSON-driven layout + custom themes.

### Visibility

- `private` — only owner  
- `unlisted` — anyone with link  
- `public` — optional discover feed (phase 5+)

---

## 4. Data schema (Neon + Drizzle sketch)

```text
user              — Better Auth core
session, account, verification — Better Auth tables

profile           — user_id PK/FK, handle unique, display_name, bio, avatar_url
entry             — id, user_id, entry_date (date), title nullable, body text,
                    visibility ('private'|'unlisted'), created_at, updated_at
                    UNIQUE(user_id, entry_date)  -- one primary entry per day (v1)
template          — id, slug unique, name, family, config jsonb, is_active
entry_share       — id, entry_id, template_id, public_slug unique,
                    image_url, overrides jsonb, created_at
```

Indexes: `(user_id, entry_date desc)`, `entry_share.public_slug`.

---

## 5. App structure (target)

```text
src/
  components/
    ui/                 # shadcn
    cards/              # template components
    entry/              # forms, lists
    share/              # export modal, public card
    layout/
  features/
    auth/
    entries/
    templates/
    share/
  lib/
    auth.ts
    auth-client.ts
    db/
      index.ts
      schema.ts
      migrations/
    validations/        # zod schemas
    stores/             # zustand
  routes/
    index.tsx           # marketing / landing
    login.tsx
    signup.tsx
    app/
      route.tsx         # auth layout guard
      index.tsx         # dashboard
      entries.index.tsx
      entries.new.tsx
      entries.$id.tsx
      templates.tsx
    s.$slug.tsx         # public share page
    api/auth/$.ts
    api/og/$.ts         # optional OG image
  styles.css
```

Server mutations live next to features or under `src/server/` as `createServerFn` modules.

---

## 6. Phased execution plan

### Phase 0 — Product shell & cleanup (0.5–1 day)

**Goal:** Make the repo feel like Kiroku, not a starter demo.

- [ ] Rename app title/meta to **Kiroku**  
- [ ] Replace landing (`index`) with a clear value prop + CTA  
- [ ] Strip or isolate demos (`demo/*`, optional blog)  
- [ ] Add `.env.example` (`DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`)  
- [ ] Document scripts in README for this product  
- [ ] Confirm `npm run dev` / `build` green  

**Exit:** Brand shell, clean routes, env template.

---

### Phase 1 — Backend foundation: Neon + Drizzle + Better Auth (2–3 days)

**Goal:** Real users and sessions in Postgres.

- [ ] Create Neon project; copy connection string  
- [ ] Install Drizzle + Neon serverless driver  
- [ ] Define schema: Better Auth tables + `profile`  
- [ ] Wire Better Auth → Drizzle adapter + Neon  
- [ ] Run migrations; seed optional  
- [ ] Enable email/password; add Google OAuth (optional same phase)  
- [ ] Auth UI routes: login / signup / logout  
- [ ] Route guards: `beforeLoad` on `/app/*`  
- [ ] Session helpers for server functions  

**Exit:** Sign up → session cookie → protected dashboard shell.

**Risk notes:** Prefer Drizzle adapter patterns from Better Auth docs; use Neon HTTP or pooler appropriate to host (Node vs edge).

---

### Phase 2 — Entries API & dashboard (2–3 days)

**Goal:** Daily progress CRUD.

- [ ] `entry` table + Zod schemas  
- [ ] Server functions: create/update/get/list by month  
- [ ] Unique one-entry-per-day rule (or allow multi with “primary” flag — default: one)  
- [ ] Dashboard: calendar or list of days, streak counter (computed)  
- [ ] “Log today” form with RHF + Zod  
- [ ] TanStack Query for list/detail; Zustand only for draft UI if needed  
- [ ] Empty states + loading skeletons (shadcn)  

**Exit:** Authenticated user can save and revisit daily entries.

---

### Phase 3 — Template system & card builder UI (3–5 days)

**Goal:** Beautiful, shareable card previews.

- [ ] Template registry + 3 templates minimum:  
  1. **Chibi anime** — soft colors, cute frame, sticker-like mood  
  2. **2D pixel** — pixel font, RPG “quest complete” vibe  
  3. **Minimal modern** — clean typography (always useful as default)  
- [ ] Optional: **Neon grid**, **Paper journal**  
- [ ] Card builder page: form side-by-side with live preview  
- [ ] Template picker (carousel/grid) with Motion transitions  
- [ ] Accent color + optional username display  
- [ ] Persist `templateId` + overrides on save (entry or entry_share)  
- [ ] Responsive: preview scales; export always fixed aspect (e.g. 1080×1350 or 1200×630)  

**Exit:** User picks a template and sees a production-quality card live.

**Design system tips:**

- Fixed export canvas size; scale with CSS `transform` in UI  
- Load webfonts that match styles (pixel font license-safe)  
- Prefer SVG decorations for crisp export  

---

### Phase 4 — Share pipeline (2–4 days)

**Goal:** Social-ready export and links.

**MVP share:**

- [ ] `modern-screenshot` capture of `#share-card` node  
- [ ] Download PNG button  
- [ ] Web Share API when available (mobile)  
- [ ] Copy image to clipboard where supported  

**Link share (recommended same phase or immediate next):**

- [ ] `entry_share` + public slug (`nanoid`)  
- [ ] Public route `/s/$slug` (no auth)  
- [ ] OG meta tags (title, description, image)  
- [ ] Upload image to R2/S3/Blob **or** generate OG via Satori  
- [ ] “Copy link” + optional QR  

**Exit:** User can download a card and/or open a public share URL that previews well in chats.

---

### Phase 5 — Polish, motion, quality (2–3 days)

**Goal:** Delight and reliability.

- [ ] Motion: page transitions, template switch, confetti on save streak  
- [ ] Toasts (shadcn sonner) for save/share errors  
- [ ] Accessibility: focus traps in modals, alt text, contrast on cards  
- [ ] SEO for landing + public shares  
- [ ] Error boundaries + friendly 404 for bad slugs  
- [ ] Vitest: Zod schemas, date/streak helpers, template registry  
- [ ] Optional: PWA install (later)  

**Exit:** Feels like a real product; critical paths tested.

---

### Phase 6 — Deploy, observability, soft launch (1–2 days)

**Goal:** Production URL.

- [ ] Deploy TanStack Start → **Vercel** (or Netlify)  
- [ ] Env vars: `DATABASE_URL`, auth secrets, storage keys  
- [ ] Neon production branch; disable unsafe demo flags  
- [ ] Custom domain  
- [ ] Basic analytics (e.g. Vercel Analytics or PostHog)  
- [ ] Error tracking (Sentry)  
- [ ] README: local setup + architecture diagram  

**Exit:** Friends can use production Kiroku.

---

### Phase 7+ — Growth features (backlog)

Prioritize after real usage:

| Feature | Notes |
|---------|--------|
| Discover feed | Public entries only |
| Streaks & badges | Gamification |
| Multi-entry per day / projects | “Work / Gym / Study” tracks |
| Template marketplace | Community or premium packs |
| Collaborative teams | Shared progress walls |
| AI assist | Summarize day → card copy (optional SpaceXAI / LLM) |
| i18n | Japanese/English fits “Kiroku” branding |
| Native share extensions | Deeper mobile later |

---

## 7. Suggested PR / milestone map

| PR | Title | Depends on |
|----|-------|------------|
| PR1 | Phase 0 — branding & route cleanup | — |
| PR2 | Phase 1 — Neon + Drizzle + Better Auth | PR1 |
| PR3 | Phase 2 — Entries CRUD + dashboard | PR2 |
| PR4 | Phase 3 — Templates + card builder | PR3 |
| PR5 | Phase 4 — Export + public share | PR4 |
| PR6 | Phase 5 — Polish + tests | PR5 |
| PR7 | Phase 6 — Production deploy config | PR6 |

Each PR should be mergeable and demoable alone.

---

## 8. Key decisions (locked recommendations)

1. **Keep TanStack Start as the full stack** — no separate Render API for v1.  
2. **Neon + Drizzle** for data.  
3. **Better Auth** (not Clerk) unless requirements change.  
4. **Zustand** for card-builder UI state; **TanStack Query** for server state.  
5. **Templates as React components** registered in a catalog (not a free-form design tool in v1).  
6. **Client screenshot export first**; object storage + OG second.  
7. **Deploy monolith Start app to Vercel/Netlify**; Neon external.  
8. **One entry per user per calendar day** in v1 (simplest mental model).  
9. **Free-text entries** in v1 (title + body); rich structured fields later.  
10. **Google + email auth**, **unlisted share links + PNG download**, **1080×1350 portrait**, **Vercel** deploy.

---

## 9. Product decisions (answered 2026-07-15)

| Question | Decision |
|----------|----------|
| Entry fields (v1) | **Free text only** — title optional + body; structured mood/metrics later |
| Auth launch | **Email/password + Google** via Better Auth |
| Sharing model | **PNG download + private/unlisted share links** — no public discovery feed in v1 |
| Card aspect ratio | **Portrait Stories** (target **1080×1350**) |
| Deploy target | **Vercel** (full Start app; Neon external) |
| Brand | **Kiroku** (assumed unless changed) |
| Monetization | Undecided — design free templates first |
| Blog / content-collections | Keep only if useful for marketing; not required for core app |

### Schema impact of “free text only”

```text
entry:
  id, user_id, entry_date, title (nullable), body (text, required),
  visibility ('private' | 'unlisted'), created_at, updated_at
  -- no mood/metrics/tags in v1
```

Card templates still *look* rich by mapping free text into styled layouts (quote-style body, date badge, username).

### Auth impact

- Phase 1 must include Google OAuth provider config in Better Auth  
- Env: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, plus existing auth secrets  

### Share impact

- No discover feed routes in v1  
- `visibility`: `private` | `unlisted` only  
- Export canvas fixed at 1080×1350; UI preview scales with CSS  

---

## 10. Success metrics (v1)

- Time-to-first-entry after signup &lt; 2 minutes  
- Export success rate &gt; 95% on mobile Safari + Chrome  
- Share link unfurl works on X, Discord, iMessage  
- Lighthouse accessibility ≥ 90 on core flows  

---

## 11. Immediate next step

**Start Phase 0 + Phase 1** in order:

1. Branding / landing cleanup  
2. Neon project + Drizzle schema + Better Auth (email + Google)  

Product decisions above are locked for v1; open remaining only: monetization, final brand copy, whether to keep the demo blog.
