import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import ListenLink from '../components/ListenLink'
import Seo from '../components/Seo'
import SpotifyEmbed from '../components/SpotifyEmbed'
import YouTubeEmbed from '../components/YouTubeEmbed'
import TiltCover from '../components/TiltCover'
import Tracklist from '../components/Tracklist'
import NotFound from './NotFound'
import { DEFAULT_LOCALE, isLocale } from '../i18n/locales'
import { ARTIST_NAME } from '../lib/seo'
import {
  formatReleaseDate,
  getReleaseBySlug,
  releaseJsonLd,
  trackNumber,
} from '../lib/releases'

/**
 * A single release page: a wide, brutalist hero (a large tilting cover beside a
 * big title block) and, below, the lyrics laid out in full — no disclosure.
 * Unknown slugs render 404.
 *
 * The hero cover + track number always carry the `release-cover` / `release-num`
 * View Transition names (there is only ever one cover here), so they morph from —
 * and back to — the matching grid tile when arriving via a `viewTransition` link.
 */
export default function ReleaseDetail() {
  const { t } = useTranslation()
  const { lang, slug } = useParams()
  const navigate = useNavigate()
  const cameFromList =
    (useLocation().state as { from?: string } | null)?.from === 'releases'
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE
  const release = slug ? getReleaseBySlug(slug) : undefined

  if (!release) {
    return <NotFound />
  }

  const num = String(trackNumber(release.slug)).padStart(2, '0')
  const videoTrack = release.tracks?.find((tr) => tr.video)

  return (
    <>
      <Seo
        title={`${release.title} — ${ARTIST_NAME}`}
        description={t('releases.metaDescription', { title: release.title })}
        extraJsonLd={releaseJsonLd(release)}
      />
      <main className="page release">
        <Link
          to={`/${locale}/releases`}
          className="release__back"
          viewTransition
          onClick={(e) => {
            // Came from the grid? Go truly back (POP) so the list scroll is
            // restored and the cover morph lands on the tile we came from. Deep
            // links (no such history) fall through to the link's normal push.
            if (cameFromList) {
              e.preventDefault()
              // A real POP: ScrollRestoration restores the list scroll, and
              // React Router re-applies the cover morph for the reversed
              // viewTransition navigation.
              navigate(-1)
            }
          }}
        >
          ← {t('releases.backToReleases')}
        </Link>

        <section className="release__hero">
          <TiltCover
            className="release__art"
            src={release.cover}
            alt={t('releases.coverAlt', { title: release.title })}
            viewTransitionName="release-cover"
          >
            <span
              className="release__track"
              aria-hidden="true"
              style={{ viewTransitionName: 'release-num' }}
            >
              {num}
            </span>
          </TiltCover>

          <div className="release__info">
            <p className="eyebrow eyebrow--lg">
              {t(`releases.kind.${release.kind}`)}
            </p>
            <h1>{release.title}</h1>

            <p className="release__date">
              {t('releases.outNow')} · {formatReleaseDate(release.date, locale)}
            </p>

            {release.spotifyAlbumId && (
              <SpotifyEmbed
                type="album"
                id={release.spotifyAlbumId}
                title={t('releases.playerTitle', { title: release.title })}
              />
            )}

            {videoTrack?.video && (
              <YouTubeEmbed
                id={videoTrack.video}
                title={t('releases.videoTitle', { title: videoTrack.title })}
              />
            )}

            {release.smartLink && <ListenLink href={release.smartLink} />}
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

        {release.tracks && (
          <section className="lyrics" aria-labelledby="tracks-heading">
            <h2 id="tracks-heading" className="lyrics__heading">
              {t('releases.lyrics')}
            </h2>
            <Tracklist tracks={release.tracks} />
          </section>
        )}
      </main>
    </>
  )
}
