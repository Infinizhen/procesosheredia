import { useTranslation } from 'react-i18next'
import Seo from '../components/Seo'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <>
      <Seo title={t('seo.notFound.title')} noindex />
      <main className="page">
        <h1 className="page__code">{t('notFound.heading')}</h1>
        <p className="page__lead">{t('notFound.message')}</p>
      </main>
    </>
  )
}
