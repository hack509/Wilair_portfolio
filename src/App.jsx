import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import SiteLayout from './components/layout/SiteLayout'
import ProfileProvider from './context/ProfileProvider'
import RouteError from './pages/RouteError'

// Chaque page est chargée à la demande (code splitting).
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Services = lazy(() => import('./pages/Services'))
const Portfolio = lazy(() => import('./pages/Portfolio'))
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'))
const Career = lazy(() => import('./pages/Career'))
const Skills = lazy(() => import('./pages/Skills'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Les chemins correspondent à ROUTES (src/routes/paths.js).
const router = createBrowserRouter([
  {
    path: '/',
    element: <SiteLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Home /> },
      { path: 'a-propos', element: <About /> },
      { path: 'services', element: <Services /> },
      { path: 'realisations', element: <Portfolio /> },
      { path: 'realisations/:slug', element: <ProjectDetails /> },
      { path: 'parcours', element: <Career /> },
      { path: 'formation-competences', element: <Skills /> },
      { path: 'contact', element: <Contact /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default function App() {
  return (
    <ProfileProvider>
      <RouterProvider router={router} />
    </ProfileProvider>
  )
}
