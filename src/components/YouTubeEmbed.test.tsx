import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import YouTubeEmbed from './YouTubeEmbed'

describe('YouTubeEmbed', () => {
  it('shows an opt-in button and no iframe until activated', () => {
    const { container } = render(
      <YouTubeEmbed id="TqU2PzJXtEc" title="Video: Ishtar" />,
    )
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(container.querySelector('iframe')).toBeNull()
  })

  it('loads a privacy-friendly (nocookie) iframe once clicked', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <YouTubeEmbed id="TqU2PzJXtEc" title="Video: Ishtar" />,
    )
    await user.click(screen.getByRole('button'))

    const iframe = container.querySelector('iframe')
    expect(iframe?.getAttribute('src')).toContain(
      'youtube-nocookie.com/embed/TqU2PzJXtEc',
    )
    expect(iframe?.getAttribute('title')).toBe('Video: Ishtar')
  })

  it('brands the facade as YouTube', () => {
    render(<YouTubeEmbed id="x" title="t" />)
    expect(screen.getByRole('button')).toHaveTextContent(/YouTube/i)
  })
})
