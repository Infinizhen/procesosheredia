import type { ReactNode } from 'react'
import type { LocaleCode } from '../i18n/locales'

/**
 * Small decorative flag for a locale (aria-hidden — the language name carries
 * the meaning). Simplified, recognizable SVGs; no external assets.
 */
export default function Flag({ code }: { code: LocaleCode }) {
  return (
    <svg
      className="flag"
      viewBox="0 0 24 16"
      width="24"
      height="16"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={`flag-rounded-${code}`}>
          <rect width="24" height="16" rx="2.5" />
        </clipPath>
      </defs>
      <g clipPath={`url(#flag-rounded-${code})`}>{flags[code]}</g>
      <rect
        x="0.5"
        y="0.5"
        width="23"
        height="15"
        rx="2.5"
        fill="none"
        stroke="rgba(255,255,255,0.18)"
      />
    </svg>
  )
}

const flags: Record<LocaleCode, ReactNode> = {
  es: (
    <>
      <rect width="24" height="16" fill="#c60b1e" />
      <rect y="4" width="24" height="8" fill="#ffc400" />
    </>
  ),
  en: (
    <>
      <rect width="24" height="16" fill="#b22234" />
      <rect y="2.46" width="24" height="1.23" fill="#fff" />
      <rect y="4.92" width="24" height="1.23" fill="#fff" />
      <rect y="7.38" width="24" height="1.23" fill="#fff" />
      <rect y="9.85" width="24" height="1.23" fill="#fff" />
      <rect y="12.31" width="24" height="1.23" fill="#fff" />
      <rect width="10" height="8.6" fill="#3c3b6e" />
      <g fill="#fff">
        <circle cx="2" cy="2" r="0.7" />
        <circle cx="5" cy="2" r="0.7" />
        <circle cx="8" cy="2" r="0.7" />
        <circle cx="3.5" cy="4.3" r="0.7" />
        <circle cx="6.5" cy="4.3" r="0.7" />
        <circle cx="2" cy="6.6" r="0.7" />
        <circle cx="5" cy="6.6" r="0.7" />
        <circle cx="8" cy="6.6" r="0.7" />
      </g>
    </>
  ),
  ja: (
    <>
      <rect width="24" height="16" fill="#fff" />
      <circle cx="12" cy="8" r="4.3" fill="#bc002d" />
    </>
  ),
}
