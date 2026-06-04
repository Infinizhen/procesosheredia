import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import Releases from './Releases'
import { RELEASES } from '../lib/releases'
import i18n from '../i18n/config'

// These tests render the component in isolation (no LangLayout to switch
// language), so pin i18next to the Spanish copy the assertions expect.
beforeAll(async () => {
  await i18n.changeLanguage('es')
})

// A data router (createMemoryRouter + RouterProvider), not <MemoryRouter>:
// Releases calls `useViewTransitionState`, which requires a data router.
function renderReleases() {
  const router = createMemoryRouter(
    [{ path: '/:lang/releases', element: <Releases /> }],
    { initialEntries: ['/es/releases'] },
  )
  return render(<RouterProvider router={router} />)
}

describe('Releases index', () => {
  it('lists one card per release, each linking to its detail page', () => {
    renderReleases()
    const links = screen
      .getAllByRole('link')
      .filter((a) => a.getAttribute('href')?.includes('/releases/'))
    expect(links.length).toBe(RELEASES.length)
    expect(
      screen.getByRole('link', { name: /Lirios del Apocalipsis/ }),
    ).toHaveAttribute('href', '/es/releases/lirios-del-apocalipsis')
  })

  it('shows a release date for every item', () => {
    renderReleases()
    const card = screen
      .getByRole('link', { name: /Lirios del Apocalipsis/ })
      .closest('li')!
    expect(within(card).getByText(/2026/)).toBeInTheDocument()
  })

  it('orders releases newest-first', () => {
    renderReleases()
    const titles = screen
      .getAllByRole('link')
      .map((a) => a.textContent ?? '')
      .filter((t) => /Lirios|Paquita|Permíteme/.test(t))
    expect(titles[0]).toMatch(/Paquita/) // 2026-06-05, newest
  })
})
