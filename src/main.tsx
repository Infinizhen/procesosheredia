import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/aguafina-script/400.css'
import '@fontsource/alike/400.css'
import '@fontsource/wallpoet/400.css'
import './index.css'
import i18n from './i18n/config'
import { localeFromPath } from './i18n/locales'
import App from './App.tsx'

// Match i18n to the URL's locale prefix on first load (avoids a flash of the
// fallback language). LangLayout keeps it in sync on client-side navigation.
const initial = localeFromPath(window.location.pathname)
if (initial) void i18n.changeLanguage(initial)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
