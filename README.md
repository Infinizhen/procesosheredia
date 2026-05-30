# procesosheredia.com

Official website for the music artist **Antonio Procesos Heredia**.

[![CI](https://github.com/Infinizhen/procesosheredia/actions/workflows/ci.yml/badge.svg)](https://github.com/Infinizhen/procesosheredia/actions/workflows/ci.yml)
[![Code license: MIT](https://img.shields.io/badge/code-MIT-blue.svg)](LICENSE)
[![Live](https://img.shields.io/badge/live-procesosheredia.com-c4a7ff.svg)](https://procesosheredia.com)

A small, fast, **trilingual** (Spanish · English · Japanese) single-page site.
It is a **static SPA with no backend** — built for speed, accessibility, and
machine/AI readability. There is no database, no tracking, and no non-essential
cookies.

> **Heads up:** the source code is open (MIT), but the artist's name, biography,
> images, and visual identity are **not**. See [License](#license).

## Tech stack

- **[React 19](https://react.dev/)** + **[TypeScript](https://www.typescriptlang.org/)**
- **[Vite](https://vite.dev/)** — dev server & production build
- **[React Router](https://reactrouter.com/)** — language-prefixed routing (`/es`, `/en`, `/ja`)
- **[react-i18next](https://react.i18next.com/)** — internationalization
- **React 19 document metadata** — per-language `<title>`/description, JSON-LD,
  Open Graph/Twitter, canonical + `hreflang` (no SSR; see [SEO & AI](#accessibility-seo--ai))
- Self-hosted fonts via **[Fontsource](https://fontsource.org/)** (no external requests)
- **[Cloudflare Pages](https://pages.cloudflare.com/)** — hosting & CDN

Testing: **Vitest** + **React Testing Library** (unit/component), **axe-core**
(accessibility), **Playwright** (E2E), **Lighthouse CI** (standards).

## Project structure

```
src/
  routes/      page components (one per route)
  components/  reusable UI (Seo, SiteFooter, LanguageSwitcher, SpotifyEmbed, TiltCover, …)
  lib/         pure logic / helpers (contact, seo, sitemap, social, releases)
  content/     long-form copy (legal text)
  i18n/        config + per-language string resources (es / en / ja)
  hooks/       custom hooks
  test/        test setup, helpers, fixtures
  App.tsx · main.tsx
e2e/           Playwright specs (smoke, a11y, seo)
public/        static assets · _redirects · robots.txt   (sitemap.xml is generated → dist/)
```

Tests are **colocated** with the code they cover (`Foo.tsx` + `Foo.test.tsx`).

**Releases are data-driven.** The home feature, the `/releases` stage and each
`/releases/:slug` page all read from one array in `src/lib/releases.ts`. To add a
release: drop a square cover in `public/covers/`, add an entry (slug, title, date,
`spotifyAlbumId` or `null`, cover, kind, `featured`, optional `lyrics`), and it
appears everywhere — sitemap included. A future `date` shows as "upcoming"; set
`spotifyAlbumId` once it's out to light up the player.

## Getting started

Requires **Node 24** (pinned in [`.nvmrc`](.nvmrc)).

```bash
npm ci          # install exactly what's in package-lock.json
npm run dev     # start the dev server with HMR
```

Then open the printed local URL. The bare `/` autodetects your browser language
and redirects to `/es`, `/en`, or `/ja` (fallback: English).

## Commands

| Command                           | What it does                                               |
| --------------------------------- | ---------------------------------------------------------- |
| `npm run dev`                     | Dev server (HMR)                                           |
| `npm run build`                   | Typecheck + production build to `dist/` (+ `sitemap.xml`)  |
| `npm run preview`                 | Serve the built `dist/` on `:4173`                         |
| `npm run lint`                    | ESLint (flat config)                                       |
| `npm run typecheck`               | `tsc -b`                                                   |
| `npm run test`                    | Unit + component (Vitest)                                  |
| `npm run test:e2e`                | E2E + a11y (Playwright) against the build                  |
| `npm run test:lighthouse`         | Lighthouse thresholds (a11y / SEO / best-practices / perf) |
| `npm run format` / `format:check` | Prettier                                                   |

## Testing & the quality gate

The project is built **test-first** (TDD): for anything with observable behavior
or a contract, a failing test is written first, then the code to make it pass.
Pure styling tweaks and volatile copy are exempt — see
[CONTRIBUTING.md](CONTRIBUTING.md) for the full "what we test" policy.

The CI gate (`.github/workflows/ci.yml`) runs on **every push**, in order, and
**stops on the first failure**:

```
lint → typecheck → unit/component → build → E2E (+ axe) → Lighthouse thresholds
```

| Layer         | Tool                                          | Covers                                        |
| ------------- | --------------------------------------------- | --------------------------------------------- |
| Static        | ESLint + Prettier                             | code quality, formatting                      |
| Types         | `tsc`                                         | type safety                                   |
| Unit          | Vitest                                        | pure logic in `src/lib`, hooks, helpers       |
| Component     | Vitest + RTL + user-event                     | UI behavior: render, interaction, states      |
| Accessibility | axe-core (jsdom) + @axe-core/playwright (E2E) | automated WCAG 2.x AA + 2.2 AA checks         |
| E2E           | Playwright (Chromium)                         | critical journeys in a real browser           |
| Standards     | Lighthouse CI                                 | min a11y / SEO / best-practices / perf scores |

In component and E2E tests, query **by role / accessible name** (`getByRole`) —
it tests behavior, not implementation, and enforces accessibility for free.

## Internationalization

Trilingual: **es-ES**, **en-US**, **ja** (strings live in `src/i18n/resources/`).

- URLs are **prefixed**: `/es`, `/en`, `/ja` (+ `/es/bio`, …).
- Bare `/` autodetects the visitor's language and redirects (fallback: English).
- Per-page `<html lang>`, an accessible language switcher, and `hreflang`
  alternates. Language is driven entirely by the URL.

## Accessibility, SEO & AI

- **Accessibility — WCAG 2.x AA (and 2.2 AA target-size).** Semantic landmarks,
  accessible names, keyboard operability, visible focus, sufficient contrast,
  `prefers-reduced-motion`. Enforced by axe (component + E2E) and the Lighthouse
  a11y score.
- **Machine / crawler readability.** Per-language document metadata
  (`src/components/Seo.tsx`): localized title + description, **JSON-LD
  (`MusicGroup`)**, Open Graph/Twitter, canonical + `hreflang`, a generated
  `sitemap.xml`, and an allow-all `robots.txt`. JS-capable crawlers get the full
  per-language set; no-JS scrapers fall back to the language-neutral defaults in
  `index.html`.
- **AI policy — fully open.** AI crawlers may read, cite, and train. `robots.txt`
  is allow-all and managed in this repo.

See [DESIGN.md](DESIGN.md) for the visual design system.

## Deployment

Hosted on **Cloudflare Pages**. The site deploys **only when the full gate is
green and the branch is `main`** — shipping the exact `dist/` that passed the
suite.

- **`main`** = production (every green push deploys).
- **`development`** = working branch. Build here, merge to `main` to release.

## Documentation

- **[CLAUDE.md](CLAUDE.md)** — the working project guide (architecture, gate, conventions).
- **[DESIGN.md](DESIGN.md)** — the visual design system (color, type, motion, a11y).
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — how this repo works & how to fork it.
- **[SECURITY.md](SECURITY.md)** — how to report a vulnerability.

## License

This repository contains **two different things** under **two different terms**:

- **Source code** — the implementation in this repo — is licensed under the
  **[MIT License](LICENSE)**. You are free to fork it, study it, and reuse the
  code in your own projects.
- **Artistic & brand content** — the name and likeness of **Antonio Procesos
  Heredia**, logos, biographical text, photographs/artwork, and the overall
  visual identity — is **© 2026 Antonio Procesos Heredia, All Rights Reserved**.
  It is **not** covered by the MIT License.

If you fork this project, **replace the artist's content and branding with your
own.** Keep the code; drop the identity.

Third-party dependencies and the self-hosted fonts retain their own licenses
(see [Acknowledgements](#acknowledgements)).

## Acknowledgements

Self-hosted display typefaces, served via [Fontsource](https://fontsource.org/)
under the **SIL Open Font License 1.1**:

- **Aguafina Script** — the artist's signature / hero name
- **Alike** — section & page titles
- **Wallpoet** — accent labels / eyebrows
