import { Routes, Route } from 'react-router-dom'
import LangLayout from './routes/LangLayout'
import RootRedirect from './routes/RootRedirect'
import Home from './routes/Home'
import Releases from './routes/Releases'
import ReleaseDetail from './routes/ReleaseDetail'
import Bio from './routes/Bio'
import Privacy from './routes/Privacy'
import NotFound from './routes/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/:lang" element={<LangLayout />}>
        <Route index element={<Home />} />
        <Route path="releases" element={<Releases />} />
        <Route path="releases/:slug" element={<ReleaseDetail />} />
        <Route path="bio" element={<Bio />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
