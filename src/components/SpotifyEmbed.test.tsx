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

  it('loads the artist player iframe once clicked (default target)', async () => {
    const user = userEvent.setup()
    const { container } = render(<SpotifyEmbed />)
    await user.click(screen.getByRole('button'))

    const iframe = container.querySelector('iframe')
    expect(iframe?.getAttribute('src')).toContain(
      'open.spotify.com/embed/artist/4f8EtuWyQnq2T8NyZeJ0vn',
    )
    expect(iframe?.getAttribute('title')?.length).toBeTruthy()
  })

  it('loads an album player when given an album target', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <SpotifyEmbed type="album" id="4aYoKShEeyz101xa5KqgPp" />,
    )
    await user.click(screen.getByRole('button'))

    const iframe = container.querySelector('iframe')
    expect(iframe?.getAttribute('src')).toContain(
      'open.spotify.com/embed/album/4aYoKShEeyz101xa5KqgPp',
    )
  })

  it('uses a custom button label and iframe title when provided', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <SpotifyEmbed
        type="album"
        id="abc123"
        label="Play the single"
        title="Spotify player: My Single"
      />,
    )
    const button = screen.getByRole('button', { name: 'Play the single' })
    expect(button).toBeInTheDocument()
    await user.click(button)
    expect(container.querySelector('iframe')?.getAttribute('title')).toBe(
      'Spotify player: My Single',
    )
  })
})
