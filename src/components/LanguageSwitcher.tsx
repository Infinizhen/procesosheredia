import { Link, useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LOCALES, LOCALE_CODES, isLocale } from '../i18n/locales'
import Flag from './Flag'

export default function LanguageSwitcher() {
  const { t } = useTranslation()
  const { lang } = useParams()
  const location = useLocation()

  // The path after the current "/:lang" prefix (e.g. "/bio" or "").
  const rest = isLocale(lang) ? location.pathname.slice(`/${lang}`.length) : ''

  return (
    <nav className="lang" aria-label={t('language.label')}>
      <ul>
        {LOCALE_CODES.map((code) => (
          <li key={code}>
            <Link
              to={`/${code}${rest}`}
              className="lang__btn"
              hrefLang={LOCALES[code].htmlLang}
              aria-current={code === lang ? 'true' : undefined}
            >
              <Flag code={code} />
              <span className="visually-hidden">{LOCALES[code].label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
