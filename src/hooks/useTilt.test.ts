import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTilt } from './useTilt'

/** Drive `window.matchMedia` for a given set of matching queries. */
function mockMatchMedia(matches: (query: string) => boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: matches(query),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia
}

describe('useTilt', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('stays flat and disabled on a coarse pointer (touch)', () => {
    mockMatchMedia(() => false) // neither fine-pointer nor reduced-motion
    const { result } = renderHook(() => useTilt())
    expect(result.current.enabled).toBe(false)
    expect(result.current.handlers).toEqual({})
    expect(result.current.tilt.rx).toBe(0)
    expect(result.current.tilt.ry).toBe(0)
  })

  it('disables the tilt under prefers-reduced-motion', () => {
    mockMatchMedia((q) => q.includes('prefers-reduced-motion'))
    const { result } = renderHook(() => useTilt())
    expect(result.current.enabled).toBe(false)
  })

  it('enables on a fine pointer with motion allowed', () => {
    mockMatchMedia((q) => q.includes('hover'))
    const { result } = renderHook(() => useTilt())
    expect(result.current.enabled).toBe(true)
    expect(result.current.handlers).toHaveProperty('onPointerMove')
  })

  it('produces an opposite-signed rotation from the pointer position', () => {
    mockMatchMedia((q) => q.includes('hover'))
    const { result } = renderHook(() => useTilt())

    // Attach a fake element whose rect we control.
    const el = document.createElement('div')
    el.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 100, height: 100 }) as DOMRect
    result.current.ref.current = el

    act(() => {
      result.current.handlers.onPointerMove?.({
        clientX: 100, // far right
        clientY: 0, // top edge
      } as React.PointerEvent<HTMLElement>)
    })

    // Top edge → top rotates toward viewer → positive rotateX.
    expect(result.current.tilt.rx).toBeGreaterThan(0)
    // Right edge → positive rotateY.
    expect(result.current.tilt.ry).toBeGreaterThan(0)
    expect(result.current.tilt.active).toBe(true)
  })

  it('returns to rest on pointer leave', () => {
    mockMatchMedia((q) => q.includes('hover'))
    const { result } = renderHook(() => useTilt())
    const el = document.createElement('div')
    el.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 100, height: 100 }) as DOMRect
    result.current.ref.current = el

    act(() => {
      result.current.handlers.onPointerMove?.({
        clientX: 90,
        clientY: 90,
      } as React.PointerEvent<HTMLElement>)
    })
    expect(result.current.tilt.active).toBe(true)

    act(() => {
      result.current.handlers.onPointerLeave?.()
    })
    expect(result.current.tilt.active).toBe(false)
    expect(result.current.tilt.rx).toBe(0)
  })
})
