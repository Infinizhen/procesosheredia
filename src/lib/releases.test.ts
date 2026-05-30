import { describe, it, expect } from 'vitest'
import {
  RELEASES,
  getFeaturedRelease,
  getReleaseBySlug,
  releasesByDateDesc,
  isReleased,
  spotifyAlbumUrl,
  spotifyAlbumEmbedUrl,
  formatReleaseDate,
  releaseJsonLd,
  trackNumber,
  trackCount,
} from './releases'

describe('releases data', () => {
  it('every release has well-formed fields', () => {
    expect(RELEASES.length).toBeGreaterThan(0)
    for (const r of RELEASES) {
      expect(r.slug).toMatch(/^[a-z0-9-]+$/)
      expect(r.title.length).toBeGreaterThan(0)
      expect(r.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(r.cover).toMatch(/^\/covers\/.+\.(jpg|png|webp)$/)
      expect(
        r.spotifyAlbumId === null || /^[A-Za-z0-9]+$/.test(r.spotifyAlbumId),
      ).toBe(true)
      expect(['single', 'ep', 'album']).toContain(r.kind)
      // A release carries song lyrics one way or the other, never both.
      expect(r.lyrics !== undefined && r.tracks !== undefined).toBe(false)
      for (const tr of r.tracks ?? []) {
        expect(tr.title.length).toBeGreaterThan(0)
      }
    }
  })

  it('has unique slugs', () => {
    const slugs = RELEASES.map((r) => r.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('marks exactly one release as featured', () => {
    expect(RELEASES.filter((r) => r.featured)).toHaveLength(1)
  })

  it('getFeaturedRelease returns Lirios del Apocalipsis', () => {
    expect(getFeaturedRelease()?.slug).toBe('lirios-del-apocalipsis')
  })

  it('getReleaseBySlug finds a release or returns undefined', () => {
    expect(getReleaseBySlug('lirios-del-apocalipsis')?.title).toContain(
      'Lirios',
    )
    expect(getReleaseBySlug('does-not-exist')).toBeUndefined()
  })

  it('releasesByDateDesc sorts newest-first without mutating RELEASES', () => {
    const before = [...RELEASES]
    const dates = releasesByDateDesc().map((r) => r.date)
    expect(dates).toEqual([...dates].sort((a, b) => b.localeCompare(a)))
    expect(RELEASES).toEqual(before)
  })

  it('isReleased compares the announced date against a given "now"', () => {
    const lirios = getReleaseBySlug('lirios-del-apocalipsis')!
    expect(isReleased(lirios, new Date('2026-05-30'))).toBe(true)
    expect(isReleased(lirios, new Date('2026-01-01'))).toBe(false)
  })

  it('treats a future-dated release as not yet released', () => {
    const paquita = getReleaseBySlug('el-increible-viaje-de-paquita')!
    expect(isReleased(paquita, new Date('2026-05-30'))).toBe(false)
  })

  it('builds Spotify album URLs from an id', () => {
    expect(spotifyAlbumUrl('abc123')).toBe(
      'https://open.spotify.com/album/abc123',
    )
    expect(spotifyAlbumEmbedUrl('abc123')).toBe(
      'https://open.spotify.com/embed/album/abc123',
    )
  })

  it('formats the release date per locale (robust to ICU spacing)', () => {
    // Exact Intl output (separators, ordering) is ICU-version-volatile across
    // platforms (local Windows vs CI Ubuntu), so assert the meaningful, stable
    // parts: localized month/year, and that locales differ from one another.
    const en = formatReleaseDate('2026-05-29', 'en')
    const es = formatReleaseDate('2026-05-29', 'es')
    const ja = formatReleaseDate('2026-05-29', 'ja')

    expect(en).toMatch(/May/)
    expect(en).toMatch(/29/)
    expect(en).toMatch(/2026/)

    expect(es).toMatch(/mayo/)
    expect(es).toMatch(/2026/)

    expect(ja).toMatch(/2026/)
    expect(ja).toMatch(/年/) // year marker — confirms the ja locale is applied

    expect(es).not.toBe(en)
  })

  it('builds MusicAlbum JSON-LD linked to the artist', () => {
    const lirios = getReleaseBySlug('lirios-del-apocalipsis')!
    const data = releaseJsonLd(lirios)
    expect(data['@type']).toBe('MusicAlbum')
    expect(data.name).toBe(lirios.title)
    expect(data.datePublished).toBe(lirios.date)
    expect((data.byArtist as { '@id': string })['@id']).toBe(
      'https://procesosheredia.com/#artist',
    )
    expect(data.url).toBe(
      'https://open.spotify.com/album/5bTOzSrqRUVjmXOFgf7mWp',
    )
  })

  it('omits the Spotify URL in JSON-LD when no album id is known', () => {
    const paquita = getReleaseBySlug('el-increible-viaje-de-paquita')!
    expect(releaseJsonLd(paquita).url).toBeUndefined()
  })

  it('numbers releases chronologically (oldest = 1)', () => {
    expect(trackNumber('permiteme-intentarlo')).toBe(1) // 2026-05-07
    expect(trackNumber('lirios-del-apocalipsis')).toBe(2) // 2026-05-29
    expect(trackNumber('el-increible-viaje-de-paquita')).toBe(3) // 2026-06-05
  })

  it('carries lyrics for the released singles', () => {
    expect(getReleaseBySlug('lirios-del-apocalipsis')!.lyrics).toMatch(
      /Lirios del apocalipsis/,
    )
    expect(getReleaseBySlug('permiteme-intentarlo')!.lyrics).toMatch(
      /permíteme intentarlo/i,
    )
  })

  it('models Paquita as a 5-track EP, one of them instrumental', () => {
    const paquita = getReleaseBySlug('el-increible-viaje-de-paquita')!
    expect(paquita.kind).toBe('ep')
    expect(paquita.lyrics).toBeUndefined()
    expect(trackCount(paquita)).toBe(5)
    expect(paquita.tracks!.map((t) => t.title)).toEqual([
      'Conciliación Familiar',
      'Quejíos',
      'Reyertas',
      'Ishtar',
      'Señal privá de la primavera',
    ])
    // Reyertas is the instrumental — no lyrics.
    expect(paquita.tracks![2].lyrics).toBeUndefined()
    expect(paquita.tracks![0].lyrics).toMatch(/Bailando Keipop/)
  })

  it('trackCount is 1 for a single', () => {
    expect(trackCount(getReleaseBySlug('lirios-del-apocalipsis')!)).toBe(1)
  })

  it('adds numTracks + a track list to EP JSON-LD', () => {
    const data = releaseJsonLd(
      getReleaseBySlug('el-increible-viaje-de-paquita')!,
    )
    expect(data.numTracks).toBe(5)
    const track = data.track as Array<Record<string, unknown>>
    expect(track).toHaveLength(5)
    expect(track[0]).toMatchObject({
      '@type': 'MusicRecording',
      position: 1,
      name: 'Conciliación Familiar',
    })
  })

  it('omits track data from single JSON-LD', () => {
    const data = releaseJsonLd(getReleaseBySlug('lirios-del-apocalipsis')!)
    expect(data.numTracks).toBeUndefined()
    expect(data.track).toBeUndefined()
  })
})
