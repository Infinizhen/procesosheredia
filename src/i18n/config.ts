import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { DEFAULT_LOCALE, LOCALE_CODES } from './locales'
import es from './resources/es'
import en from './resources/en'
import ja from './resources/ja'

void i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
    ja: { translation: ja },
  },
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: LOCALE_CODES,
  interpolation: { escapeValue: false },
})

export default i18n
