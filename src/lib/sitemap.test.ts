import { describe, it, expect } from 'vitest'
import { buildSitemap } from './sitemap'

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

  it('lists every locale × indexable path (home + bio)', () => {
    for (const url of [
      'https://procesosheredia.com/es',
      'https://procesosheredia.com/en',
      'https://procesosheredia.com/ja',
      'https://procesosheredia.com/es/bio',
      'https://procesosheredia.com/en/bio',
      'https://procesosheredia.com/ja/bio',
    ]) {
      expect(xml).toContain(`<loc>${url}</loc>`)
    }
  })

  it('has one <url> entry per locale × path', () => {
    const count = (xml.match(/<url>/g) ?? []).length
    expect(count).toBe(6)
  })

  it('declares hreflang alternates (incl. x-default) on each entry', () => {
    expect(xml).toContain(
      '<xhtml:link rel="alternate" hreflang="es-ES" href="https://procesosheredia.com/es/bio"/>',
    )
    expect(xml).toContain('hreflang="x-default"')
  })
})
