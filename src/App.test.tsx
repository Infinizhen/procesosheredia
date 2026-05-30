import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('i18n routing', () => {
  it('renders Spanish at /es', async () => {
    renderAt('/es')
    expect(
      await screen.findByRole('heading', { name: 'Antonio Procesos Heredia' }),
    ).toBeInTheDocument()
    expect(
      await screen.findByRole('button', { name: 'Escuchar en Spotify' }),
    ).toBeInTheDocument()
  })

  it('renders English at /en', async () => {
    renderAt('/en')
    expect(
      await screen.findByRole('button', { name: 'Listen on Spotify' }),
    ).toBeInTheDocument()
  })

  it('renders Japanese at /ja', async () => {
    renderAt('/ja')
    expect(
      await screen.findByRole('button', { name: 'Spotify で聴く' }),
    ).toBeInTheDocument()
  })

  it('renders the bio page at /es/bio', async () => {
    renderAt('/es/bio')
    expect(
      await screen.findByRole('heading', { name: 'Biografía' }),
    ).toBeInTheDocument()
  })

  it('renders the privacy page at /es/privacy', async () => {
    renderAt('/es/privacy')
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Privacidad y cookies',
      }),
    ).toBeInTheDocument()
  })

  it('shows a 404 for unknown paths under a locale', async () => {
    renderAt('/es/no-existe')
    expect(
      await screen.findByRole('heading', { name: '404' }),
    ).toBeInTheDocument()
  })

  it('redirects "/" to a localized home', async () => {
    renderAt('/')
    expect(
      await screen.findByRole('heading', { name: 'Antonio Procesos Heredia' }),
    ).toBeInTheDocument()
  })

  it('language switcher changes the language', async () => {
    const user = userEvent.setup()
    renderAt('/es')
    expect(
      await screen.findByRole('button', { name: 'Escuchar en Spotify' }),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'English' }))
    expect(
      await screen.findByRole('button', { name: 'Listen on Spotify' }),
    ).toBeInTheDocument()
  })
})
