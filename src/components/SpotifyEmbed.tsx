import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SPOTIFY_EMBED_URL } from '../lib/seo'

function SpotifyGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.59 14.42a.62.62 0 0 1-.86.21c-2.35-1.44-5.3-1.76-8.79-.96a.62.62 0 1 1-.28-1.22c3.81-.87 7.08-.5 9.72 1.11.3.18.39.57.21.86zm1.22-2.72a.78.78 0 0 1-1.07.26c-2.69-1.65-6.79-2.13-9.97-1.17a.78.78 0 1 1-.45-1.49c3.63-1.1 8.15-.57 11.24 1.33.37.22.49.7.25 1.07zm.11-2.84C14.7 8.85 9.39 8.66 6.3 9.6a.94.94 0 1 1-.54-1.79c3.55-1.08 9.42-.87 13.13 1.33.44.26.59.83.33 1.28-.26.44-.83.59-1.28.33z"
      />
    </svg>
  )
}

/**
 * The artist's Spotify player, loaded behind a facade: the heavy, cookie-setting
 * cross-origin iframe mounts only after the user opts in by clicking. Keeps the
 * initial load fast and free of third-party cookies (privacy + Lighthouse), and
 * we still link Spotify from the page's MusicGroup JSON-LD for crawlers.
 */
export default function SpotifyEmbed() {
  const { t } = useTranslation()
  const [loaded, setLoaded] = useState(false)

  if (loaded) {
    return (
      <iframe
        className="spotify-embed"
        title={t('music.playerTitle')}
        src={`${SPOTIFY_EMBED_URL}?utm_source=generator&theme=0`}
        width="100%"
        height="352"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      />
    )
  }

  return (
    <button
      type="button"
      className="spotify-facade"
      onClick={() => setLoaded(true)}
    >
      <SpotifyGlyph />
      {t('music.loadPlayer')}
    </button>
  )
}
