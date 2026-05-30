import { Navigate } from 'react-router-dom'
import { pickLocale } from '../i18n/locales'

/**
 * The bare "/" route: detect the visitor's preferred language and redirect to the
 * matching "/:lang". Falls back to DEFAULT_LOCALE (English) when undetectable.
 */
export default function RootRedirect() {
  const preferences =
    typeof navigator !== 'undefined'
      ? (navigator.languages ?? [navigator.language])
      : []
  return <Navigate to={`/${pickLocale(preferences)}`} replace />
}
