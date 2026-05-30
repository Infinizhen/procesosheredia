import { describe, it, expect } from 'vitest'
import { buildSitemap, indexablePaths } from './sitemap'
import { LOCALE_CODES } from '../i18n/locales'
import { RELEASES } from './releases'

describe('buildSitemap', () => {
  const xml = buildSitemap()

  it('is a well-formed sitemap document', () => {
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(xml).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    )
    expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"')
    expect(xml.trimEnd().endsWith('</urlset>')).toBe(true)
  })

  it('lists home, releases index and bio for every locale', () => {
    for (const url of [
      'https://procesosheredia.com/es',
      'https://procesosheredia.com/en',
      'https://procesosheredia.com/ja',
      'https://procesosheredia.com/es/releases',
      'https://procesosheredia.com/es/bio',
      'https://procesosheredia.com/ja/bio',
    ]) {
      expect(xml).toContain(`<loc>${url}</loc>`)
    }
  })

  it('lists every release detail page per locale', () => {
    for (const r of RELEASES) {
      for (const code of LOCALE_CODES) {
        expect(xml).toContain(
          `<loc>https://procesosheredia.com/${code}/releases/${r.slug}</loc>`,
        )
      }
    }
  })

  it('has one <url> entry per locale × indexable path', () => {
    const count = (xml.match(/<url>/g) ?? []).length
    expect(count).toBe(indexablePaths().length * LOCALE_CODES.length)
  })

  it('declares hreflang alternates (incl. x-default) on each entry', () => {
    expect(xml).toContain(
      '<xhtml:link rel="alternate" hreflang="es-ES" href="https://procesosheredia.com/es/bio"/>',
    )
    expect(xml).toContain('hreflang="x-default"')
  })
})
