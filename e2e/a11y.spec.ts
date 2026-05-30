import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

for (const path of [
  '/es',
  '/en',
  '/ja',
  '/es/releases',
  '/es/releases/lirios-del-apocalipsis',
  '/es/releases/el-increible-viaje-de-paquita',
  '/es/bio',
  '/es/garden',
  '/es/privacy',
]) {
  test(`no WCAG A/AA a11y violations on ${path}`, async ({ page }) => {
    await page.goto(path)
    await page.getByRole('heading').first().waitFor()
    const { violations } = await new AxeBuilder({ page })
      // The Spotify embed is a third-party, cross-origin iframe: don't audit its
      // internals (and avoid a flaky cross-frame race while it loads).
      .exclude('.spotify-embed')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(violations).toEqual([])
  })
}
