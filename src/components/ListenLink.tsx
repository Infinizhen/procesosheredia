import { useTranslation } from 'react-i18next'

interface ListenLinkProps {
  /** The release's all-platforms smart link (Ditto). */
  href: string
  /** Whether the release is already out — picks "listen" vs "pre-save". */
  out: boolean
}

/**
 * A call-to-action link to the release on every platform, via its Ditto smart
 * link. Reads "listen" once the release is out and "pre-save" while it is still
 * upcoming. Opens in a new tab, with the new-tab hint folded into the
 * accessible name (same pattern as the footer social links).
 */
export default function ListenLink({ href, out }: ListenLinkProps) {
  const { t } = useTranslation()
  const label = out ? t('releases.listenAll') : t('releases.presaveAll')
  return (
    <a
      className="platforms-link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} ${t('footer.newTab')}`}
    >
      {label}
    </a>
  )
}
