import { useEffect, useState } from 'react'

/**
 * Returns `true` once the page has scrolled past `threshold` pixels. Used to
 * give the sticky header a background only after it leaves the very top — so it
 * can sit transparent over the open layout up top, then become legible (its
 * blur/fill fading in) as content scrolls beneath it.
 *
 * SSR/jsdom-safe: reads `window.scrollY` lazily and no-ops without `window`.
 */
export function useScrolled(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.scrollY > threshold
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll() // sync on mount (e.g. restored scroll position)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrolled
}
