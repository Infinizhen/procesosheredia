import { useTranslation } from 'react-i18next'
import Seo from '../components/Seo'
import SpotifyEmbed from '../components/SpotifyEmbed'
import { ARTIST_NAME } from '../lib/seo'

/**
 * Biography: the artist-name hero, the prose bio, and the artist's Spotify
 * player. Copy lives in i18n (`bio.*`), `body` being an array of paragraphs.
 */
export default function Bio() {
  const { t } = useTranslation()
  const paragraphs = t('bio.body', { returnObjects: true }) as string[]

  return (
    <>
      <Seo title={t('seo.bio.title')} description={t('seo.bio.description')} />
      <main className="page bio">
        <section className="hero">
          <p className="eyebrow eyebrow--lg">{t('bio.eyebrow')}</p>
          <h1 className="hero__name">{ARTIST_NAME}</h1>
          <p className="bio__lead">{t('bio.lead')}</p>
        </section>

        <section className="bio__body">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>

        <section className="music">
          <SpotifyEmbed />
        </section>
      </main>
    </>
  )
}
