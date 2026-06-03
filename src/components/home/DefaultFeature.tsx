import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import SpotifyEmbed from '../SpotifyEmbed'
import type { LocaleCode } from '../../i18n/locales'
import type { Release } from '../../lib/releases'

/** Props every home presentation receives: the featured release + active locale. */
export interface FeatureProps {
  release: Release
  locale: LocaleCode
}

/**
 * The default home presentation — the original two-column promo: cover, eyebrow,
 * title, tagline, the album player (when the release has a Spotify id) and a link
 * to the full discography. Lifted out of the Home route so a release can opt into
 * a bespoke home instead (see `featurePresentationFor`); releases with no custom
 * presentation fall back here. Today the featured single uses this one.
 */
export default function DefaultFeature({ release, locale }: FeatureProps) {
  const { t } = useTranslation()

  return (
    <section className="feature">
      <Link
        className="feature__cover"
        to={`/${locale}/releases/${release.slug}`}
        aria-label={t('releases.viewRelease')}
      >
        <img
          src={release.cover}
          alt={t('releases.coverAlt', { title: release.title })}
          width="1000"
          height="1000"
        />
      </Link>

      <div className="feature__body">
        <p className="eyebrow eyebrow--lg">{t('releases.featured.eyebrow')}</p>
        <h1 className="feature__title">{release.title}</h1>
        <p className="feature__tagline">{t('releases.featured.tagline')}</p>
        {release.spotifyAlbumId && (
          <SpotifyEmbed
            type="album"
            id={release.spotifyAlbumId}
            title={t('releases.playerTitle', { title: release.title })}
          />
        )}
        <Link className="feature__all" to={`/${locale}/releases`}>
          {t('releases.viewAll')} →
        </Link>
      </div>
    </section>
  )
}
