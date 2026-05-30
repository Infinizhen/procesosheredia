import { type LocaleCode } from '../i18n/locales'
import { ARTIST_NAME, SITE_URL } from './seo'

/**
 * A music release (single, EP or album). This is the single source of truth for
 * the Releases section, the featured slot on the home page, and per-release SEO.
 *
 * `spotifyAlbumId` is the bare album id (the path segment in an
 * `open.spotify.com/album/<id>` URL, ignoring any `?si=` share token), or
 * `null` when there is no published album page yet.
 */
export interface Release {
  /** URL-safe identifier used in `/releases/:slug`. */
  slug: string
  /** Display title (language-neutral — track titles aren't translated). */
  title: string
  /** Release date, ISO `YYYY-MM-DD` (a future date means "upcoming"). */
  date: string
  /** Spotify album id, or `null` if not published / not yet known. */
  spotifyAlbumId: string | null
  /** Cover art served from `public/covers`. */
  cover: string
  /** Short type label key suffix: 'single' | 'ep' | 'album'. */
  kind: 'single' | 'ep' | 'album'
  /** The one release promoted on the home page. Exactly one should be true. */
  featured: boolean
  /** Optional lyrics (verbatim, language-neutral), shown on the detail page. */
  lyrics?: string
}

/**
 * All releases. Newest entries can go anywhere — helpers sort by date.
 *
 * "El increíble viaje de Paquita" has no public album id yet (it's upcoming);
 * drop the real id in when it's out and its player + Spotify link light up.
 */
export const RELEASES: Release[] = [
  {
    slug: 'permiteme-intentarlo',
    title: 'Permíteme intentarlo',
    date: '2026-05-07',
    spotifyAlbumId: '4aYoKShEeyz101xa5KqgPp',
    cover: '/covers/permiteme-intentarlo.jpg',
    kind: 'single',
    featured: false,
    lyrics: `Pensativo sobre mi cama,
ojos cerrao, el cacharro bien configurao,
preparao para el proceso.

Sobre la mesilla de noche una nota te dejao.

No puedo más, no aguanto,
siento no haber podío verte,
aquí hay una salida, que es inevitable,
y yo la quiero tanto...

Los recuerdos en el parque, las caladas tras el muro,
me vienen tientos de las veces que reímos juntos.
Sé que es reprochable, pero de esto estoy seguro.

Y no quiero perderlos, (los recuerdos en el parque)
no sé qué hay más allá, y no quiero verlo. (es inevitable)
Así que permíteme intentarlo. (permíteme intentarlo)

La trascendencia del ser,
de la mente y el cuerpo.
El paso adelante, el futuro que quiero ver.

Sin miedo a morir. (hay un futuro que quiero ver)
En un recipiente nuevo. (sin miedo a morir)

Y por eso, cuando despierte de nuevo, no será aquí. (no será aquí)
La consciencia se transmite por la red y cuando acabe,
estaré muy lejos y me pienso quedar allí. (sin miedo a morir)

Lo siento, lo siento tanto pero...
pero es que esto yo no puedo,
y ya veremo si m'arrepiento pero es que simplemente

NO QUIERO MORIR.`,
  },
  {
    slug: 'lirios-del-apocalipsis',
    title: 'Lirios del Apocalipsis',
    date: '2026-05-29',
    spotifyAlbumId: '5bTOzSrqRUVjmXOFgf7mWp',
    cover: '/covers/lirios-del-apocalipsis.jpg',
    kind: 'single',
    featured: true,
    lyrics: `Cae la ciudad pero el aire está en calma,
calma en el pecho, pecho sin alma,
arma el silencio, lento me abraza,
abraza el fin, que a todos alcanza.

Arde el reloj pero el pulso no corre,
corre la gente, su mente se rompe,
rompe la prisa, risa en el borde,
borde del todo, el todo se esconde.

Lirios del apocalipsis, que crecen sin prisa.
Libres en el frenesí, estático éxtasis que expone sus pétalos.
Goteando de sangre, les crece otro brote, los mece la brisa.

Esconde el miedo, miedo se apaga,
apaga la llama, llama que engaña,
engaña el ruido, mi oído descansa,
descanso del mundo, el mundo se para.

Para en mis ojos, ojos sin juicio,
juicio disuelto, resuelvo el principio,
reinician las ruinas, y las ruinas bendigo,
bendigo este fin, del cual soy testigo.

Lirios del apocalipsis, que crecen sin prisa.
Libres en el frenesí, estático éxtasis que expone sus pétalos.
Goteando de sangre, les crece otro brote, los mece la brisa.`,
  },
  {
    slug: 'el-increible-viaje-de-paquita',
    title: 'El increíble viaje de Paquita',
    date: '2026-06-05',
    spotifyAlbumId: null,
    cover: '/covers/el-increible-viaje-de-paquita.jpg',
    kind: 'single',
    featured: false,
  },
]

/** The single featured release (promoted on the home page), if any. */
export function getFeaturedRelease(): Release | undefined {
  return RELEASES.find((r) => r.featured)
}

/** Look up a release by its slug. */
export function getReleaseBySlug(slug: string): Release | undefined {
  return RELEASES.find((r) => r.slug === slug)
}

/** A copy of RELEASES sorted newest-first (does not mutate RELEASES). */
export function releasesByDateDesc(): Release[] {
  return [...RELEASES].sort((a, b) => b.date.localeCompare(a.date))
}

/** Whether a release's announced date is on or before `now`. */
export function isReleased(release: Release, now: Date): boolean {
  // Compare date-only (UTC midnight) so a release counts from its calendar day.
  return new Date(`${release.date}T00:00:00Z`).getTime() <= now.getTime()
}

/** Public Spotify album page URL for an id. */
export function spotifyAlbumUrl(id: string): string {
  return `https://open.spotify.com/album/${id}`
}

/** Embeddable Spotify album player URL for an id. */
export function spotifyAlbumEmbedUrl(id: string): string {
  return `https://open.spotify.com/embed/album/${id}`
}

/** Format an ISO date for display in the given locale. */
export function formatReleaseDate(iso: string, locale: LocaleCode): string {
  const bcp47 = locale === 'ja' ? 'ja-JP' : locale === 'es' ? 'es-ES' : 'en-US'
  return new Intl.DateTimeFormat(bcp47, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${iso}T00:00:00Z`))
}

/** schema.org `MusicAlbum` for a release, linked to the artist entity. */
export function releaseJsonLd(release: Release): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicAlbum',
    name: release.title,
    datePublished: release.date,
    byArtist: {
      '@type': 'MusicGroup',
      '@id': `${SITE_URL}/#artist`,
      name: ARTIST_NAME,
    },
    ...(release.spotifyAlbumId
      ? { url: spotifyAlbumUrl(release.spotifyAlbumId) }
      : {}),
  }
}
