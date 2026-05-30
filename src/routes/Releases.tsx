import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import Seo from '../components/Seo'
import TiltCover from '../components/TiltCover'
import { DEFAULT_LOCALE, isLocale } from '../i18n/locales'
import {
  formatReleaseDate,
  isReleased,
  releasesByDateDesc,
  trackNumber,
} from '../lib/releases'

/**
 * Releases — a "track-select" stage. Big cover tiles that tilt in 3D under the
 * pointer, numbered like a game's level select, newest first. Released tiles
 * open the detail page; upcoming tiles read as "locked". The motion is purely
 * decorative (see TiltCover): flat on touch and under reduced motion, and never
 * gates the links, which stay fully keyboard-operable.
 */
export default function Releases({ now = new Date() }: { now?: Date }) {
  const { t } = useTranslation()
  const { lang } = useParams()
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE
  const releases = releasesByDateDesc()

  return (
    <>
      <Seo
        title={t('seo.releases.title')}
        description={t('seo.releases.description')}
      />
      <main className="page releases">
        <header className="releases__head">
          <p className="eyebrow eyebrow--lg">{t('releases.eyebrow')}</p>
          <h1>{t('releases.heading')}</h1>
          <p className="page__lead">{t('releases.intro')}</p>
        </header>

        <ul className="stage">
          {releases.map((r) => {
            const out = isReleased(r, now)
            const num = String(trackNumber(r.slug)).padStart(2, '0')
            return (
              <li
                key={r.slug}
                className={`tile ${out ? 'tile--out' : 'tile--soon'}`}
              >
                <Link
                  to={`/${locale}/releases/${r.slug}`}
                  className="tile__link"
                >
                  <TiltCover
                    className="tile__art"
                    src={r.cover}
                    alt={t('releases.coverAlt', { title: r.title })}
                    dim={!out}
                  >
                    <span className="tile__num" aria-hidden="true">
                      {num}
                    </span>
                    <span className="tile__scrim" aria-hidden="true" />
                    <span className="tile__cta">
                      {out
                        ? `▸ ${t('releases.viewRelease')}`
                        : formatReleaseDate(r.date, locale)}
                    </span>
                  </TiltCover>
                  <span className="tile__meta">
                    <span className="tile__title">{r.title}</span>
                    <span className="tile__date">
                      {out ? (
                        formatReleaseDate(r.date, locale)
                      ) : (
                        <span className="badge badge--upcoming">
                          {t('releases.upcoming')}
                        </span>
                      )}
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </main>
    </>
  )
}
