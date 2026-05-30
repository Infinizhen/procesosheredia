import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SpotifyEmbed from './SpotifyEmbed'

describe('SpotifyEmbed', () => {
  it('shows an opt-in button and no third-party iframe until activated', () => {
    const { container } = render(<SpotifyEmbed />)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(container.querySelector('iframe')).toBeNull()
  })

  it('loads the titled Spotify player iframe once clicked', async () => {
    const user = userEvent.setup()
    const { container } = render(<SpotifyEmbed />)
    await user.click(screen.getByRole('button'))

    const iframe = container.querySelector('iframe')
    expect(iframe?.getAttribute('src')).toContain(
      'open.spotify.com/embed/artist/4f8EtuWyQnq2T8NyZeJ0vn',
    )
    expect(iframe?.getAttribute('title')?.length).toBeTruthy()
  })
})
