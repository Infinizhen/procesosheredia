import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import Seo from '../components/Seo'
import HomeFeature from '../components/home/HomeFeature'
import { DEFAULT_LOCALE, isLocale } from '../i18n/locales'
import { getFeaturedRelease, releaseJsonLd } from '../lib/releases'

/**
 * Home — a container that spotlights the current featured release. The actual
 * presentation is chosen per release by <HomeFeature> (default: the standard
 * two-column feature), so each release can have its own bespoke home without
 * touching this route. Today the featured single (Lirios) uses the default.
 */
export default function Home() {
  const { t } = useTranslation()
  const { lang } = useParams()
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE
  const featured = getFeaturedRelease()

  return (
    <>
      <Seo
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        extraJsonLd={featured ? releaseJsonLd(featured) : undefined}
      />
      <main className="home">
        {featured && <HomeFeature release={featured} locale={locale} />}
      </main>
    </>
  )
}
