import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Tracklist from './Tracklist'
import type { Track } from '../lib/releases'
import i18n from '../i18n/config'

beforeAll(async () => {
  await i18n.changeLanguage('es')
})

const TRACKS: Track[] = [
  { title: 'Conciliación Familiar', lyrics: 'Bailando Keipop' },
  { title: 'Reyertas' }, // instrumental
  { title: 'Ishtar', lyrics: 'Arrebatao de entre mis sueños' },
]

describe('Tracklist', () => {
  it('renders one selectable entry per track, numbered', () => {
    render(<Tracklist tracks={TRACKS} />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(3)
    expect(tabs[0]).toHaveTextContent('Conciliación Familiar')
    expect(tabs[1]).toHaveTextContent('Reyertas')
  })

  it('shows the first track selected by default with its lyrics', () => {
    render(<Tracklist tracks={TRACKS} />)
    const first = screen.getByRole('tab', { name: /Conciliación Familiar/ })
    expect(first).toHaveAttribute('aria-selected', 'true')
    expect(
      screen.getByRole('tabpanel', { name: /Conciliación Familiar/ }),
    ).toHaveTextContent('Bailando Keipop')
  })

  it('switches the shown lyrics when another track is selected', async () => {
    const user = userEvent.setup()
    render(<Tracklist tracks={TRACKS} />)
    await user.click(screen.getByRole('tab', { name: /Ishtar/ }))
    const panel = screen.getByRole('tabpanel', { name: /Ishtar/ })
    expect(panel).toHaveTextContent('Arrebatao de entre mis sueños')
    expect(screen.getByRole('tab', { name: /Ishtar/ })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })

  it('labels an instrumental track and shows no lyrics for it', async () => {
    const user = userEvent.setup()
    render(<Tracklist tracks={TRACKS} />)
    // The Reyertas tab is marked as instrumental…
    const reyertas = screen.getByRole('tab', { name: /Reyertas/ })
    expect(reyertas).toHaveTextContent(/instrumental/i)
    await user.click(reyertas)
    const panel = screen.getByRole('tabpanel', { name: /Reyertas/ })
    expect(within(panel).getByText(/instrumental/i)).toBeInTheDocument()
  })

  it('moves selection with the arrow keys (roving tabindex)', async () => {
    const user = userEvent.setup()
    render(<Tracklist tracks={TRACKS} />)
    const first = screen.getByRole('tab', { name: /Conciliación Familiar/ })
    first.focus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('tab', { name: /Reyertas/ })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })
})
