import { useTranslation } from 'react-i18next'
import Seo from '../components/Seo'
import { useGarden, SPEEDS } from '../hooks/useGarden'
import {
  PlayIcon,
  PauseIcon,
  SeedIcon,
  ClearIcon,
  FullscreenIcon,
  ExitFullscreenIcon,
} from '../components/GardenIcons'

/**
 * "Jardín de Lilios" — a zen, generative garden of pixel lilies on a canvas.
 * Seed with the pointer and watch them bloom, bleed and wither. No score, no
 * backend; the automaton lives only on this route (see useGarden). noindex —
 * it's a playful corner, not SEO surface.
 */
export default function Garden() {
  const { t, i18n } = useTranslation()
  const {
    canvasRef,
    containerRef,
    running,
    reducedMotion,
    generation,
    living,
    speed,
    setSpeed,
    isFullscreen,
    toggleFullscreen,
    toggleRunning,
    scatter,
    clear,
  } = useGarden()

  // Compact, localized numbers (1, 999, 1.2K, 3.4M…). Keeps the meters readable
  // and — crucially — bounded in width no matter how long the garden runs, so
  // the layout never shifts (a plain counter would overflow 5+ digits after a
  // few hours). The value itself is a JS number, safe to ~9 quadrillion.
  const compact = new Intl.NumberFormat(i18n.language, {
    notation: 'compact',
    maximumFractionDigits: 1,
  })

  return (
    <>
      <Seo title={t('seo.garden.title')} noindex />
      <main className="page garden">
        <header className="garden__head">
          <p className="eyebrow eyebrow--lg">{t('garden.eyebrow')}</p>
          <h1>{t('garden.heading')}</h1>
          <p className="garden__intro">{t('garden.intro')}</p>
        </header>

        <div
          className={`garden__stage ${isFullscreen ? 'is-fullscreen' : ''}`}
          ref={containerRef}
        >
          <canvas
            ref={canvasRef}
            className="garden__canvas"
            role="img"
            aria-label={t('garden.canvasLabel')}
          />

          {/* Live meters, pinned to a corner so they never crowd the controls. */}
          <dl className="garden__meters" aria-live="off">
            <div className="garden__meter">
              <dt>{t('garden.generationLabel')}</dt>
              <dd>{compact.format(generation)}</dd>
            </div>
            <div className="garden__meter">
              <dt>{t('garden.livingLabel')}</dt>
              <dd>{compact.format(living)}</dd>
            </div>
          </dl>

          {/* Floating control bar, video-player style. */}
          <div className="garden__bar">
            {!reducedMotion && (
              <button
                type="button"
                className="iconbtn"
                onClick={toggleRunning}
                aria-pressed={running}
                aria-label={running ? t('garden.pause') : t('garden.play')}
                title={running ? t('garden.pause') : t('garden.play')}
              >
                {running ? <PauseIcon /> : <PlayIcon />}
              </button>
            )}
            <button
              type="button"
              className="iconbtn"
              onClick={scatter}
              aria-label={t('garden.scatter')}
              title={t('garden.scatter')}
            >
              <SeedIcon />
            </button>
            <button
              type="button"
              className="iconbtn"
              onClick={clear}
              aria-label={t('garden.clear')}
              title={t('garden.clear')}
            >
              <ClearIcon />
            </button>

            {!reducedMotion && (
              <div
                className="garden__speed"
                role="radiogroup"
                aria-label={t('garden.speedLabel')}
              >
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={speed === s}
                    className={`chip ${speed === s ? 'is-active' : ''}`}
                    onClick={() => setSpeed(s)}
                  >
                    {s}×
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              className="iconbtn garden__fs"
              onClick={toggleFullscreen}
              aria-pressed={isFullscreen}
              aria-label={
                isFullscreen
                  ? t('garden.exitFullscreen')
                  : t('garden.fullscreen')
              }
              title={
                isFullscreen
                  ? t('garden.exitFullscreen')
                  : t('garden.fullscreen')
              }
            >
              {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
            </button>
          </div>
        </div>

        {reducedMotion && (
          <p className="garden__note">{t('garden.reducedMotion')}</p>
        )}
      </main>
    </>
  )
}
