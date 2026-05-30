import { test, expect } from '@playwright/test'

test('home (/es) loads with no console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))

  await page.goto('/es')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Lirios del Apocalipsis' }),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: /spotify/i })).toBeVisible()
  expect(errors).toEqual([])
})

test('nav goes from home to the releases index and into a release', async ({
  page,
}) => {
  await page.goto('/es')
  await page.getByRole('link', { name: 'Lanzamientos' }).first().click()
  await expect(page).toHaveURL(/\/es\/releases$/)
  await expect(
    page.getByRole('heading', { level: 1, name: 'Lanzamientos' }),
  ).toBeVisible()

  await page.getByRole('link', { name: /Lirios del Apocalipsis/ }).click()
  await expect(page).toHaveURL(/\/es\/releases\/lirios-del-apocalipsis$/)
  await expect(
    page.getByRole('heading', { level: 1, name: 'Lirios del Apocalipsis' }),
  ).toBeVisible()
})

test('the bio page shows the artist hero placeholder', async ({ page }) => {
  await page.goto('/es/bio')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Antonio Procesos Heredia' }),
  ).toBeVisible()
})

test('flag switcher changes language', async ({ page }) => {
  await page.goto('/es')
  await expect(
    page.getByRole('link', { name: 'Lanzamientos', exact: true }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'English' }).click()
  await expect(page).toHaveURL(/\/en$/)
  await expect(
    page.getByRole('link', { name: 'Releases', exact: true }),
  ).toBeVisible()
})

test('deep-link to /ja works and sets <html lang>', async ({ page }) => {
  await page.goto('/ja')
  await expect(
    page.getByRole('button', { name: 'Spotify で聴く' }),
  ).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja')
})

test('"/" redirects to a localized home', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/(es|en|ja)$/)
  await expect(
    page.getByRole('heading', { level: 1, name: 'Lirios del Apocalipsis' }),
  ).toBeVisible()
})
