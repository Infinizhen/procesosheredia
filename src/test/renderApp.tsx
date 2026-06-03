import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from '../router'

/**
 * Render the whole app at a given path using an in-memory data router. Mirrors
 * production's `createBrowserRouter` (same `routes`) but lets a test pick the
 * initial URL. The data router is also what makes `useViewTransitionState` — the
 * releases cover morph — available under test (it requires a `RouterProvider`).
 */
export function renderAppAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(<RouterProvider router={router} />)
}
