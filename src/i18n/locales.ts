export const LOCALES = {
  es: { htmlLang: 'es-ES', ogLocale: 'es_ES', label: 'Español' },
  en: { htmlLang: 'en-US', ogLocale: 'en_US', label: 'English' },
  ja: { htmlLang: 'ja', ogLocale: 'ja_JP', label: '日本語' },
} as const

export type LocaleCode = keyof typeof LOCALES

export const LOCALE_CODES = Object.keys(LOCALES) as LocaleCode[]

/** Fallback when the visitor's language can't be detected or isn't supported. */
export const DEFAULT_LOCALE: LocaleCode = 'en'

export function isLocale(value: string | undefined): value is LocaleCode {
  return (
    value !== undefined && Object.prototype.hasOwnProperty.call(LOCALES, value)
  )
}

/** Pick the best supported locale from a preference list (e.g. navigator.languages). */
export function pickLocale(preferences: readonly string[]): LocaleCode {
  for (const pref of preferences) {
    const base = pref.toLowerCase().split('-')[0]
    if (isLocale(base)) return base
  }
  return DEFAULT_LOCALE
}

/** The locale prefix of a URL path (e.g. "/ja/bio" -> "ja"), or null if none. */
export function localeFromPath(pathname: string): LocaleCode | null {
  const segment = pathname.split('/')[1]
  return isLocale(segment) ? segment : null
}
