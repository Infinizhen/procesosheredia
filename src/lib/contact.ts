// The contact address is assembled from parts at call time, so the full string
// never appears as a literal in the bundle nor in the static HTML — a basic but
// effective deterrent against email-harvesting bots (which rarely run JS).
const EMAIL_USER = 'antonio'
const EMAIL_DOMAIN = 'procesosheredia.com'

/** The `mailto:` href for the artist's contact address, built at call time. */
export function emailHref(): string {
  return `mailto:${EMAIL_USER}@${EMAIL_DOMAIN}`
}
