import { describe, it, expect, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useScrolled } from './useScrolled'

function setScrollY(y: number) {
  Object.defineProperty(window, 'scrollY', {
    value: y,
    configurable: true,
    writable: true,
  })
}

afterEach(() => {
  setScrollY(0)
  vi.restoreAllMocks()
})

describe('useScrolled', () => {
  it('starts false at the top of the page', () => {
    setScrollY(0)
    const { result } = renderHook(() => useScrolled(8))
    expect(result.current).toBe(false)
  })

  it('initializes true if already scrolled past the threshold on mount', () => {
    setScrollY(120)
    const { result } = renderHook(() => useScrolled(8))
    expect(result.current).toBe(true)
  })

  it('flips to true after scrolling past the threshold', () => {
    setScrollY(0)
    const { result } = renderHook(() => useScrolled(8))
    expect(result.current).toBe(false)
    act(() => {
      setScrollY(40)
      window.dispatchEvent(new Event('scroll'))
    })
    expect(result.current).toBe(true)
  })

  it('flips back to false when scrolled back to the top', () => {
    setScrollY(40)
    const { result } = renderHook(() => useScrolled(8))
    expect(result.current).toBe(true)
    act(() => {
      setScrollY(0)
      window.dispatchEvent(new Event('scroll'))
    })
    expect(result.current).toBe(false)
  })

  it('respects a custom threshold', () => {
    setScrollY(50)
    const { result } = renderHook(() => useScrolled(100))
    expect(result.current).toBe(false) // 50 < 100
    act(() => {
      setScrollY(150)
      window.dispatchEvent(new Event('scroll'))
    })
    expect(result.current).toBe(true)
  })
})
