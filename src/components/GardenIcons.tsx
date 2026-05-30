/**
 * Small inline icons for the garden's floating control bar. All are decorative
 * (`aria-hidden`) — the buttons that use them carry the accessible name.
 */

interface IconProps {
  size?: number
}

function svgProps(size: number) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false,
  }
}

export function PlayIcon({ size = 20 }: IconProps) {
  return (
    <svg {...svgProps(size)}>
      <path d="M7 5l12 7-12 7V5z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function PauseIcon({ size = 20 }: IconProps) {
  return (
    <svg {...svgProps(size)}>
      <rect
        x="6"
        y="5"
        width="4"
        height="14"
        fill="currentColor"
        stroke="none"
      />
      <rect
        x="14"
        y="5"
        width="4"
        height="14"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  )
}

/** "Scatter seeds" — a die-like sprinkle of dots. */
export function SeedIcon({ size = 20 }: IconProps) {
  return (
    <svg {...svgProps(size)}>
      <circle cx="7" cy="7" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="17" cy="6" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="6" cy="16" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="17" cy="17" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** "Clear" — a broom/sweep, drawn as a simple trash to read instantly. */
export function ClearIcon({ size = 20 }: IconProps) {
  return (
    <svg {...svgProps(size)}>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M6 7l1 13h10l1-13" />
    </svg>
  )
}

export function FullscreenIcon({ size = 20 }: IconProps) {
  return (
    <svg {...svgProps(size)}>
      <path d="M4 9V4h5" />
      <path d="M20 9V4h-5" />
      <path d="M4 15v5h5" />
      <path d="M20 15v5h-5" />
    </svg>
  )
}

export function ExitFullscreenIcon({ size = 20 }: IconProps) {
  return (
    <svg {...svgProps(size)}>
      <path d="M9 4v5H4" />
      <path d="M15 4v5h5" />
      <path d="M9 20v-5H4" />
      <path d="M15 20v-5h5" />
    </svg>
  )
}
