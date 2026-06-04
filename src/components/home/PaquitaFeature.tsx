import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import SpotifyEmbed from '../SpotifyEmbed'
import TiltCover from '../TiltCover'
import type { FeatureProps } from './DefaultFeature'

/**
 * Bespoke home for the "El increíble viaje de Paquita" EP — the "immersive
 * poster" treatment. The warm, painterly cover (which already carries the title)
 * is the glowing hero — and tilts in 3D toward the pointer like the releases (see
 * TiltCover) — with the EP status overlaid like a poster tag and a warm
 * terracotta/gold accent. The EP is treated as released (no "coming soon").
 *
 * Other directions we parked (to switch, swap this component's body):
 *  - "Warm, contained": the default two-column .feature, warm-tinted.
 *  - "Launch landing": this + a tracklist teaser and the Ishtar video hook.
 */
export default function PaquitaFeature({ release, locale }: FeatureProps) {
  const { t } = useTranslation()
  const to = `/${locale}/releases/${release.slug}`

  return (
    <section className="feature-paquita">
      {/* The cover art carries the title visually; keep an accessible h1. */}
      <h1 className="visually-hidden">{release.title}</h1>

      <Link className="feature-paquita__cover" to={to}>
        <TiltCover
          className="feature-paquita__art"
          src={release.cover}
          alt={t('releases.coverAlt', { title: release.title })}
        >
          <span className="feature-paquita__tag">
            {t('releases.kind.ep')} · {t('releases.outNow')}
          </span>
        </TiltCover>
      </Link>

      <div className="feature-paquita__body">
        <p className="feature-paquita__tagline">
          {t('releases.paquita.tagline')}
        </p>
        {release.spotifyAlbumId && (
          <SpotifyEmbed
            type="album"
            id={release.spotifyAlbumId}
            title={t('releases.playerTitle', { title: release.title })}
          />
        )}
        <Link className="feature-paquita__cta" to={to}>
          {t('releases.paquita.cta')} →
        </Link>
      </div>
    </section>
  )
}
