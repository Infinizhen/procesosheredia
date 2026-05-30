import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import Seo from '../components/Seo'
import SpotifyEmbed from '../components/SpotifyEmbed'
import NotFound from './NotFound'
import { DEFAULT_LOCALE, isLocale } from '../i18n/locales'
import { ARTIST_NAME } from '../lib/seo'
import {
  formatReleaseDate,
  getReleaseBySlug,
  isReleased,
  releaseJsonLd,
} from '../lib/releases'

/**
 * A single release page: a large cover "stage", title/kind/date, the album's
 * Spotify player (once out) or an "upcoming" state, and collapsible lyrics.
 * Unknown slugs render 404.
 */
export default function ReleaseDetail({ now = new Date() }: { now?: Date }) {
  const { t } = useTranslation()
  const { lang, slug } = useParams()
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE
  const release = slug ? getReleaseBySlug(slug) : undefined

  if (!release) {
    return <NotFound />
  }

  const out = isReleased(release, now)

  return (
    <>
      <Seo
        title={`${release.title} — ${ARTIST_NAME}`}
        description={t('releases.metaDescription', { title: release.title })}
        extraJsonLd={releaseJsonLd(release)}
      />
      <main className="page release">
        <Link to={`/${locale}/releases`} className="release__back">
          ← {t('releases.backToReleases')}
        </Link>

        <div className="release__hero">
          <div className={`release__art ${out ? '' : 'release__art--soon'}`}>
            <img
              src={release.cover}
              alt={t('releases.coverAlt', { title: release.title })}
              width="1000"
              height="1000"
            />
          </div>

          <div className="release__info">
            <p className="eyebrow eyebrow--lg">
              {t(`releases.kind.${release.kind}`)}
            </p>
            <h1>{release.title}</h1>

            {out ? (
              <p className="release__date">
                {t('releases.outNow')} ·{' '}
                {formatReleaseDate(release.date, locale)}
              </p>
            ) : (
              <p className="release__date">
                <span className="badge badge--upcoming">
                  {t('releases.upcoming')}
                </span>{' '}
                {t('releases.available', {
                  date: formatReleaseDate(release.date, locale),
                })}
              </p>
            )}

            {out && release.spotifyAlbumId && (
              <SpotifyEmbed
                type="album"
                id={release.spotifyAlbumId}
                title={t('releases.playerTitle', { title: release.title })}
              />
            )}
          </div>
        </div>

        {release.lyrics && (
          <details className="lyrics">
            <summary className="lyrics__toggle">{t('releases.lyrics')}</summary>
            <p className="lyrics__body">{release.lyrics}</p>
          </details>
        )}
      </main>
    </>
  )
}
