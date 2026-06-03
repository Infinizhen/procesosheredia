import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams, useViewTransitionState } from 'react-router-dom'
import Seo from '../components/Seo'
import TiltCover from '../components/TiltCover'
import { DEFAULT_LOCALE, isLocale, type LocaleCode } from '../i18n/locales'
import {
  formatReleaseDate,
  isReleased,
  releasesByDateDesc,
  trackNumber,
  type Release,
} from '../lib/releases'

/**
 * One stage tile. Pulled into its own component so it can call
 * `useViewTransitionState`: while this tile is the one navigating to (or back
 * from) its detail page, we name its cover + number so the View Transitions API
 * morphs them into the detail hero. Only the transitioning tile is named, so
 * every snapshot keeps a single `release-cover` / `release-num` group.
 */
function ReleaseTile({
  release,
  locale,
  now,
}: {
  release: Release
  locale: LocaleCode
  now: Date
}) {
  const { t } = useTranslation()
  const out = isReleased(release, now)
  const num = String(trackNumber(release.slug)).padStart(2, '0')
  const to = `/${locale}/releases/${release.slug}`
  const morphing = useViewTransitionState(to)
  const numStyle: CSSProperties | undefined = morphing
    ? { viewTransitionName: 'release-num' }
    : undefined

  return (
    <li className={`tile ${out ? 'tile--out' : 'tile--soon'}`}>
      <Link
        to={to}
        className="tile__link"
        viewTransition
        state={{ from: 'releases' }}
      >
        <TiltCover
          className="tile__art"
          src={release.cover}
          alt={t('releases.coverAlt', { title: release.title })}
          dim={!out}
          viewTransitionName={morphing ? 'release-cover' : undefined}
        >
          <span className="tile__num" aria-hidden="true" style={numStyle}>
            {num}
          </span>
          <span className="tile__scrim" aria-hidden="true" />
          <span className="tile__cta">
            {out
              ? `▸ ${t('releases.viewRelease')}`
              : formatReleaseDate(release.date, locale)}
          </span>
        </TiltCover>
        <span className="tile__meta">
          <span className="tile__title">{release.title}</span>
          <span className="tile__date">
            {out ? (
              formatReleaseDate(release.date, locale)
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
}

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
          {releases.map((r) => (
            <ReleaseTile key={r.slug} release={r} locale={locale} now={now} />
          ))}
        </ul>
      </main>
    </>
  )
}
