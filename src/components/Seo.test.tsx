import { describe, it, expect } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Seo from './Seo'

function renderSeo(
  props: { title: string; description?: string; noindex?: boolean },
  path = '/es/bio',
) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/:lang/*" element={<Seo {...props} />} />
      </Routes>
    </MemoryRouter>,
  )
}

function meta(selector: string) {
  return document.head.querySelector(selector)?.getAttribute('content')
}

describe('Seo', () => {
  it('sets the document title', async () => {
    renderSeo({ title: 'About · Antonio Procesos Heredia' })
    await waitFor(() =>
      expect(document.title).toBe('About · Antonio Procesos Heredia'),
    )
  })

  it('emits a meta description in <head>', async () => {
    renderSeo({ title: 'T', description: 'A musician from Spain.' })
    await waitFor(() =>
      expect(meta('meta[name="description"]')).toBe('A musician from Spain.'),
    )
  })

  it('emits a canonical link hoisted into <head>', async () => {
    renderSeo({ title: 'T' }, '/es/bio')
    await waitFor(() => {
      const canonical = document.querySelector('link[rel="canonical"]')
      expect(canonical?.getAttribute('href')).toBe(
        'https://procesosheredia.com/es/bio',
      )
      expect(document.head.contains(canonical)).toBe(true)
    })
  })

  it('emits hreflang alternates for every locale plus x-default', async () => {
    renderSeo({ title: 'T' }, '/es/bio')
    await waitFor(() => {
      const hrefs = Object.fromEntries(
        [...document.querySelectorAll('link[rel="alternate"]')].map((l) => [
          l.getAttribute('hreflang'),
          l.getAttribute('href'),
        ]),
      )
      expect(hrefs).toEqual({
        'es-ES': 'https://procesosheredia.com/es/bio',
        'en-US': 'https://procesosheredia.com/en/bio',
        ja: 'https://procesosheredia.com/ja/bio',
        'x-default': 'https://procesosheredia.com/en/bio',
      })
    })
  })

  it('emits Open Graph and Twitter tags', async () => {
    renderSeo({ title: 'My Title', description: 'My desc' }, '/es/bio')
    await waitFor(() => {
      expect(meta('meta[property="og:type"]')).toBe('website')
      expect(meta('meta[property="og:site_name"]')).toBe(
        'Antonio Procesos Heredia',
      )
      expect(meta('meta[property="og:title"]')).toBe('My Title')
      expect(meta('meta[property="og:description"]')).toBe('My desc')
      expect(meta('meta[property="og:url"]')).toBe(
        'https://procesosheredia.com/es/bio',
      )
      expect(meta('meta[property="og:locale"]')).toBe('es_ES')
      expect(meta('meta[name="twitter:card"]')).toBe('summary')
      expect(meta('meta[name="twitter:title"]')).toBe('My Title')
    })
  })

  it('embeds MusicGroup JSON-LD linking to Spotify', async () => {
    renderSeo({ title: 'T' }, '/en')
    await waitFor(() => {
      const script = document.querySelector(
        'script[type="application/ld+json"]',
      )
      expect(script).toBeTruthy()
      const data = JSON.parse(script!.textContent ?? '{}')
      expect(data['@type']).toBe('MusicGroup')
      expect(data.name).toBe('Antonio Procesos Heredia')
      expect(data.sameAs).toContain(
        'https://open.spotify.com/artist/4f8EtuWyQnq2T8NyZeJ0vn',
      )
    })
  })

  describe('noindex', () => {
    it('marks the page noindex and omits canonical/structured data', async () => {
      renderSeo({ title: '404', noindex: true }, '/es/missing')
      await waitFor(() => expect(document.title).toBe('404'))
      expect(meta('meta[name="robots"]')).toBe('noindex')
      expect(document.querySelector('link[rel="canonical"]')).toBeNull()
      expect(
        document.querySelector('script[type="application/ld+json"]'),
      ).toBeNull()
    })
  })
})
