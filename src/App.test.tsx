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
  it('renders the featured release on the Spanish home', async () => {
    renderAt('/es')
    expect(
      await screen.findByRole('heading', { name: 'Lirios del Apocalipsis' }),
    ).toBeInTheDocument()
    expect(
      await screen.findByRole('button', { name: 'Escuchar en Spotify' }),
    ).toBeInTheDocument()
  })

  it('renders the English home', async () => {
    renderAt('/en')
    expect(
      await screen.findByRole('button', { name: 'Listen on Spotify' }),
    ).toBeInTheDocument()
  })

  it('renders the Japanese home', async () => {
    renderAt('/ja')
    expect(
      await screen.findByRole('button', { name: 'Spotify で聴く' }),
    ).toBeInTheDocument()
  })

  it('renders the releases index at /es/releases', async () => {
    renderAt('/es/releases')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Lanzamientos' }),
    ).toBeInTheDocument()
  })

  it('renders a release detail at /es/releases/:slug', async () => {
    renderAt('/es/releases/lirios-del-apocalipsis')
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Lirios del Apocalipsis',
      }),
    ).toBeInTheDocument()
  })

  it('shows a 404 for an unknown release slug', async () => {
    renderAt('/es/releases/no-existe')
    expect(
      await screen.findByRole('heading', { name: '404' }),
    ).toBeInTheDocument()
  })

  it('renders the bio page (artist hero placeholder) at /es/bio', async () => {
    renderAt('/es/bio')
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Antonio Procesos Heredia',
      }),
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
      await screen.findByRole('heading', { name: 'Lirios del Apocalipsis' }),
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
