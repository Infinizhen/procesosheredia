import { describe, it, expect } from 'vitest'
import {
  SITE_URL,
  ARTIST_NAME,
  SPOTIFY_URL,
  INDEXABLE_PATHS,
  canonicalUrl,
  hreflangAlternates,
  musicGroupJsonLd,
} from './seo'

describe('canonicalUrl', () => {
  it('builds a localized home URL', () => {
    expect(canonicalUrl('en')).toBe('https://procesosheredia.com/en')
  })

  it('builds a localized sub-path URL', () => {
    expect(canonicalUrl('es', '/bio')).toBe(
      'https://procesosheredia.com/es/bio',
    )
  })

  it('is rooted at SITE_URL', () => {
    expect(canonicalUrl('ja', '/bio').startsWith(SITE_URL)).toBe(true)
  })
})

describe('hreflangAlternates', () => {
  it('lists every supported locale plus an x-default', () => {
    const alts = hreflangAlternates('/bio')
    expect(alts).toEqual([
      { hrefLang: 'es-ES', href: 'https://procesosheredia.com/es/bio' },
      { hrefLang: 'en-US', href: 'https://procesosheredia.com/en/bio' },
      { hrefLang: 'ja', href: 'https://procesosheredia.com/ja/bio' },
      { hrefLang: 'x-default', href: 'https://procesosheredia.com/en/bio' },
    ])
  })

  it('points x-default at the fallback locale (English)', () => {
    const xDefault = hreflangAlternates('').find(
      (a) => a.hrefLang === 'x-default',
    )
    expect(xDefault?.href).toBe('https://procesosheredia.com/en')
  })
})

describe('musicGroupJsonLd', () => {
  it('is a schema.org MusicGroup for the artist', () => {
    const data = musicGroupJsonLd()
    expect(data['@context']).toBe('https://schema.org')
    expect(data['@type']).toBe('MusicGroup')
    expect(data.name).toBe(ARTIST_NAME)
  })

  it('links the artist to their Spotify profile via sameAs', () => {
    expect(musicGroupJsonLd().sameAs).toContain(
      'https://open.spotify.com/artist/4f8EtuWyQnq2T8NyZeJ0vn',
    )
    expect(SPOTIFY_URL).toBe(
      'https://open.spotify.com/artist/4f8EtuWyQnq2T8NyZeJ0vn',
    )
  })

  it('serializes to valid JSON', () => {
    expect(() => JSON.parse(JSON.stringify(musicGroupJsonLd()))).not.toThrow()
  })
})

describe('INDEXABLE_PATHS', () => {
  it('covers the home and bio pages', () => {
    expect(INDEXABLE_PATHS).toContain('')
    expect(INDEXABLE_PATHS).toContain('/bio')
  })
})
