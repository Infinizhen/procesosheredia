/**
 * "Jardín de Lirios" — a calm generative garden. Each lily is not a discrete
 * on/off cell but an organism with a *continuous age* in (0, 1]; 0 means empty
 * soil. Age advances every animation frame at a phase-dependent speed, so the
 * colour and motion are a true gradient rather than per-step snapping:
 *
 *   birth (fast)  →  growth (slow)  →  bleed (explosive)  →  drip (slow)  → death
 *
 * Spreading is a separate, discrete "generation" step: empty soil sprouts when
 * enough fertile neighbours surround it, so life ripples outward. Pure logic —
 * no canvas, no Math.random — deterministic given the seed and the dt sequence.
 */

/** Lifecycle phase boundaries on the [0, 1] age axis. */
export const PHASE = {
  BIRTH: 0.1, // 0.00–0.10  a quick flash of white
  GROWTH: 0.45, // 0.10–0.45  a slow swell, white → pink
  BLEED: 0.66, // 0.45–0.66  explosive crimson
  // 0.66–1.00  drip: slow fade to ash
} as const

/** Age a freshly planted seed starts at. */
export const BIRTH_AGE = 0.012

/** Fertile window (in age) during which a lily can seed its neighbours. */
const FERTILE_LO = 0.18
const FERTILE_HI = 0.74

export interface Garden {
  cols: number
  rows: number
  /** Per-cell age: 0 = empty soil; (0, 1] = a living lily progressing to death. */
  age: Float32Array
  /** Discrete spreading generations elapsed. */
  generation: number
  /** Internal RNG state (mutable); seeded for determinism. */
  rng: number
}

export interface GardenOptions {
  cols: number
  rows: number
  seed?: number
}

/** A tiny, fast, seedable PRNG (mulberry32). Deterministic, no Math.random. */
function nextRandom(g: Garden): number {
  g.rng = (g.rng + 0x6d2b79f5) | 0
  let t = g.rng
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export function createGarden({ cols, rows, seed = 1 }: GardenOptions): Garden {
  return {
    cols,
    rows,
    age: new Float32Array(cols * rows),
    generation: 0,
    rng: seed | 0 || 1,
  }
}

const idx = (g: Garden, x: number, y: number) => y * g.cols + x
const inBounds = (g: Garden, x: number, y: number) =>
  x >= 0 && y >= 0 && x < g.cols && y < g.rows

export function cellAge(g: Garden, x: number, y: number): number {
  if (!inBounds(g, x, y)) return 0
  return g.age[idx(g, x, y)]
}

export function isAlive(g: Garden, x: number, y: number): boolean {
  return cellAge(g, x, y) > 0
}

export function livingCount(g: Garden): number {
  let n = 0
  for (let i = 0; i < g.age.length; i++) if (g.age[i] > 0) n++
  return n
}

/**
 * Age units gained per second, by phase. Non-uniform on purpose — this pacing
 * is the heartbeat: lilies appear in a quick flash, grow slowly, burst crimson,
 * then linger as they drip away.
 */
export function phaseSpeed(age: number): number {
  if (age < PHASE.BIRTH) return 0.85 // birth: quick to appear
  if (age < PHASE.GROWTH) return 0.11 // growth: slow swell
  if (age < PHASE.BLEED) return 0.95 // bleed: explosive crimson
  return 0.09 // drip: slow fade to ash
}

/** Whether a lily is in its fertile window (can seed neighbours). */
export function fertile(age: number): boolean {
  return age >= FERTILE_LO && age <= FERTILE_HI
}

/** Plant a seed at (x, y). Out-of-bounds coordinates are ignored. */
export function seedCell(g: Garden, x: number, y: number): void {
  if (!inBounds(g, x, y)) return
  g.age[idx(g, x, y)] = BIRTH_AGE
}

/** Plant a soft round brush of seeds around (x, y) — for pointer painting. */
export function seedBrush(g: Garden, x: number, y: number, radius = 1): void {
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      if (dx * dx + dy * dy <= radius * radius) seedCell(g, x + dx, y + dy)
    }
  }
}

/**
 * Scatter lilies across the grid at roughly `density`, each at a *random age*
 * so the initial garden reads as already-alive (a mix of phases) rather than a
 * uniform field of just-born white.
 */
export function seedRandom(g: Garden, density: number): void {
  for (let i = 0; i < g.age.length; i++) {
    if (g.age[i] === 0 && nextRandom(g) < density) {
      g.age[i] = 0.02 + nextRandom(g) * 0.5
    }
  }
}

export function clearGarden(g: Garden): void {
  g.age.fill(0)
  g.generation = 0
}

/**
 * Advance every living lily's age by `dt` seconds at its phase speed. A lily
 * that reaches the end of its life returns to empty soil. Pure given `dt`.
 */
export function advance(g: Garden, dt: number): void {
  const a = g.age
  for (let i = 0; i < a.length; i++) {
    const age = a[i]
    if (age <= 0) continue
    const na = age + phaseSpeed(age) * dt
    a[i] = na >= 1 ? 0 : na
  }
}

/** Count fertile neighbours (8-neighbourhood) of a cell. */
function fertileNeighbours(g: Garden, x: number, y: number): number {
  let n = 0
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue
      const nx = x + dx
      const ny = y + dy
      if (inBounds(g, nx, ny) && fertile(g.age[idx(g, nx, ny)])) n++
    }
  }
  return n
}

/** Count all living neighbours (any age) — used to throttle overcrowding. */
function livingNeighbours(g: Garden, x: number, y: number): number {
  let n = 0
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue
      const nx = x + dx
      const ny = y + dy
      if (inBounds(g, nx, ny) && g.age[idx(g, nx, ny)] > 0) n++
    }
  }
  return n
}

/**
 * Above this many living neighbours, empty soil is too crowded to germinate.
 * This is the population brake: growth fills open space (the lovely early
 * generations) but stalls in dense areas instead of saturating into a blob.
 */
const CROWD_LIMIT = 4

/**
 * One discrete spreading generation: empty soil with the right number of
 * fertile neighbours sprouts a new seed, so blooms propagate outward — UNLESS
 * the spot is already hemmed in by too many living neighbours (the crowd brake),
 * which keeps the garden from saturating into a uniform blob over time. Three
 * fertile neighbours always germinate; two germinate sometimes (organic, not
 * crystalline).
 */
export function spread(g: Garden): void {
  const a = g.age
  const born: number[] = []
  for (let y = 0; y < g.rows; y++) {
    for (let x = 0; x < g.cols; x++) {
      const i = idx(g, x, y)
      if (a[i] > 0) continue
      if (livingNeighbours(g, x, y) > CROWD_LIMIT) continue // too crowded
      const n = fertileNeighbours(g, x, y)
      if (n === 3 || (n === 2 && nextRandom(g) < 0.32)) born.push(i)
    }
  }
  for (const i of born) a[i] = BIRTH_AGE
  g.generation++
}
