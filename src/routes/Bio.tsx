import { useTranslation } from 'react-i18next'
import Seo from '../components/Seo'

export default function Bio() {
  const { t } = useTranslation()
  return (
    <>
      <Seo title={t('seo.bio.title')} description={t('seo.bio.description')} />
      <main className="page">
        <h1>{t('bio.heading')}</h1>
      </main>
    </>
  )
}
