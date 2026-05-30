import { describe, it, expect } from 'vitest'
import {
  createGarden,
  seedCell,
  seedBrush,
  seedRandom,
  advance,
  spread,
  clearGarden,
  cellAge,
  isAlive,
  livingCount,
  fertile,
  phaseSpeed,
  BIRTH_AGE,
  PHASE,
  type Garden,
} from './garden'

function freshGarden(): Garden {
  return createGarden({ cols: 8, rows: 6, seed: 1 })
}

describe('garden — continuous-age model', () => {
  it('creates empty soil of the requested size', () => {
    const g = freshGarden()
    expect(g.cols).toBe(8)
    expect(g.rows).toBe(6)
    expect(g.age).toHaveLength(48)
    expect(livingCount(g)).toBe(0)
    expect(g.age.every((a) => a === 0)).toBe(true)
  })

  it('seeds a cell at a clamped coordinate', () => {
    const g = freshGarden()
    seedCell(g, 2, 3)
    expect(cellAge(g, 2, 3)).toBeCloseTo(BIRTH_AGE)
    expect(isAlive(g, 2, 3)).toBe(true)
    expect(livingCount(g)).toBe(1)
    expect(() => seedCell(g, -1, 99)).not.toThrow()
    expect(livingCount(g)).toBe(1)
  })

  it('seedBrush plants a little round cluster', () => {
    const g = freshGarden()
    seedBrush(g, 4, 3, 1)
    // A radius-1 disc = the centre + 4 orthogonal neighbours = 5 cells.
    expect(livingCount(g)).toBe(5)
  })

  it('advance ages a lily continuously and eventually clears it', () => {
    const g = freshGarden()
    seedCell(g, 4, 3)
    const a0 = cellAge(g, 4, 3)
    advance(g, 0.1)
    expect(cellAge(g, 4, 3)).toBeGreaterThan(a0) // it grew
    // Run a long while: a lily's life is finite — it returns to soil.
    for (let i = 0; i < 400; i++) advance(g, 0.05)
    expect(cellAge(g, 4, 3)).toBe(0)
  })

  it('phase speeds are non-uniform (birth & bleed fast, growth & drip slow)', () => {
    const birth = phaseSpeed(PHASE.BIRTH / 2)
    const growth = phaseSpeed((PHASE.BIRTH + PHASE.GROWTH) / 2)
    const bleed = phaseSpeed((PHASE.GROWTH + PHASE.BLEED) / 2)
    const drip = phaseSpeed((PHASE.BLEED + 1) / 2)
    expect(birth).toBeGreaterThan(growth)
    expect(bleed).toBeGreaterThan(growth)
    expect(bleed).toBeGreaterThan(drip)
  })

  it('marks the fertile window and excludes the very young / nearly dead', () => {
    expect(fertile(BIRTH_AGE)).toBe(false) // too young
    expect(fertile(0.4)).toBe(true) // mid-life
    expect(fertile(0.95)).toBe(false) // nearly ash
  })

  it('spread germinates new lilies next to a fertile cluster', () => {
    const g = createGarden({ cols: 16, rows: 16, seed: 9 })
    // A 2×2 block, all set mid-life so they're fertile.
    for (const [x, y] of [
      [7, 7],
      [8, 7],
      [7, 8],
      [8, 8],
    ])
      g.age[y * g.cols + x] = 0.4
    const before = livingCount(g)
    spread(g)
    expect(livingCount(g)).toBeGreaterThan(before) // it spread
    expect(g.generation).toBe(1)
  })

  it('the crowd brake keeps long-run density from saturating', () => {
    // Left to run, the garden must not fill into a solid blob: the anti-crowding
    // rule should hold occupancy well under "everything alive".
    const g = createGarden({ cols: 40, rows: 30, seed: 4 })
    seedRandom(g, 0.05)
    for (let i = 0; i < 120; i++) {
      spread(g)
      advance(g, 0.18) // age cells so they cycle and free up space
    }
    const occupancy = livingCount(g) / (40 * 30)
    expect(occupancy).toBeLessThan(0.6) // never a saturated carpet
  })

  it('a single isolated lily never spreads', () => {
    const g = createGarden({ cols: 12, rows: 12, seed: 7 })
    g.age[5 * 12 + 5] = 0.4 // one fertile cell, alone
    spread(g)
    expect(livingCount(g)).toBe(1)
  })

  it('spread is deterministic for a given seed', () => {
    const mk = () => {
      const g = createGarden({ cols: 12, rows: 12, seed: 42 })
      seedRandom(g, 0.3)
      return g
    }
    const a = mk()
    const b = mk()
    for (let i = 0; i < 5; i++) {
      spread(a)
      spread(b)
    }
    expect(Array.from(a.age)).toEqual(Array.from(b.age))
  })

  it('seedRandom fills roughly the requested density, at mixed ages', () => {
    const g = createGarden({ cols: 20, rows: 20, seed: 3 })
    seedRandom(g, 0.25)
    const ratio = livingCount(g) / 400
    expect(ratio).toBeGreaterThan(0.1)
    expect(ratio).toBeLessThan(0.4)
    // Mixed ages, not all just-born.
    const ages = new Set(Array.from(g.age).filter((a) => a > 0))
    expect(ages.size).toBeGreaterThan(5)
  })

  it('clearGarden empties every cell and resets the generation', () => {
    const g = freshGarden()
    seedRandom(g, 0.5)
    spread(g)
    expect(livingCount(g)).toBeGreaterThan(0)
    clearGarden(g)
    expect(livingCount(g)).toBe(0)
    expect(g.generation).toBe(0)
  })
})
