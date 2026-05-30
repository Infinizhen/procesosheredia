import { useLocation, useParams } from 'react-router-dom'
import { DEFAULT_LOCALE, LOCALES, isLocale } from '../i18n/locales'
import {
  ARTIST_NAME,
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
 * Per-page document metadata via React 19 metadata hoisting: `<title>`, meta
 * description, canonical + `hreflang` alternates, Open Graph/Twitter cards and
 * `MusicGroup` JSON-LD. Locale and path are derived from the active route.
 */
export default function Seo({ title, description, noindex }: SeoProps) {
  const { lang } = useParams()
  const { pathname } = useLocation()

  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE
  const path = isLocale(lang) ? pathname.slice(`/${lang}`.length) : ''

  if (noindex) {
    return (
      <>
        <title>{title}</title>
        <meta name="robots" content="noindex" />
      </>
    )
  }

  const canonical = canonicalUrl(locale, path)
  const jsonLd = JSON.stringify(musicGroupJsonLd())

  return (
    <>
      <title>{title}</title>
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

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
    </>
  )
}
