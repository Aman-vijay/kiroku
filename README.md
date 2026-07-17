# Kiroku

**Daily progress, beautifully shared.**

Log free-text notes for the day, frame them on a themed portrait card, and export or share a private link.

---

## Features

- **One entry per day** — title + free text, saved to your account
- **Card templates** — Minimal, Chibi, and Pixel
- **Live preview** — 1080×1350 canvas scaled in the UI
- **Export** — download PNG or use the Web Share API
- **Unlisted links** — optional share URL (`/s/…`), no public feed
- **Auth** — email/password and Google via Better Auth

---

## Stack

| Layer | Choice |
|-------|--------|
| App | [TanStack Start](https://tanstack.com/start) (React 19, SSR, server functions) |
| DB | [Neon](https://neon.tech) Postgres + [Drizzle](https://orm.drizzle.team) |
| Auth | [Better Auth](https://www.better-auth.com) |
| Styles | Tailwind CSS v4 |
| Validation | Zod |
| Export | modern-screenshot |

---

## Quick start

```bash
git clone <repo-url> kiroku
cd kiroku
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Notes |
|----------|--------|
| `DATABASE_URL` | Neon connection string |
| `BETTER_AUTH_SECRET` | Long random secret |
| `BETTER_AUTH_URL` | e.g. `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth app |

Push schema (if needed):

```bash
npm run db:push
# or apply SQL under drizzle/
```

Run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (port 3000) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run test` | Unit tests (Vitest) |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:push` | Push schema to Neon |
| `npm run db:studio` | Drizzle Studio |
| `npm run db:test` | Connectivity check (`NEON_OK`) |

---

## Project layout

```text
src/
  components/layout/   # chrome (header, footer, theme, auth)
  features/entries/    # forms, cards, share, streak
  lib/                 # auth, db, zod, templates
  server/              # createServerFn handlers
  routes/              # file-based routes
    app/               # authenticated app
    s.$slug.tsx        # public unlisted share
    api/auth/          # Better Auth handler
  styles.css
drizzle/               # SQL migrations
```

Routes stay thin; domain UI lives under `features/*`.

---

## License

Private — all rights reserved.
