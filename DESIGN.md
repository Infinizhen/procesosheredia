# procesosheredia — design system

The visual language for **Antonio Procesos Heredia**. First proposal — built on
`development` for review. Implemented in `src/index.css` (tokens + components) and
the route/component markup. Every choice here still has to pass the gate
(a11y / Lighthouse / tests), so the system is **accessible by construction**.

## Principles

- **Charcoal, dark-mode-first.** Not pure black/white: "blacks" are very dark grays,
  "whites" are very light grays. Low-light, low-glare UX.
- **Brutalist.** Honest structure: a hairline-framed column, exposed borders, hard
  type, a single restrained accent. No skeuomorphism, no decoration for its own sake.
- **Bold, expressive typography as the centerpiece.** The artist's name _is_ the hero.
- **Meaningful micro-interactions, subtle micro-animations.** Motion confirms intent
  (hover underlines, focus rings, a one-time hero entrance) — never gratuitous, always
  `prefers-reduced-motion`-aware.
- Influence: the moody, high-contrast, slightly glitched feel of the artist's cover art;
  a _vectorstorm_-adjacent energy carried by type and the accent glow rather than imagery
  (we have no photography yet).

## Color (charcoal scale)

CSS custom properties on `:root` (see `src/index.css`):

| Token           | Value     | Use                                  |
| --------------- | --------- | ------------------------------------ |
| `--bg`          | `#0c0c0e` | page background (charcoal, ~black)   |
| `--bg-1`        | `#131316` | elevated surfaces (buttons, chips)   |
| `--bg-2`        | `#1c1c22` | hover surfaces                       |
| `--line`        | `#26262c` | hairline borders / the frame         |
| `--line-2`      | `#34343c` | stronger borders                     |
| `--text`        | `#c3c3ca` | body text (light gray)               |
| `--text-dim`    | `#8b8b94` | muted / secondary                    |
| `--text-hi`     | `#f4f4f6` | headings (near-white)                |
| `--accent`      | `#c4a7ff` | the single accent (violet)           |
| `--accent-glow` | rgba glow | hero/focus ambience, low-light depth |

All text/background pairs meet **WCAG 2 AA contrast** (verified by axe E2E + Lighthouse a11y = 100).
A faint top-down accent glow on `body` gives the dark canvas depth.

## Typography

Three display faces, each mapped to how the artist already uses them on his covers —
**self-hosted** via `@fontsource` (no external requests; better Lighthouse + privacy):

| Face                | Token            | Role                                                    |
| ------------------- | ---------------- | ------------------------------------------------------- |
| **Aguafina Script** | `--font-script`  | the artist's **name** (signature) — brand + hero        |
| **Alike**           | `--font-display` | **product / section titles** (e.g. Biografía), taglines |
| **Wallpoet**        | `--font-accent`  | **special accent** labels / eyebrows (e.g. `ESCUCHA`)   |
| system sans         | `--font-sans`    | body, UI, nav (legible, neutral)                        |

Hierarchy: the hero name is huge (`clamp(3.25rem, 13vw, 8.5rem)`); section eyebrows are
small, uppercase, letter-spaced Wallpoet in the accent color; page titles are Alike serif.

## Layout

- A centered, **hairline-framed column** (`max-width: 1080px`, `border-inline`) — the
  brutalist "frame".
- **Sticky header**: brand (name, Aguafina) · nav (uppercase sans, animated underline) ·
  language switcher (flag + name).
- **Footer**: social icon links · email · credit, separated by a top hairline.
- Generous, fluid spacing via `clamp()`; mobile-first, wraps gracefully (verified at 390px).

## Components

- **Language switcher** — flag (decorative SVG, `aria-hidden`) + the language name (the
  accessible label); active locale marked with `aria-current` and a chip outline.
- **Social links** — Instagram / X / TikTok as icon links, each with an accessible name
  ("Instagram (opens in a new tab)"), `rel="noopener noreferrer"`, ≥44px targets.
- **Email** — opens the mail client; the address is assembled only on click
  (`src/lib/contact.ts`) so it never appears in the DOM/HTML (anti-harvest).
- **Spotify** — a privacy-friendly **facade**: the cookie-setting iframe loads only on
  click, keeping the initial page cookie-free and fast. Reusable for the artist profile
  or a specific **album** (`<SpotifyEmbed type="album" id=… />`).
- **Home feature** — the current featured release as a **two-column** block on desktop
  (cover ↔ eyebrow + title + tagline + album player), stacked + centered on mobile. Sized
  so the footer stays reachable without dead space or needless scroll.
- **Releases "stage"** — a track-select grid of square cover **tiles**, numbered (`01`, `02`,
  …) like a level select. Each tile reacts on **hover and keyboard focus** (lift, cover zoom,
  a scrim + CTA reveal). Upcoming releases render as a **"locked" tile** — desaturated art,
  dashed accent frame, a "coming soon" badge. All reveals are CSS-only and collapse cleanly
  under `prefers-reduced-motion`.
- **Release detail** — a large cover + info hero, the album player, and **lyrics** in a
  native `<details>` disclosure (keyboard-operable for free, `+`/`–` affordance).

## Motion

- Micro-interactions: nav underline grows on hover/active; social icons lift; the Spotify
  facade glows; links/controls show a 2px accent **focus ring** (`:focus-visible`).
- One-time **hero entrance** (rise + fade) on load.
- **`prefers-reduced-motion: reduce`** flattens all animation/transition to ~0ms.

## Accessibility commitments (non-negotiable)

- WCAG 2.x AA + 2.2 AA: contrast, semantic landmarks (`header`/`nav`/`main`/`footer`),
  accessible names, keyboard operability, visible focus, ≥24px (links) / ≥44px (buttons)
  targets, reduced-motion. Enforced by axe (component + E2E) and Lighthouse.

## Open / next

- **Real content**: bio copy, hero tagline, any release/section copy (placeholders for now).
- **`og:image`**: a real 1200×630 once there's artwork (the open SEO TODO).
- **More motion/visuals if wanted**: a WebGL/`three.js` or canvas hero treatment, or
  animated grain, can layer on top of this type-first base without changing the system —
  behind the same reduced-motion guard.
