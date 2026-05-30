import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import Seo from '../components/Seo'
import { DEFAULT_LOCALE, isLocale } from '../i18n/locales'
import {
  formatReleaseDate,
  isReleased,
  releasesByDateDesc,
  RELEASES,
} from '../lib/releases'

/**
 * Releases — a "track-select" stage. Big reactive cover tiles, numbered like a
 * game's level select, newest first. Released tiles open the detail page;
 * upcoming tiles read as "locked". Hover/focus reveals the info overlay; all of
 * it degrades to plain, accessible cards under reduced motion / no hover.
 */
export default function Releases({ now = new Date() }: { now?: Date }) {
  const { t } = useTranslation()
  const { lang } = useParams()
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE

  // Chronological track numbers (oldest = 01), displayed newest-first.
  const order = new Map(
    [...RELEASES]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((r, i) => [r.slug, i + 1]),
  )
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
            const num = String(order.get(r.slug) ?? 0).padStart(2, '0')
            return (
              <li
                key={r.slug}
                className={`tile ${out ? 'tile--out' : 'tile--soon'}`}
              >
                <Link
                  to={`/${locale}/releases/${r.slug}`}
                  className="tile__link"
                >
                  <span className="tile__art">
                    <img
                      src={r.cover}
                      alt={t('releases.coverAlt', { title: r.title })}
                      width="1000"
                      height="1000"
                      loading="lazy"
                    />
                    <span className="tile__num" aria-hidden="true">
                      {num}
                    </span>
                    <span className="tile__scrim" aria-hidden="true" />
                    <span className="tile__cta">
                      {out
                        ? `▸ ${t('releases.viewRelease')}`
                        : formatReleaseDate(r.date, locale)}
                    </span>
                  </span>
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
