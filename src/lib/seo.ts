import {
  DEFAULT_LOCALE,
  LOCALE_CODES,
  LOCALES,
  type LocaleCode,
} from '../i18n/locales'

/** Canonical origin of the production site (no trailing slash). */
export const SITE_URL = 'https://procesosheredia.com'

/** The artist's name — used as the brand and in structured data. */
export const ARTIST_NAME = 'Antonio Procesos Heredia'

/**
 * Open Graph / Twitter share image — self-hosted and language-neutral, sized to
 * the 1200×630 (1.91:1) social-card ratio. Served from `public/og.png`.
 */
export const OG_IMAGE_URL = `${SITE_URL}/og.png`
export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630
export const OG_IMAGE_ALT = ARTIST_NAME

/** The artist's Spotify id, used for the profile link and the embedded player. */
export const SPOTIFY_ARTIST_ID = '4f8EtuWyQnq2T8NyZeJ0vn'

/** The artist's Spotify profile, linked from JSON-LD `sameAs`. */
export const SPOTIFY_URL = `https://open.spotify.com/artist/${SPOTIFY_ARTIST_ID}`

/** The artist's embeddable Spotify player (dark theme). */
export const SPOTIFY_EMBED_URL = `https://open.spotify.com/embed/artist/${SPOTIFY_ARTIST_ID}`

/** Locale-less paths that should be indexed and listed in the sitemap. */
export const INDEXABLE_PATHS = ['', '/bio'] as const

/** Absolute canonical URL for a locale + locale-less path (e.g. "/bio"). */
export function canonicalUrl(locale: LocaleCode, path = ''): string {
  return `${SITE_URL}/${locale}${path}`
}

export interface Alternate {
  hrefLang: string
  href: string
}

/**
 * `hreflang` alternates for a locale-less path: one entry per supported locale
 * plus an `x-default` pointing at the fallback locale (English).
 */
export function hreflangAlternates(path = ''): Alternate[] {
  const perLocale = LOCALE_CODES.map((code) => ({
    hrefLang: LOCALES[code].htmlLang,
    href: canonicalUrl(code, path),
  }))
  return [
    ...perLocale,
    { hrefLang: 'x-default', href: canonicalUrl(DEFAULT_LOCALE, path) },
  ]
}

/**
 * schema.org `MusicGroup` structured data for the artist. Language-independent:
 * the same entity (`@id`) is referenced from every localized page.
 */
export function musicGroupJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    '@id': `${SITE_URL}/#artist`,
    name: ARTIST_NAME,
    url: SITE_URL,
    sameAs: [SPOTIFY_URL],
  }
}
