import { test, expect } from '@playwright/test'

test('home (/es) loads with no console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))

  await page.goto('/es')
  await expect(
    page.getByRole('heading', { name: 'Antonio Procesos Heredia' }),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: /spotify/i })).toBeVisible()
  expect(errors).toEqual([])
})

test('Biography page renders and the flag switcher changes language', async ({
  page,
}) => {
  await page.goto('/es/bio')
  await expect(page.getByRole('heading', { name: 'Biografía' })).toBeVisible()

  await page.getByRole('link', { name: 'English' }).click()
  await expect(page).toHaveURL(/\/en\/bio$/)
  await expect(page.getByRole('heading', { name: 'Biography' })).toBeVisible()
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
    page.getByRole('heading', { name: 'Antonio Procesos Heredia' }),
  ).toBeVisible()
})
