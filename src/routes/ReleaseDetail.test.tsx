import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ReleaseDetail from './ReleaseDetail'
import i18n from '../i18n/config'

// Rendered in isolation (no LangLayout to switch language), so pin i18next to
// the Spanish copy the assertions expect.
beforeAll(async () => {
  await i18n.changeLanguage('es')
})

function renderDetail(slug: string, now: Date) {
  return render(
    <MemoryRouter initialEntries={[`/es/releases/${slug}`]}>
      <Routes>
        <Route
          path="/:lang/releases/:slug"
          element={<ReleaseDetail now={now} />}
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ReleaseDetail', () => {
  it('shows the title, cover and a Spotify player for an out release', () => {
    renderDetail('lirios-del-apocalipsis', new Date('2026-05-30'))
    expect(
      screen.getByRole('heading', { level: 1, name: 'Lirios del Apocalipsis' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: /Lirios del Apocalipsis/ }),
    ).toBeInTheDocument()
    // Out + has an album id → the Spotify opt-in facade button is present.
    expect(screen.getByRole('button', { name: /spotify/i })).toBeInTheDocument()
  })

  it('shows an upcoming state (no player) for a future release', () => {
    renderDetail('el-increible-viaje-de-paquita', new Date('2026-05-30'))
    expect(screen.getByText('Próximamente')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /spotify/i })).toBeNull()
  })

  it('omits the player for a future release without an album id', () => {
    // Paquita: upcoming + no album id → no player.
    renderDetail('el-increible-viaje-de-paquita', new Date('2026-05-30'))
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'El increíble viaje de Paquita',
      }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /spotify/i })).toBeNull()
  })

  it('shows lyrics when the release has them', () => {
    renderDetail('lirios-del-apocalipsis', new Date('2026-05-30'))
    expect(
      screen.getByRole('heading', { name: /Lirios del apocalipsis/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Cae la ciudad pero el aire/)).toBeInTheDocument()
  })

  it('renders a 404 heading for an unknown slug', () => {
    renderDetail('no-existe', new Date('2026-05-30'))
    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument()
  })
})
