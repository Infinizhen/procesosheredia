import { useTranslation } from 'react-i18next'
import Seo from '../components/Seo'
import SpotifyEmbed from '../components/SpotifyEmbed'
import { ARTIST_NAME } from '../lib/seo'

export default function Home() {
  const { t } = useTranslation()
  return (
    <>
      <Seo
        title={t('seo.home.title')}
        description={t('seo.home.description')}
      />
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
