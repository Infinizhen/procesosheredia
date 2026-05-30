import { describe, it, expect } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('per-page SEO (integration)', () => {
  it.each([
    ['/es', 'https://procesosheredia.com/es'],
    ['/en', 'https://procesosheredia.com/en'],
    ['/ja', 'https://procesosheredia.com/ja'],
    ['/es/bio', 'https://procesosheredia.com/es/bio'],
  ])('sets the canonical URL for %s', async (path, expected) => {
    renderAt(path)
    await waitFor(() =>
      expect(
        document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
      ).toBe(expected),
    )
  })

  it('titles every page with the artist name', async () => {
    renderAt('/en')
    await waitFor(() =>
      expect(document.title).toContain('Antonio Procesos Heredia'),
    )
  })

  it('exposes MusicGroup + MusicAlbum structured data on the home page', async () => {
    renderAt('/ja')
    await waitFor(() => {
      const types = [
        ...document.querySelectorAll('script[type="application/ld+json"]'),
      ].map((s) => JSON.parse(s.textContent ?? '{}')['@type'])
      expect(types).toContain('MusicGroup')
      expect(types).toContain('MusicAlbum')
    })
  })

  it('marks the 404 page noindex', async () => {
    renderAt('/es/no-existe')
    await waitFor(() =>
      expect(
        document.querySelector('meta[name="robots"]')?.getAttribute('content'),
      ).toBe('noindex'),
    )
  })
})
