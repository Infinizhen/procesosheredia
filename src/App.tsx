import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './router'

/**
 * The app's data router. We use `createBrowserRouter` (not `<BrowserRouter>`) so
 * React Router can drive the View Transitions API: the per-link `viewTransition`
 * prop and the `useViewTransitionState` hook — used for the releases list↔detail
 * cover morph — are only available under a data `RouterProvider`. The route tree
 * lives in `router.tsx` so tests can mount the same routes via `createMemoryRouter`.
 */
const router = createBrowserRouter(routes)

function App() {
  return <RouterProvider router={router} />
}

export default App
