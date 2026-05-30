import { useCallback, useRef, useState } from 'react'

/** Largest rotation, in degrees, at the very edge of the element. */
const MAX_DEG = 9

interface TiltState {
  rx: number
  ry: number
  /** Pointer position as 0–1 within the element, for a follow-the-cursor glow. */
  px: number
  py: number
  active: boolean
}

const REST: TiltState = { rx: 0, ry: 0, px: 0.5, py: 0.5, active: false }

/**
 * Whether the tilt should engage: a fine, hovering pointer (a mouse, not touch)
 * with motion allowed. Read once at mount — these media states don't change in
 * practice mid-session, and reading them lazily avoids both an SSR crash and a
 * first-paint flash. Safe when `window`/`matchMedia` are absent (SSR/jsdom).
 */
function detectEnabled(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const noReduce = !window.matchMedia('(prefers-reduced-motion: reduce)')
    .matches
  return fine && noReduce
}

/**
 * A decorative 3D "tilt" that follows the pointer: returns a ref to attach to
 * the tilting element plus pointer handlers and the current transform values.
 *
 * Accessibility & progressive enhancement: the tilt is purely visual — it never
 * gates content or focus. It engages only for devices with a fine pointer that
 * has hover (i.e. a mouse, not touch) and is disabled entirely under
 * `prefers-reduced-motion: reduce`. On those, the handlers are no-ops and the
 * element simply renders flat.
 */
export function useTilt() {
  const ref = useRef<HTMLElement | null>(null)
  const [tilt, setTilt] = useState<TiltState>(REST)
  const [enabled] = useState(detectEnabled)

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!enabled) return
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      // Center is (0.5, 0.5); map offset to a rotation. Moving the pointer up
      // tilts the top toward you (positive rotateX), and right tilts right.
      setTilt({
        rx: (0.5 - py) * 2 * MAX_DEG,
        ry: (px - 0.5) * 2 * MAX_DEG,
        px,
        py,
        active: true,
      })
    },
    [enabled],
  )

  const onPointerLeave = useCallback(() => {
    if (!enabled) return
    setTilt(REST)
  }, [enabled])

  return {
    ref,
    enabled,
    tilt,
    handlers: enabled ? { onPointerMove, onPointerLeave } : {},
  }
}
