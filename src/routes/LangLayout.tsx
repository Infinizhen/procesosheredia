import { useEffect } from 'react'
import { Link, NavLink, Navigate, Outlet, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DEFAULT_LOCALE, LOCALES, isLocale } from '../i18n/locales'
import { ARTIST_NAME } from '../lib/seo'
import LanguageSwitcher from '../components/LanguageSwitcher'
import SiteFooter from '../components/SiteFooter'

export default function LangLayout() {
  const { lang } = useParams()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    if (isLocale(lang)) {
      void i18n.changeLanguage(lang)
      document.documentElement.lang = LOCALES[lang].htmlLang
    }
  }, [lang, i18n])

  if (!isLocale(lang)) {
    return <Navigate to={`/${DEFAULT_LOCALE}`} replace />
  }

  return (
    <div className="app">
      <header className="site-header">
        <Link to={`/${lang}`} className="brand">
          {ARTIST_NAME}
        </Link>
        <nav className="site-nav" aria-label={t('nav.label')}>
          <NavLink
            to={`/${lang}`}
            end
            className={({ isActive }) =>
              isActive ? 'site-nav__link is-active' : 'site-nav__link'
            }
          >
            {t('nav.home')}
          </NavLink>
          <NavLink
            to={`/${lang}/releases`}
            className={({ isActive }) =>
              isActive ? 'site-nav__link is-active' : 'site-nav__link'
            }
          >
            {t('nav.releases')}
          </NavLink>
          <NavLink
            to={`/${lang}/bio`}
            className={({ isActive }) =>
              isActive ? 'site-nav__link is-active' : 'site-nav__link'
            }
          >
            {t('nav.bio')}
          </NavLink>
        </nav>
        <LanguageSwitcher />
      </header>
      <Outlet />
      <SiteFooter />
    </div>
  )
}
