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

function renderDetail(slug: string) {
  return render(
    <MemoryRouter initialEntries={[`/es/releases/${slug}`]}>
      <Routes>
        <Route path="/:lang/releases/:slug" element={<ReleaseDetail />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ReleaseDetail', () => {
  it('shows the title, cover and a Spotify player for a release with an album id', () => {
    renderDetail('lirios-del-apocalipsis')
    expect(
      screen.getByRole('heading', { level: 1, name: 'Lirios del Apocalipsis' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: /Lirios del Apocalipsis/ }),
    ).toBeInTheDocument()
    // Has an album id → the Spotify opt-in facade button is present.
    expect(screen.getByRole('button', { name: /spotify/i })).toBeInTheDocument()
  })

  it('links out to every platform', () => {
    renderDetail('lirios-del-apocalipsis')
    const link = screen.getByRole('link', {
      name: /Escuchar en todas las plataformas/i,
    })
    expect(link).toHaveAttribute(
      'href',
      'https://ditto.fm/lirios-del-apocalipsis',
    )
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('shows lyrics up-front (not hidden behind a disclosure)', () => {
    const { container } = renderDetail('lirios-del-apocalipsis')
    expect(
      screen.getByRole('heading', { name: /Lirios del apocalipsis/i }),
    ).toBeInTheDocument()
    // Lyrics text is rendered directly, under a "Letra" section heading…
    expect(screen.getByText(/Cae la ciudad pero el aire/)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /letra/i, level: 2 }),
    ).toBeInTheDocument()
    // …and NOT tucked inside a <details>/<summary> disclosure.
    expect(container.querySelector('details')).toBeNull()
  })

  it('shows a video facade in the hero for a release that has a track video', () => {
    renderDetail('el-increible-viaje-de-paquita')
    expect(screen.getByRole('button', { name: /YouTube/i })).toBeInTheDocument()
  })

  it('renders a 404 heading for an unknown slug', () => {
    renderDetail('no-existe')
    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument()
  })
})
