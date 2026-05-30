import { useTranslation } from 'react-i18next'
import Seo from '../components/Seo'
import SpotifyEmbed from '../components/SpotifyEmbed'
import { ARTIST_NAME } from '../lib/seo'

/**
 * Biography. Placeholder for now: the artist name hero + the artist's Spotify
 * player (what the home page used to be). Real biographical copy lands here later.
 */
export default function Bio() {
  const { t } = useTranslation()
  return (
    <>
      <Seo title={t('seo.bio.title')} description={t('seo.bio.description')} />
      <main className="home">
        <section className="hero">
          <h1 className="hero__name">{ARTIST_NAME}</h1>
        </section>
        <section className="music">
          <SpotifyEmbed />
        </section>
      </main>
    </>
  )
}
