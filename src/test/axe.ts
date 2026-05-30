import axe from 'axe-core'

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

/**
 * Runs axe-core against a rendered container and returns WCAG A/AA violations.
 * Note: jsdom can't evaluate layout-dependent rules (e.g. color-contrast);
 * those are covered by the Playwright (real browser) a11y suite.
 */
export async function findA11yViolations(container: Element) {
  const { violations } = await axe.run(container, {
    runOnly: { type: 'tag', values: WCAG_TAGS },
    // jsdom can't message into (cross-origin) iframes like the Spotify embed;
    // we still check the <iframe> element itself (e.g. frame-title), just not
    // its third-party internals.
    iframes: false,
  })
  return violations
}
