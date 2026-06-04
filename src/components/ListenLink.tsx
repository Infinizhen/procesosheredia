import { useTranslation } from 'react-i18next'

interface ListenLinkProps {
  /** The release's all-platforms smart link (Ditto). */
  href: string
}

/**
 * A call-to-action link to the release on every platform, via its Ditto smart
 * link. Opens in a new tab, with the new-tab hint folded into the accessible
 * name (same pattern as the footer social links).
 */
export default function ListenLink({ href }: ListenLinkProps) {
  const { t } = useTranslation()
  const label = t('releases.listenAll')
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
