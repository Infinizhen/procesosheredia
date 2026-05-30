import { useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Track } from '../lib/releases'

interface TracklistProps {
  tracks: Track[]
}

/**
 * An interactive "track select" for an EP/album: a numbered list of songs on
 * one side and the selected song's lyrics on the other. Built as an ARIA
 * tablist — each track is a tab, the lyrics area its tabpanel — with a roving
 * tabindex and arrow-key navigation, so it's fully keyboard-operable. Tracks
 * without lyrics are labelled "instrumental".
 */
export default function Tracklist({ tracks }: TracklistProps) {
  const { t } = useTranslation()
  const [active, setActive] = useState(0)
  const baseId = useId()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const focusTab = (i: number) => {
    const clamped = (i + tracks.length) % tracks.length
    setActive(clamped)
    tabRefs.current[clamped]?.focus()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault()
        focusTab(active + 1)
        break
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault()
        focusTab(active - 1)
        break
      case 'Home':
        e.preventDefault()
        focusTab(0)
        break
      case 'End':
        e.preventDefault()
        focusTab(tracks.length - 1)
        break
    }
  }

  const current = tracks[active]
  const tabId = (i: number) => `${baseId}-tab-${i}`
  const panelId = (i: number) => `${baseId}-panel-${i}`

  return (
    <div className="tracklist">
      <ol
        className="tracklist__tabs"
        role="tablist"
        aria-label={t('releases.tracklist')}
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
      >
        {tracks.map((track, i) => {
          const selected = i === active
          const instrumental = !track.lyrics
          return (
            <li
              key={track.title}
              className="tracklist__item"
              role="presentation"
            >
              <button
                type="button"
                role="tab"
                id={tabId(i)}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                aria-selected={selected}
                aria-controls={panelId(i)}
                tabIndex={selected ? 0 : -1}
                className={`tracklist__tab ${selected ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="tracklist__num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="tracklist__name">{track.title}</span>
                {instrumental && (
                  <span className="tracklist__tag">
                    {t('releases.instrumental')}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ol>

      <div
        className="tracklist__panel"
        role="tabpanel"
        id={panelId(active)}
        aria-labelledby={tabId(active)}
        tabIndex={0}
      >
        <p className="tracklist__title">{current.title}</p>
        {current.lyrics ? (
          <p className="tracklist__lyrics">{current.lyrics}</p>
        ) : (
          <p className="tracklist__instrumental">
            {t('releases.instrumentalNote')}
          </p>
        )}
      </div>
    </div>
  )
}
