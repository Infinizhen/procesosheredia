import { useTranslation } from 'react-i18next'
import { emailHref } from '../lib/contact'

/**
 * Opens the artist's mail client. The address is assembled only on click
 * (`emailHref`), so it never appears in the rendered DOM — keeping it away from
 * email-harvesting bots while staying a normal, keyboard-operable control.
 */
export default function EmailLink() {
  const { t } = useTranslation()
  return (
    <button
      type="button"
      className="email-link"
      onClick={() => {
        window.location.href = emailHref()
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 6.5h18v11H3zM3.5 7l8.5 6 8.5-6"
        />
      </svg>
      {t('footer.email')}
    </button>
  )
}
