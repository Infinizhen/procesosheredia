import { DEFAULT_LOCALE, LOCALE_CODES, LOCALES } from '../i18n/locales'
import { INDEXABLE_PATHS, canonicalUrl } from './seo'
import { RELEASES } from './releases'

/** Every locale-less indexable path: the static ones plus each release detail. */
export function indexablePaths(): string[] {
  return [...INDEXABLE_PATHS, ...RELEASES.map((r) => `/releases/${r.slug}`)]
}

function alternateLinks(path: string): string {
  const perLocale = LOCALE_CODES.map(
    (code) =>
      `    <xhtml:link rel="alternate" hreflang="${LOCALES[code].htmlLang}" href="${canonicalUrl(code, path)}"/>`,
  )
  perLocale.push(
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${canonicalUrl(DEFAULT_LOCALE, path)}"/>`,
  )
  return perLocale.join('\n')
}

/**
 * Renders an i18n `sitemap.xml` covering every locale × indexable path, with
 * `xhtml:link` hreflang alternates on each entry. Emitted to `dist/` at build
 * time by the Vite plugin in `vite.config.ts`.
 */
export function buildSitemap(): string {
  const entries = indexablePaths()
    .flatMap((path) =>
      LOCALE_CODES.map(
        (locale) =>
          `  <url>\n    <loc>${canonicalUrl(locale, path)}</loc>\n${alternateLinks(path)}\n  </url>`,
      ),
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`
}
