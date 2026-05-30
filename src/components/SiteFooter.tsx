import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SocialLinks from './SocialLinks'
import EmailLink from './EmailLink'
import { ARTIST_NAME } from '../lib/seo'
import { DEFAULT_LOCALE, isLocale } from '../i18n/locales'

export default function SiteFooter() {
  const { t } = useTranslation()
  const { lang } = useParams()
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE

  return (
    <footer className="site-footer">
      <SocialLinks />
      <EmailLink />
      <p className="site-footer__credit">
        <Link to={`/${locale}/privacy`} className="site-footer__legal">
          {t('footer.privacy')}
        </Link>
        <span aria-hidden="true"> · </span>© {new Date().getFullYear()}{' '}
        {ARTIST_NAME}
      </p>
    </footer>
  )
}
