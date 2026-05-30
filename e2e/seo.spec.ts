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
    'https://procesosheredia.com/es/releases',
    'https://procesosheredia.com/es/releases/lirios-del-apocalipsis',
    'https://procesosheredia.com/es/bio',
    'https://procesosheredia.com/en/bio',
    'https://procesosheredia.com/ja/bio',
  ]) {
    expect(body).toContain(`<loc>${url}</loc>`)
  }
  expect(body).toContain('hreflang="x-default"')
})

test('home is titled and carries MusicGroup + MusicAlbum structured data', async ({
  page,
}) => {
  await page.goto('/es')
  await expect(page).toHaveTitle(/Antonio Procesos Heredia/)

  await expect(
    page.locator('head meta[name="description"]').first(),
  ).toHaveAttribute('content', /.+/)

  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents()
  const types = blocks.map((b) => JSON.parse(b)['@type'])
  expect(types).toContain('MusicGroup')
  expect(types).toContain('MusicAlbum')

  const group = blocks
    .map((b) => JSON.parse(b))
    .find((d) => d['@type'] === 'MusicGroup')
  expect(group.sameAs).toContain(
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

test('serves the og:image and favicon assets', async ({ request }) => {
  const og = await request.get('/og.png')
  expect(og.ok()).toBeTruthy()
  expect(og.headers()['content-type']).toMatch(/^image\/png/)

  const ico = await request.get('/favicon.ico')
  expect(ico.ok()).toBeTruthy()
})

test('serves an installable web manifest with linked icons', async ({
  page,
  request,
}) => {
  await page.goto('/es')
  // The document links the manifest and a theme color.
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
    'href',
    '/site.webmanifest',
  )
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
    'href',
    '/apple-touch-icon.png',
  )

  // The manifest itself is valid JSON with the PWA essentials + a maskable icon.
  const res = await request.get('/site.webmanifest')
  expect(res.ok()).toBeTruthy()
  const m = JSON.parse(await res.text())
  expect(m.name).toBe('Antonio Procesos Heredia')
  expect(m.display).toBe('standalone')
  const purposes = m.icons.map((i: { purpose?: string }) => i.purpose)
  expect(purposes).toContain('maskable')

  // Every icon the manifest references actually resolves.
  for (const icon of m.icons as Array<{ src: string }>) {
    const r = await request.get(icon.src)
    expect(r.ok(), `${icon.src} should be served`).toBeTruthy()
  }
})

test('advertises the 1200×630 og:image on home and inner pages', async ({
  page,
}) => {
  for (const path of [
    '/es',
    '/es/releases/lirios-del-apocalipsis',
    '/es/bio',
  ]) {
    await page.goto(path)
    await expect(
      page.locator('head meta[property="og:image"]').first(),
    ).toHaveAttribute('content', 'https://procesosheredia.com/og.png')
  }
  await expect(
    page.locator('head meta[property="og:image:width"]').first(),
  ).toHaveAttribute('content', '1200')
})

test('a release page carries MusicAlbum structured data', async ({ page }) => {
  await page.goto('/es/releases/lirios-del-apocalipsis')
  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents()
  const album = blocks
    .map((b) => JSON.parse(b))
    .find((d) => d['@type'] === 'MusicAlbum')
  expect(album).toBeTruthy()
  expect(album.name).toBe('Lirios del Apocalipsis')
  expect(album.url).toBe(
    'https://open.spotify.com/album/5bTOzSrqRUVjmXOFgf7mWp',
  )
})

test('keeps exactly one <title>, updated per page (no duplicate)', async ({
  page,
}) => {
  await page.goto('/es')
  await expect(page.locator('head > title')).toHaveCount(1)
  await expect(page).toHaveTitle(/Antonio Procesos Heredia/)
})
