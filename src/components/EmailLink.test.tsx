import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import EmailLink from './EmailLink'

describe('EmailLink', () => {
  it('renders a button and keeps the raw address out of the DOM', () => {
    const { container } = render(<EmailLink />)
    expect(screen.getByRole('button')).toBeInTheDocument()
    // Anti-harvest: the address must not be present until the user clicks.
    expect(container.innerHTML).not.toContain('antonio@procesosheredia.com')
    expect(container.innerHTML).not.toContain('mailto:')
  })
})
