import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SocialLinks from './SocialLinks'

describe('SocialLinks', () => {
  it('links each profile with an accessible name and safe target', () => {
    render(<SocialLinks />)
    for (const name of ['Spotify', 'Instagram', 'TikTok']) {
      const link = screen.getByRole('link', { name: new RegExp(name, 'i') })
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
      expect(link.getAttribute('href')).toMatch(/^https:\/\//)
    }
  })

  it('points TikTok at the artist handle', () => {
    render(<SocialLinks />)
    expect(
      screen.getByRole('link', { name: /tiktok/i }).getAttribute('href'),
    ).toContain('antonioprocesosheredia')
  })
})
