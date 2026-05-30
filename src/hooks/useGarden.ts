import { useCallback, useEffect, useRef, useState } from 'react'
import {
  type Garden,
  advance,
  clearGarden,
  createGarden,
  livingCount,
  seedBrush,
  seedRandom,
  spread,
} from '../lib/garden'

/** Pixel size of one cell. Small = finer grain, twice the lilies per row. */
const CELL_PX = 10
/** Spreading generations per second at the base pace (discrete growth; colour
 *  is continuous). */
const SPREADS_PER_SEC = 2.2
/** Global pace multiplier baked into every preset, so the whole simulation
 *  (ageing AND spreading) scales together. Set so the 1× preset matches what
 *  used to be 2× — the pace that felt most comfortable to watch. */
const BASE_PACE = 2
/** Simulation-speed presets (multipliers). Rendering stays at 60fps regardless;
 *  only how fast the simulation advances per real second changes. 1× is the
 *  comfortable default; 0.5× is slow-mo; 4× rips through generations. */
export const SPEEDS = [0.5, 1, 2, 4] as const
export type Speed = (typeof SPEEDS)[number]
const DEFAULT_SPEED: Speed = 1
/** Initial / scatter density — very sparse, so it reads as a few scattered
 *  sparks that grow outward, not a pre-filled field. (Cells are small now, so a
 *  low fraction is still plenty of seeds in absolute terms.) */
const SCATTER_DENSITY = 0.018
const BG = '#0c0c0e'
/** Per-frame fade veil: dying lilies linger and dissolve instead of snapping. */
const FADE_ALPHA = 0.2

/**
 * Lily colour as a continuous function of age (0→1): a flash of near-white at
 * birth, warming through pink to an explosive crimson bloom, then bleeding down
 * to a dried-maroon drip and finally warm ash. No green — a pure white→red arc.
 */
function lilyColor(age: number): string {
  // Control stops: [age, r, g, b]. Interpolated below.
  const STOPS: [number, number, number, number][] = [
    [0.0, 245, 240, 238], // near-white spark
    [0.1, 240, 205, 210], // blush
    [0.45, 226, 120, 140], // pink swelling
    [0.6, 216, 60, 86], // crimson bloom
    [0.7, 150, 40, 62], // bleeding
    [0.85, 92, 46, 58], // dried maroon drip
    [1.0, 52, 44, 52], // warm ash
  ]
  let lo = STOPS[0]
  let hi = STOPS[STOPS.length - 1]
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (age >= STOPS[i][0] && age <= STOPS[i + 1][0]) {
      lo = STOPS[i]
      hi = STOPS[i + 1]
      break
    }
  }
  const span = hi[0] - lo[0] || 1
  const t = (age - lo[0]) / span
  const r = Math.round(lo[1] + (hi[1] - lo[1]) * t)
  const gc = Math.round(lo[2] + (hi[2] - lo[2]) * t)
  const b = Math.round(lo[3] + (hi[3] - lo[3]) * t)
  return `rgb(${r}, ${gc}, ${b})`
}

/** Glow strength peaks during the crimson bloom (~age 0.55–0.68). */
function bloomGlow(age: number): number {
  if (age < 0.45 || age > 0.72) return 0
  const peak = 0.6
  const d = Math.abs(age - peak) / 0.15
  return Math.max(0, 1 - d)
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    !!window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * A fresh, non-deterministic seed for a new garden — so every page load starts
 * from a different arrangement. (The automaton itself stays deterministic given
 * a seed; we only vary which seed it gets at runtime. Browser-only entropy:
 * crypto when available, else time-based.) Returns a positive 31-bit int.
 */
function freshSeed(): number {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    return crypto.getRandomValues(new Uint32Array(1))[0] % 0x7fffffff || 1
  }
  return (Date.now() ^ (performance.now() * 1000)) & 0x7fffffff || 1
}

/** Mutable-state PRNG step, for the revive jitter (kept off the garden's RNG). */
function jitter(state: { v: number }): number {
  let t = (state.v = (state.v + 0x9e3779b9) | 0)
  t = Math.imul(t ^ (t >>> 16), 0x45d9f3b)
  t = Math.imul(t ^ (t >>> 16), 0x45d9f3b)
  return ((t ^ (t >>> 16)) >>> 0) / 4294967296
}

/** Hard repaint: clear to charcoal and draw all lilies (used for static frames). */
function paint(canvas: HTMLCanvasElement, g: Garden) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.fillStyle = BG
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  drawCells(ctx, g)
}

/** Soft repaint for the loop: a fading veil + redraw, so motion is a dissolve. */
function paintWithTrail(canvas: HTMLCanvasElement, g: Garden) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.fillStyle = `rgba(12, 12, 14, ${FADE_ALPHA})`
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  drawCells(ctx, g)
}

function drawCells(ctx: CanvasRenderingContext2D, g: Garden) {
  for (let y = 0; y < g.rows; y++) {
    for (let x = 0; x < g.cols; x++) {
      const age = g.age[y * g.cols + x]
      if (age <= 0) continue
      const glow = bloomGlow(age)
      if (glow > 0) {
        ctx.shadowColor = `rgba(216, 60, 86, ${0.55 * glow})`
        ctx.shadowBlur = CELL_PX * 1.4 * glow
      } else {
        ctx.shadowBlur = 0
      }
      ctx.fillStyle = lilyColor(age)
      ctx.fillRect(x * CELL_PX, y * CELL_PX, CELL_PX - 1, CELL_PX - 1)
    }
  }
  ctx.shadowBlur = 0
}

interface UseGardenReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  containerRef: React.RefObject<HTMLDivElement | null>
  running: boolean
  reducedMotion: boolean
  generation: number
  living: number
  speed: Speed
  setSpeed: (s: Speed) => void
  isFullscreen: boolean
  toggleFullscreen: () => void
  toggleRunning: () => void
  scatter: () => void
  clear: () => void
}

export function useGarden(): UseGardenReturn {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const gardenRef = useRef<Garden | null>(null)
  const rafRef = useRef<number | null>(null)
  const lastFrameRef = useRef<number>(0)
  const spreadAccRef = useRef<number>(0)
  // Seeded fresh per load → a different opening arrangement every time.
  const seedCounterRef = useRef<number>(freshSeed())
  // Auto-revive bookkeeping: when the garden dies, wait, then re-seed gently.
  const deadForRef = useRef<number>(0)
  const reviveQueueRef = useRef<number>(0)
  const reviveAccRef = useRef<number>(0)
  const jitterRef = useRef<{ v: number }>({ v: 0x1a2b3c })
  // Dormant: the garden is intentionally empty (after Clear). The loop keeps
  // painting (so the fade-out finishes) but neither advances logic nor
  // auto-revives — it waits for the user to plant the first seed.
  const dormantRef = useRef<boolean>(false)
  // Simulation speed multiplier. A ref drives the loop (no loop re-creation on
  // change); the state mirrors it for the UI.
  const speedRef = useRef<Speed>(DEFAULT_SPEED)

  const [reducedMotion] = useState(prefersReducedMotion)
  const [running, setRunning] = useState(() => !prefersReducedMotion())
  const [generation, setGeneration] = useState(0)
  const [living, setLiving] = useState(0)
  const [speed, setSpeedState] = useState<Speed>(DEFAULT_SPEED)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const repaint = useCallback(() => {
    const c = canvasRef.current
    const g = gardenRef.current
    if (c && g) paint(c, g)
  }, [])

  const syncStats = useCallback(() => {
    const g = gardenRef.current
    if (!g) return
    setGeneration(g.generation)
    setLiving(livingCount(g))
  }, [])

  // Build (or rebuild) the garden sized to the current container. Stable
  // callback so both the mount/resize effect and the fullscreen effect share it.
  const setup = useCallback(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const w = container.clientWidth
    // In fullscreen the stage fills the viewport; otherwise it's a capped band.
    const h = document.fullscreenElement
      ? container.clientHeight
      : Math.min(Math.round(w * 0.52), 460)
    const cols = Math.max(8, Math.floor(w / CELL_PX))
    const rows = Math.max(8, Math.floor(h / CELL_PX))
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = cols * CELL_PX * dpr
    canvas.height = rows * CELL_PX * dpr
    canvas.style.width = `${cols * CELL_PX}px`
    canvas.style.height = `${rows * CELL_PX}px`
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const g = createGarden({ cols, rows, seed: seedCounterRef.current })
    seedRandom(g, SCATTER_DENSITY)
    gardenRef.current = g
    dormantRef.current = false
    paint(canvas, g)
    syncStats()
  }, [syncStats])

  // Initial build + rebuild on window resize.
  useEffect(() => {
    setup()
    let resizeRaf = 0
    const onResize = () => {
      cancelAnimationFrame(resizeRaf)
      resizeRaf = requestAnimationFrame(setup)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(resizeRaf)
    }
  }, [setup])

  // The animation loop: age continuously every frame; spread on a slow cadence;
  // auto-revive the garden if it dies out.
  useEffect(() => {
    if (!running || reducedMotion) return
    const spreadInterval = 1 / SPREADS_PER_SEC

    const tick = (now: number) => {
      const g = gardenRef.current
      const canvas = canvasRef.current
      if (g && canvas) {
        const last = lastFrameRef.current || now
        const realDt = Math.min((now - last) / 1000, 0.05) // clamp tab-switch jumps
        lastFrameRef.current = now

        // Dormant (just cleared): keep painting so any trail fades, but don't
        // simulate or auto-revive — wait for the user to plant something.
        if (dormantRef.current) {
          paintWithTrail(canvas, g)
          rafRef.current = requestAnimationFrame(tick)
          return
        }

        // Scale only the SIMULATION time, by the base pace × the chosen preset.
        // The frame itself still runs every rAF tick, so rendering stays at 60fps.
        const dt = realDt * BASE_PACE * speedRef.current

        advance(g, dt) // continuous ageing → smooth colour motion
        spreadAccRef.current += dt
        // Catch up on any whole spread-intervals that fit in this step (so high
        // speeds run more generations without ever skipping the smooth paint).
        while (spreadAccRef.current >= spreadInterval) {
          spreadAccRef.current -= spreadInterval
          spread(g)
        }
        setGeneration(g.generation)

        const alive = livingCount(g)
        setLiving(alive)

        // Auto-revive: if the garden has been empty for ~10 spread-gens, reset
        // the counter and re-seed 1–5 lilies at random spots, one at a time.
        if (alive === 0 && reviveQueueRef.current === 0) {
          deadForRef.current += dt
          if (deadForRef.current >= 10 * spreadInterval) {
            deadForRef.current = 0
            g.generation = 0
            setGeneration(0)
            reviveQueueRef.current =
              1 + Math.floor(jitter(jitterRef.current) * 5)
            reviveAccRef.current = 0
          }
        }
        if (reviveQueueRef.current > 0) {
          reviveAccRef.current += dt
          if (reviveAccRef.current >= 0.32) {
            reviveAccRef.current = 0
            reviveQueueRef.current -= 1
            const rx = Math.floor(jitter(jitterRef.current) * g.cols)
            const ry = Math.floor(jitter(jitterRef.current) * g.rows)
            seedBrush(g, rx, ry, 1)
          }
        }

        paintWithTrail(canvas, g)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [running, reducedMotion])

  // Pointer seeding.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let painting = false
    const plantAt = (clientX: number, clientY: number) => {
      const g = gardenRef.current
      if (!g) return
      const rect = canvas.getBoundingClientRect()
      const x = Math.floor(((clientX - rect.left) / rect.width) * g.cols)
      const y = Math.floor(((clientY - rect.top) / rect.height) * g.rows)
      seedBrush(g, x, y, 1)
      dormantRef.current = false // planting wakes a cleared garden
      if (!running || reducedMotion) {
        paint(canvas, g)
        syncStats()
      }
    }

    const onDown = (e: PointerEvent) => {
      painting = true
      canvas.setPointerCapture(e.pointerId)
      plantAt(e.clientX, e.clientY)
    }
    const onMove = (e: PointerEvent) => {
      if (painting) plantAt(e.clientX, e.clientY)
    }
    const onUp = () => {
      painting = false
    }
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    return () => {
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
    }
  }, [running, reducedMotion, syncStats])

  const toggleRunning = useCallback(() => {
    if (reducedMotion) return
    lastFrameRef.current = 0 // avoid a big dt jump on resume
    setRunning((r) => !r)
  }, [reducedMotion])

  const scatter = useCallback(() => {
    const g = gardenRef.current
    if (!g) return
    g.rng = freshSeed() // a genuinely new arrangement each press
    clearGarden(g)
    seedRandom(g, SCATTER_DENSITY)
    deadForRef.current = 0
    reviveQueueRef.current = 0
    dormantRef.current = false // scattering wakes the garden
    repaint()
    syncStats()
  }, [repaint, syncStats])

  const clear = useCallback(() => {
    const g = gardenRef.current
    if (!g) return
    clearGarden(g)
    deadForRef.current = 0
    reviveQueueRef.current = 0
    dormantRef.current = true // stay empty until the user plants something
    repaint()
    syncStats()
  }, [repaint, syncStats])

  // Fullscreen: request/exit on the stage container. The native API also fires
  // 'fullscreenchange' when the user presses ESC, so we just mirror its state
  // and let the resize handler (driven by that state) re-grid the canvas.
  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    if (document.fullscreenElement) {
      void document.exitFullscreen?.()
    } else {
      void el.requestFullscreen?.()
    }
  }, [])

  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
      // Re-grid to the new size (fullscreen fills the viewport, exit restores
      // the band). rAF lets the layout settle before we measure.
      requestAnimationFrame(setup)
    }
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [setup])

  const setSpeed = useCallback((s: Speed) => {
    speedRef.current = s
    setSpeedState(s)
  }, [])

  return {
    canvasRef,
    containerRef,
    running,
    reducedMotion,
    generation,
    living,
    speed,
    setSpeed,
    isFullscreen,
    toggleFullscreen,
    toggleRunning,
    scatter,
    clear,
  }
}
