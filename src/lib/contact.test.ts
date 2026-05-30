import { describe, it, expect } from 'vitest'
import { emailHref } from './contact'

describe('emailHref', () => {
  it('assembles the artist mailto from parts', () => {
    expect(emailHref()).toBe('mailto:antonio@procesosheredia.com')
  })
})
