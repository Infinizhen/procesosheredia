# procesosheredia — project guide

Website for the music artist **Antonio Procesos Heredia** (procesosheredia.com).
A **static SPA, no backend**, **trilingual** (es / en / ja). SEO & AI readability via rich
static metadata + JSON-LD (full SSG was evaluated and **deferred** — see "Status & next steps").

## Core principle: Test-Driven Development (TDD)

We work **test-first**. For any task with observable behavior or a contract:

1. **Red** — write the test(s) describing the desired behavior; watch them fail.
2. **Green** — write the minimum code to make them pass.
3. **Refactor** — clean up with the tests green.

Rules:

- **Test-first whenever there is behavior, logic, or a contract.** Do NOT force tests on
  purely visual/styling tweaks or volatile copy (see "What we test"). Use judgment — this
  is the "when it's reasonable" rule.
- **Bugs:** first write a failing test that reproduces the bug, then fix it. It stays as a
  regression guard.
- The tests below are exactly what must pass to deploy to production (see the gate).

## Test layers (the suites)

Fast → slow. The full gate below is wired (foundations complete).

| Layer         | Tool                                                         | Covers                                                   | Status |
| ------------- | ------------------------------------------------------------ | -------------------------------------------------------- | ------ |
| Static        | ESLint + Prettier                                            | code quality, format                                     | ✅     |
| Types         | `tsc`                                                        | type safety                                              | ✅     |
| Unit          | Vitest                                                       | pure logic in `src/lib`, hooks, helpers                  | ✅     |
| Component     | Vitest + React Testing Library + user-event                  | UI behavior: render, interaction, states (the bulk)      | ✅     |
| Accessibility | `axe-core` (component, jsdom) + `@axe-core/playwright` (E2E) | automated WCAG 2.x AA + 2.2 AA checks                    | ✅     |
| E2E           | Playwright (Chromium)                                        | critical journeys in a real browser                      | ✅     |
| Standards     | Lighthouse CI                                                | min scores for A11y / SEO / Best-practices / Performance | ✅     |

In component & E2E tests, **query by role / accessible name** (`getByRole`). Tests behavior,
not implementation, and enforces accessibility for free.

## What we test — and what we don't

- ✅ **Test (test-first):** logic & data (formatters, parsers, hooks), component behavior
  (clicks, forms, conditional/empty/error states), routing & navigation,
  integration/contracts (any future serverless function — e.g. a contact form),
  accessibility, and regressions.
- 🟡 **Don't force / light-touch:** pure styling; frequently-changing copy (assert a heading
  _exists_, not its exact words); third-party embeds (assert the Spotify player _mounts_,
  not its internals); trivial presentational markup ("renders without crashing" is enough).

## Standards we commit to

- **Accessibility:** WCAG 2.x AA. Semantic HTML, landmarks/roles, labels, keyboard
  operability, focus order, contrast. Enforced by axe (component & E2E, incl. WCAG 2.2 AA
  target-size) + the Lighthouse a11y score. (No `eslint-plugin-jsx-a11y` — it doesn't support
  ESLint 10; axe + Lighthouse cover a11y. Don't re-add it.)
- **Machine / crawler / AI readability:** per-language document metadata via **React 19
  document metadata** (rendered by `src/components/Seo.tsx`): localized `<title>` +
  description, **JSON-LD (`MusicGroup`)**, Open Graph/Twitter tags, a canonical URL +
  `hreflang` alternates, a generated `sitemap.xml`, and an allow-all `robots.txt`. It's a
  client-rendered SPA: JS-capable crawlers (Googlebot) get the full per-language set; no-JS
  social scrapers fall back to the language-neutral defaults in `index.html`.
- **AI policy — fully OPEN:** AI crawlers may read, cite, and train. `robots.txt` is
  allow-all and **managed in this repo** (Cloudflare's managed robots.txt is disabled).
  Do not reintroduce AI disallows.

## Project structure

```
src/
  routes/      page components (one per route)
  components/  reusable UI
  lib/         pure logic / helpers (easiest to unit-test)
  content/     long-form copy (legal text)
  hooks/       custom hooks
  test/        test setup, helpers, fixtures
  App.tsx · main.tsx
e2e/           Playwright specs
public/        static assets · _redirects · robots.txt   (sitemap.xml is generated → dist/)
```

- **Colocate tests:** `Foo.tsx` + `Foo.test.tsx`.
- **Test behavior, not implementation.**

## Commands

| Command                           | What it does                                              |
| --------------------------------- | --------------------------------------------------------- |
| `npm run dev`                     | Dev server (HMR)                                          |
| `npm run build`                   | Typecheck + production build to `dist/` (+ `sitemap.xml`) |
| `npm run preview`                 | Serve the built `dist/` on `:4173`                        |
| `npm run lint`                    | ESLint (flat config)                                      |
| `npm run typecheck`               | `tsc -b`                                                  |
| `npm run test`                    | Unit + component (Vitest)                                 |
| `npm run test:e2e`                | E2E + a11y (Playwright) against the build                 |
| `npm run test:lighthouse`         | Lighthouse thresholds (a11y/SEO/best-practices/perf)      |
| `npm run format` / `format:check` | Prettier                                                  |

## CI/CD — the gate (do not weaken)

`.github/workflows/ci.yml`, on every push, in order:
**lint → typecheck → unit/component → build → E2E (+ axe) → Lighthouse thresholds.**
If anything fails, it STOPS.

**Production deploys ONLY when every check is green AND the branch is `main`** — shipping the
exact `dist/` that passed the suite, to **Cloudflare Pages** via `cloudflare/wrangler-action`.
Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.

## Git workflow

- **`main` = production** (every green push deploys). **`development` = working branch.**
  Build on `development`; merge to `main` to release.
- Push to the **personal** GitHub account **`Infinizhen`** (remote embeds the username:
  `https://Infinizhen@github.com/Infinizhen/procesosheredia.git`). Never the work account.
- Conventions: Prettier (no semicolons, single quotes), ESLint flat config, **LF** endings.

## Hosting & DNS (handle with care)

- **Cloudflare Pages** (project `procesosheredia`). SPA fallback via `public/_redirects`.
- DNS on **Cloudflare**, **DNSSEC enabled**. **Email stays at Nominalia** (`MX → mail.nominalia.com`).
- ⚠️ **Never modify/delete the email DNS records** (MX, SPF TXT, and the `autoconfig` /
  `pop` / `authsmtp` / `_autodiscover` entries). Breaking them breaks the owner's email.
- `www → apex` canonical 301 is a Cloudflare **Single Redirect** rule (zone-level).

## Internationalization (i18n)

- Trilingual: **es-ES**, **en-US**, **ja** (`react-i18next`; strings in `src/i18n/resources/`).
- URLs are **prefixed**: `/es`, `/en`, `/ja` (+ `/es/releases`, `/es/releases/:slug`, `/es/bio`,
  …). Bare `/` autodetects the visitor's language and redirects; **fallback is English** (`/en`).
- Per-page `<html lang>`, accessible language switcher with `hreflang`, language driven by the
  URL — see `src/routes/LangLayout.tsx`, `src/routes/RootRedirect.tsx`, `src/i18n/`.

## Status & next steps (handoff 2026-05-30)

Working branch **`development`** (prod = `main`, in sync); everything green in CI and **live in
production**.

**Done & deployed:** DNS → Cloudflare (email intact at Nominalia, DNSSEC on), Pages +
test-gated CI/CD, custom domain (apex + `www`→apex 301), accessibility (axe component + E2E
incl. WCAG 2.2 AA target-size) + **Lighthouse CI** gate (`lighthouserc.cjs`), **i18n**
(trilingual), **SEO** (React 19 metadata via `src/components/Seo.tsx`, JSON-LD `MusicGroup`,
generated `sitemap.xml`, allow-all `robots.txt`), the **dark / charcoal / brutalist redesign**
(self-hosted fonts Aguafina/Alike/Wallpoet — see `DESIGN.md`), the **Spotify player**
(privacy-friendly click-to-load facade), a **Biografía** section, a footer (social:
Spotify/Instagram/TikTok + bot-protected email + flag language switcher), and the **legal**
Privacy & Cookies page (`src/routes/Privacy.tsx`, content in `src/content/legal.ts`).

**Current state (release-driven):** the **header nav is back** (Inicio · Lanzamientos ·
Biografía). **Home `/`** is a promo landing for the current **featured release** — a two-column
feature (cover + eyebrow + title + tagline + album Spotify facade player), compact so the footer
stays reachable on desktop. **`/releases`** is a "track-select" stage: numbered, reactive cover
tiles (released ones open a detail page; upcoming ones render as a desaturated "locked" tile).
**`/releases/:slug`** is the per-release page (large cover, date/kind, album player, collapsible
**lyrics**). **`/bio`** is what Home used to be (artist name hero + artist player) — still a
**placeholder** awaiting real copy (plan: when the bio is written, that layout becomes the bio).
Releases are a **single source of truth in `src/lib/releases.ts`** (slug, title, date,
`spotifyAlbumId|null`, cover, kind, `featured`, optional `lyrics`); covers in `public/covers/`
(optimized ~1000px). The **`og:image`** (`public/og.png`, 1200×630) ships and is advertised
site-wide.

**Next:** real **bio** copy; the Spotify **album id for "El increíble viaje de Paquita"** once it
ships (2026-06-05) — set `spotifyAlbumId` in `releases.ts` and its player lights up; further
releases are just new array entries. A **hero tagline/eyebrow** (`music.heading` Wallpoet eyebrow
kept in i18n) if the home concept changes again.

**Key decisions:** SSG dropped (React 19 metadata is enough; Google renders JS). AI **fully
OPEN** (allow-all robots; do not re-enable Cloudflare's managed robots.txt). No
`eslint-plugin-jsx-a11y` (no ESLint 10 support; axe + Lighthouse cover a11y). **Legal =
minimal**: Privacy+Cookies only (no Aviso Legal), identified by the **artist name + email**
— never the owner's real name/DNI/address; **no cookie banner** (the facade means no
non-essential cookies load without user action). Push to **`Infinizhen`**.
