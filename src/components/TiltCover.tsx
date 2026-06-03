import type { CSSProperties, ReactNode } from 'react'
import { useTilt } from '../hooks/useTilt'

interface TiltCoverProps {
  /** The cover image src. */
  src: string
  /** Accessible alt text for the cover. */
  alt: string
  /** Extra class on the outer (perspective) wrapper. */
  className?: string
  /** Desaturate + dim, for upcoming ("locked") releases. */
  dim?: boolean
  /**
   * When set, names the outer wrapper for a cross-page View Transition, so the
   * cover can morph between the releases grid and the detail hero. Apply it only
   * to the single cover that's transitioning — each snapshot needs a unique name.
   */
  viewTransitionName?: string
  /** Overlaid content (number, scrim, CTA) rendered above the image. */
  children?: ReactNode
}

/**
 * A cover image with a decorative, pointer-following 3D tilt and a glare that
 * tracks the cursor. The motion is progressive enhancement only (see
 * {@link useTilt}): flat on touch and under reduced-motion, and never gates the
 * image or any interactive child. The wrapper itself is not focusable — callers
 * provide their own link/button around or inside it.
 */
export default function TiltCover({
  src,
  alt,
  className = '',
  dim = false,
  viewTransitionName,
  children,
}: TiltCoverProps) {
  const { ref, tilt, handlers, enabled } = useTilt()

  const wrapperStyle = {
    '--rx': `${tilt.rx}deg`,
    '--ry': `${tilt.ry}deg`,
    '--gx': `${tilt.px * 100}%`,
    '--gy': `${tilt.py * 100}%`,
    viewTransitionName,
  } as CSSProperties

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={`tilt ${enabled ? 'tilt--on' : ''} ${tilt.active ? 'is-tilting' : ''} ${className}`}
      style={wrapperStyle}
      {...handlers}
    >
      <div className={`tilt__plane ${dim ? 'tilt__plane--dim' : ''}`}>
        <img src={src} alt={alt} width="1000" height="1000" loading="lazy" />
        <span className="tilt__glare" aria-hidden="true" />
        {children}
      </div>
    </div>
  )
}
