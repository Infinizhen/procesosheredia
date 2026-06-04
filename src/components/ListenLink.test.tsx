import { describe, it, expect, afterAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import i18n from '../i18n/config'
import ListenLink from './ListenLink'

const SMART = 'https://ditto.fm/el-increible-viaje-de-paquita'

// i18n is a singleton across this file; leave it back on the default afterwards.
afterAll(async () => {
  await i18n.changeLanguage('en')
})

describe('ListenLink', () => {
  it('links out to the smart link, opening safely in a new tab', async () => {
    await i18n.changeLanguage('en')
    render(<ListenLink href={SMART} />)
    const link = screen.getByRole('link', { name: /all platforms/i })
    expect(link).toHaveAttribute('href', SMART)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('reads "listen on all platforms"', async () => {
    await i18n.changeLanguage('es')
    render(<ListenLink href={SMART} />)
    expect(
      screen.getByRole('link', { name: /Escuchar en todas las plataformas/i }),
    ).toBeInTheDocument()
  })

  it('folds the new-tab hint into the accessible name', async () => {
    await i18n.changeLanguage('es')
    render(<ListenLink href={SMART} />)
    expect(
      screen.getByRole('link', {
        name: /Escuchar en todas las plataformas .*pestaña nueva/i,
      }),
    ).toBeInTheDocument()
  })
})
