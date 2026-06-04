import { useState } from 'react'
import { useTranslation } from 'react-i18next'

function YouTubeGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
      />
    </svg>
  )
}

interface YouTubeEmbedProps {
  /** YouTube video id. */
  id: string
  /** iframe accessible title. */
  title: string
}

/**
 * A YouTube video behind a facade — the same privacy approach as
 * {@link SpotifyEmbed}, and a matching branded pill (YouTube glyph + "Watch on
 * YouTube"). The cookie-setting cross-origin iframe mounts only after the click,
 * via the privacy-enhanced `youtube-nocookie.com` domain.
 */
export default function YouTubeEmbed({ id, title }: YouTubeEmbedProps) {
  const { t } = useTranslation()
  const [loaded, setLoaded] = useState(false)

  if (loaded) {
    return (
      <iframe
        className="youtube-embed"
        title={title}
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
        loading="lazy"
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
      />
    )
  }

  return (
    <button
      type="button"
      className="youtube-facade"
      onClick={() => setLoaded(true)}
    >
      <YouTubeGlyph />
      {t('releases.watchOnYouTube')}
    </button>
  )
}
