import { test, expect } from '@playwright/test'

test('serves an allow-all robots.txt pointing at the sitemap', async ({
  request,
}) => {
  const res = await request.get('/robots.txt')
  expect(res.ok()).toBeTruthy()
  const body = await res.text()
  expect(body).toContain('User-agent: *')
  expect(body).toContain('Allow: /')
  expect(body).toContain('Sitemap: https://procesosheredia.com/sitemap.xml')
})

test('serves a sitemap.xml covering every language', async ({ request }) => {
  const res = await request.get('/sitemap.xml')
  expect(res.ok()).toBeTruthy()
  const body = await res.text()
  for (const url of [
    'https://procesosheredia.com/es',
    'https://procesosheredia.com/en',
    'https://procesosheredia.com/ja',
    'https://procesosheredia.com/es/bio',
    'https://procesosheredia.com/en/bio',
    'https://procesosheredia.com/ja/bio',
  ]) {
    expect(body).toContain(`<loc>${url}</loc>`)
  }
  expect(body).toContain('hreflang="x-default"')
})

test('home is titled and carries MusicGroup structured data', async ({
  page,
}) => {
  await page.goto('/es')
  await expect(page).toHaveTitle(/Antonio Procesos Heredia/)

  await expect(
    page.locator('head meta[name="description"]').first(),
  ).toHaveAttribute('content', /.+/)

  const jsonLd = page.locator('script[type="application/ld+json"]')
  await expect(jsonLd).toHaveCount(1)
  const data = JSON.parse((await jsonLd.textContent()) ?? '{}')
  expect(data['@type']).toBe('MusicGroup')
  expect(data.sameAs).toContain(
    'https://open.spotify.com/artist/4f8EtuWyQnq2T8NyZeJ0vn',
  )
})

test('canonical URL is per-locale', async ({ page }) => {
  await page.goto('/es')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://procesosheredia.com/es',
  )

  await page.goto('/en/bio')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://procesosheredia.com/en/bio',
  )
})
