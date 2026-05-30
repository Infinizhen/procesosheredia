# Contributing

First — thanks for looking. Honest expectations up front:

**This is a personal project.** It's the website of one specific artist, built and
maintained by one person. It is **not** run as a community/open-source project, and
I'm **not actively seeking contributions**. That's not hostility — it's just what
this repo is.

That said:

- **Fork away.** The source code is MIT (see [LICENSE](LICENSE)). Copy it, learn
  from it, build your own site on top of it. No need to ask.
- **The artist's content and branding are _not_ yours to reuse.** The name
  "Antonio Procesos Heredia", the biography, images/artwork, and visual identity
  are All Rights Reserved. If you fork this, **rip out the identity and put in your
  own.** Keep the code; drop the brand.

## Found a bug?

- **Security issue?** Please **don't** open a public issue — see
  [SECURITY.md](SECURITY.md).
- **Regular bug?** You're welcome to open an issue. No promises on turnaround, but
  it's appreciated.
- **Pull request?** Also welcome, but be aware it may sit, get heavily reworked, or
  be declined for reasons specific to this site. If you open one, it has to pass the
  same bar everything else does (below). Open it against **`development`**, not
  `main`.

## The bar (if you do touch the code)

Everything ships through a CI gate that **stops on the first failure**:

```
lint → typecheck → unit/component → build → E2E (+ axe) → Lighthouse thresholds
```

Run it locally before pushing:

```bash
npm ci
npm run lint && npm run typecheck && npm run test
npm run build && npm run test:e2e && npm run test:lighthouse
```

### Test-first (TDD)

This codebase is written test-first. For anything with **behavior, logic, or a
contract**:

1. **Red** — write the test(s) describing the desired behavior; watch them fail.
2. **Green** — write the minimum code to pass.
3. **Refactor** — clean up with the tests green.

For bugs: write a **failing test that reproduces it first**, then fix it — the test
stays as a regression guard.

**What we test:** logic & data (formatters, parsers, hooks), component behavior
(clicks, conditional/empty/error states), routing, accessibility, and regressions.
**What we don't force:** pure styling, frequently-changing copy (assert a heading
_exists_, not its exact words), and third-party embeds (assert the player _mounts_,
not its internals).

In component and E2E tests, **query by role / accessible name** (`getByRole`) — it
tests behavior, not implementation, and enforces accessibility for free.

### Accessibility is non-negotiable

WCAG 2.x AA (and 2.2 AA target-size), enforced by axe and Lighthouse. Semantic
HTML, accessible names, keyboard operability, visible focus, sufficient contrast,
and `prefers-reduced-motion` support. A change that regresses a11y won't pass the
gate. See [DESIGN.md](DESIGN.md).

## Conventions

- **Formatting:** Prettier — **no semicolons, single quotes**. Run `npm run format`.
- **Line endings:** **LF** (enforced via `.gitattributes`).
- **Commits:** Conventional-Commits style — `feat:`, `fix:`, `docs:`, `style:`,
  `refactor:`, `test:`, `chore:` — with an optional scope, e.g. `feat(footer): …`.
- **Branches:** build on `development`; `main` is production and auto-deploys.

Project layout, commands, and the full architecture are in the
[README](README.md) and [CLAUDE.md](CLAUDE.md).
