import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HomeFeature from './HomeFeature'
import i18n from '../../i18n/config'
import type { Release } from '../../lib/releases'

beforeAll(async () => {
  await i18n.changeLanguage('es')
})

const release: Release = {
  slug: 'x',
  title: 'Una Canción',
  date: '2026-01-01',
  spotifyAlbumId: null,
  cover: '/covers/x.jpg',
  kind: 'single',
  featured: true,
}

describe('HomeFeature', () => {
  it('renders the default presentation (the title heading) for a release with no bespoke home', () => {
    render(
      <MemoryRouter>
        <HomeFeature release={release} locale="es" />
      </MemoryRouter>,
    )
    expect(
      screen.getByRole('heading', { level: 1, name: 'Una Canción' }),
    ).toBeInTheDocument()
  })
})
