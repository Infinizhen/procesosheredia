import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import Seo from '../components/Seo'
import SpotifyEmbed from '../components/SpotifyEmbed'
import { DEFAULT_LOCALE, isLocale } from '../i18n/locales'
import { getFeaturedRelease, releaseJsonLd } from '../lib/releases'

/**
 * Home: a promo landing for the current featured release. The artist identity
 * lives in the header brand + footer; here the spotlight is the new single —
 * a two-column feature on desktop, stacked on mobile.
 */
export default function Home() {
  const { t } = useTranslation()
  const { lang } = useParams()
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE
  const featured = getFeaturedRelease()

  return (
    <>
      <Seo
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        extraJsonLd={featured ? releaseJsonLd(featured) : undefined}
      />
      <main className="home">
        {featured && (
          <section className="feature">
            <Link
              className="feature__cover"
              to={`/${locale}/releases/${featured.slug}`}
              aria-label={t('releases.viewRelease')}
            >
              <img
                src={featured.cover}
                alt={t('releases.coverAlt', { title: featured.title })}
                width="1000"
                height="1000"
              />
            </Link>

            <div className="feature__body">
              <p className="eyebrow eyebrow--lg">
                {t('releases.featured.eyebrow')}
              </p>
              <h1 className="feature__title">{featured.title}</h1>
              <p className="feature__tagline">
                {t('releases.featured.tagline')}
              </p>
              {featured.spotifyAlbumId && (
                <SpotifyEmbed
                  type="album"
                  id={featured.spotifyAlbumId}
                  title={t('releases.playerTitle', { title: featured.title })}
                />
              )}
              <Link className="feature__all" to={`/${locale}/releases`}>
                {t('releases.viewAll')} →
              </Link>
            </div>
          </section>
        )}
      </main>
    </>
  )
}
