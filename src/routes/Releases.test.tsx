import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Releases from './Releases'
import { RELEASES } from '../lib/releases'
import i18n from '../i18n/config'

// These tests render the component in isolation (no LangLayout to switch
// language), so pin i18next to the Spanish copy the assertions expect.
beforeAll(async () => {
  await i18n.changeLanguage('es')
})

function renderReleases(now: Date) {
  return render(
    <MemoryRouter initialEntries={['/es/releases']}>
      <Routes>
        <Route path="/:lang/releases" element={<Releases now={now} />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Releases index', () => {
  it('lists one card per release, each linking to its detail page', () => {
    renderReleases(new Date('2026-05-30'))
    const links = screen
      .getAllByRole('link')
      .filter((a) => a.getAttribute('href')?.includes('/releases/'))
    expect(links.length).toBe(RELEASES.length)
    expect(
      screen.getByRole('link', { name: /Lirios del Apocalipsis/ }),
    ).toHaveAttribute('href', '/es/releases/lirios-del-apocalipsis')
  })

  it('shows a release date for items already out', () => {
    renderReleases(new Date('2026-05-30'))
    const card = screen
      .getByRole('link', { name: /Lirios del Apocalipsis/ })
      .closest('li')!
    // Out already → shows a formatted date, not the upcoming badge.
    expect(within(card).queryByText('Próximamente')).toBeNull()
    expect(within(card).getByText(/2026/)).toBeInTheDocument()
  })

  it('marks a future-dated release as upcoming', () => {
    renderReleases(new Date('2026-05-30'))
    const card = screen.getByRole('link', { name: /Paquita/ }).closest('li')!
    expect(within(card).getByText('Próximamente')).toBeInTheDocument()
  })

  it('orders releases newest-first', () => {
    renderReleases(new Date('2026-06-30'))
    const titles = screen
      .getAllByRole('link')
      .map((a) => a.textContent ?? '')
      .filter((t) => /Lirios|Paquita|Permíteme/.test(t))
    expect(titles[0]).toMatch(/Paquita/) // 2026-06-05, newest
  })
})
