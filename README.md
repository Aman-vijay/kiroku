# Kiroku

Daily progress, beautifully shared.

Log your day as free text, pick a themed card template (chibi, pixel, minimal, and more), and share a portrait card on social media.

## Stack

- **TanStack Start** — full-stack React (SSR, server functions, file routing)
- **Tailwind CSS v4** + **shadcn/ui** — styling
- **Better Auth** — authentication (email + Google)
- **Neon** + **Drizzle** — database (Phase 1)
- **Zustand** / **TanStack Query** — client state (upcoming)

See [`docs/PRODUCT_PLAN.md`](./docs/PRODUCT_PLAN.md) for the full phased plan.

## Getting started

```bash
npm install
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` and fill values as you implement Phase 1.

```bash
npm run build   # production build
npm run test    # vitest
```

## Project structure

```text
src/
  components/
    layout/          # Header, Footer, ThemeToggle
    ui/              # shadcn primitives
  features/
    auth/            # auth UI & helpers
    entries/         # daily progress domain
    templates/       # card templates
    share/           # export + public links
  lib/
    auth.ts          # Better Auth server
    auth-client.ts   # Better Auth client
    constants.ts
    db/              # Drizzle + Neon
    validations/     # Zod schemas
    utils.ts
  server/            # createServerFn modules
  stores/            # Zustand
  hooks/
  types/
  routes/            # file-based routes only
    api/auth/
    app/             # authenticated app shell
    index.tsx        # landing
    login.tsx
  styles.css
```

**Convention:** routes stay thin; business UI lives under `features/*`; shared primitives under `components/*`.

## shadcn

```bash
npx shadcn@latest add button
```

## License

Private — all rights reserved.
