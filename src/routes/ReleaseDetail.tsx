import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import Seo from '../components/Seo'
import SpotifyEmbed from '../components/SpotifyEmbed'
import TiltCover from '../components/TiltCover'
import NotFound from './NotFound'
import { DEFAULT_LOCALE, isLocale } from '../i18n/locales'
import { ARTIST_NAME } from '../lib/seo'
import {
  formatReleaseDate,
  getReleaseBySlug,
  isReleased,
  releaseJsonLd,
  trackNumber,
} from '../lib/releases'

/**
 * A single release page: a wide, brutalist hero (a large tilting cover beside a
 * big title block) and, below, the lyrics laid out in full — no disclosure.
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
  const num = String(trackNumber(release.slug)).padStart(2, '0')

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

        <section className="release__hero">
          <TiltCover
            className="release__art"
            src={release.cover}
            alt={t('releases.coverAlt', { title: release.title })}
            dim={!out}
          >
            <span className="release__track" aria-hidden="true">
              {num}
            </span>
          </TiltCover>

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
              <p className="release__date release__date--soon">
                <span className="badge badge--upcoming">
                  {t('releases.upcoming')}
                </span>
                <span className="release__available">
                  {t('releases.available', {
                    date: formatReleaseDate(release.date, locale),
                  })}
                </span>
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
        </section>

        {release.lyrics && (
          <section className="lyrics" aria-labelledby="lyrics-heading">
            <h2 id="lyrics-heading" className="lyrics__heading">
              {t('releases.lyrics')}
            </h2>
            <p className="lyrics__body">{release.lyrics}</p>
          </section>
        )}
      </main>
    </>
  )
}
