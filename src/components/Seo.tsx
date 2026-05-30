import { useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { DEFAULT_LOCALE, LOCALES, isLocale } from '../i18n/locales'
import {
  ARTIST_NAME,
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_URL,
  OG_IMAGE_WIDTH,
  canonicalUrl,
  hreflangAlternates,
  musicGroupJsonLd,
} from '../lib/seo'

interface SeoProps {
  /** Full, already-localized page title (brand included). */
  title: string
  /** Meta description; omitted tags are simply not rendered. */
  description?: string
  /** Keep the page out of search indexes (e.g. the 404 route). */
  noindex?: boolean
}

/**
 * Per-page document metadata. The `<title>` is the single static element in
 * `index.html`, updated in place via `document.title` so React never hoists a
 * second one; the rest — meta description, canonical + `hreflang` alternates,
 * Open Graph/Twitter cards and `MusicGroup` JSON-LD — uses React 19 metadata
 * hoisting. Locale and path are derived from the active route.
 */
export default function Seo({ title, description, noindex }: SeoProps) {
  const { lang } = useParams()
  const { pathname } = useLocation()

  // Update the existing <title> (the static one in index.html) in place rather
  // than rendering another <title>, which React 19 would hoist as a duplicate.
  useEffect(() => {
    document.title = title
  }, [title])

  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE
  const path = isLocale(lang) ? pathname.slice(`/${lang}`.length) : ''

  if (noindex) {
    return <meta name="robots" content="noindex" />
  }

  const canonical = canonicalUrl(locale, path)
  const jsonLd = JSON.stringify(musicGroupJsonLd())

  return (
    <>
      {description && <meta name="description" content={description} />}

      <link rel="canonical" href={canonical} />
      {hreflangAlternates(path).map((alt) => (
        <link
          key={alt.hrefLang}
          rel="alternate"
          hrefLang={alt.hrefLang}
          href={alt.href}
        />
      ))}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={ARTIST_NAME} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={LOCALES[locale].ogLocale} />
      <meta property="og:image" content={OG_IMAGE_URL} />
      <meta property="og:image:width" content={String(OG_IMAGE_WIDTH)} />
      <meta property="og:image:height" content={String(OG_IMAGE_HEIGHT)} />
      <meta property="og:image:alt" content={OG_IMAGE_ALT} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={OG_IMAGE_URL} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
    </>
  )
}
