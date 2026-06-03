import { createRoutesFromElements, Route } from 'react-router-dom'
import LangLayout from './routes/LangLayout'
import RootRedirect from './routes/RootRedirect'
import Home from './routes/Home'
import Releases from './routes/Releases'
import ReleaseDetail from './routes/ReleaseDetail'
import Bio from './routes/Bio'
import Garden from './routes/Garden'
import Privacy from './routes/Privacy'
import NotFound from './routes/NotFound'

/**
 * The app's route tree. Shared by the production browser router (see App.tsx)
 * and the in-memory router used in tests, so both exercise the exact same routes.
 */
export const routes = createRoutesFromElements(
  <>
    <Route path="/" element={<RootRedirect />} />
    <Route path="/:lang" element={<LangLayout />}>
      <Route index element={<Home />} />
      <Route path="releases" element={<Releases />} />
      <Route path="releases/:slug" element={<ReleaseDetail />} />
      <Route path="bio" element={<Bio />} />
      <Route path="garden" element={<Garden />} />
      <Route path="privacy" element={<Privacy />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </>,
)
