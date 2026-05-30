import { SPOTIFY_URL } from './seo'

export interface SocialLink {
  /** Brand name — used as the accessible label and icon key. */
  name: 'Spotify' | 'Instagram' | 'TikTok'
  href: string
}

/** The artist's profiles, streaming first. */
export const SOCIAL_LINKS: SocialLink[] = [
  { name: 'Spotify', href: SPOTIFY_URL },
  { name: 'Instagram', href: 'https://instagram.com/antonioprocesosheredia' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@antonioprocesosheredia' },
]
