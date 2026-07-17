# Kiroku

Daily progress, beautifully shared.

Log your day as free text, pick a themed card template (chibi, pixel, minimal, and more), and share a portrait card on social media.

## Stack

- **TanStack Start** — full-stack React (SSR, server functions, file routing)
- **Tailwind CSS v4** — styling (custom product primitives)
- **Better Auth** — authentication (email + Google)
- **Neon** + **Drizzle** — database
- **Zod** — validation

## Docs

| Doc | Purpose |
|-----|---------|
| [`docs/ROADMAP.md`](./docs/ROADMAP.md) | **Start here** — phase status + todo board |
| [`docs/CHANGELOG.md`](./docs/CHANGELOG.md) | What changed each phase |
| [`docs/phases/PHASE_02_ENTRIES.md`](./docs/phases/PHASE_02_ENTRIES.md) | Entries phase plan |
| [`docs/PRODUCT_PLAN.md`](./docs/PRODUCT_PLAN.md) | Full product vision & stack decisions |
| [`PRODUCT.md`](./PRODUCT.md) | Impeccable product context (who / why / register) |
| [`DESIGN.md`](./DESIGN.md) | Impeccable visual system (tokens + rules) |

### Impeccable (design skill)

Installed via [impeccable.style](https://impeccable.style/tutorials/getting-started/). Agent commands (in a supported harness):

```text
/impeccable init
/impeccable polish the login page
/impeccable critique the landing page
/impeccable audit src/
```

CLI detector: `npx impeccable detect src/`

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
  components/layout/   # Header, Footer, ThemeToggle, AuthHeader
  features/entries/    # forms, list, card templates, streak
  lib/                 # auth, db, validations, templates, constants
  server/              # createServerFn modules
  routes/              # file-based routes only
  styles.css
```

**Convention:** routes stay thin; domain UI under `features/*`; chrome under `components/*`.

## License

Private — all rights reserved.
