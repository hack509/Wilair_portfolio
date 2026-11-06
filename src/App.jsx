import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import SiteLayout from './components/layout/SiteLayout'
import { Loader } from './components/common/StateMessages'
import ProfileProvider from './context/ProfileProvider'
import RouteError from './pages/RouteError'
import { ROUTES } from './routes/paths'

// Chaque page est chargée à la demande (code splitting).
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Services = lazy(() => import('./pages/Services'))
const Portfolio = lazy(() => import('./pages/Portfolio'))
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'))
const Audio = lazy(() => import('./pages/Audio'))
const Career = lazy(() => import('./pages/Career'))
const Skills = lazy(() => import('./pages/Skills'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

// L'administration est dans des fichiers séparés : les visiteurs ne les téléchargent jamais.
const AdminRoot = lazy(() => import('./admin/AdminRoot'))
const AdminLayout = lazy(() => import('./admin/layouts/AdminLayout'))
const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'))
const AdminForgotPassword = lazy(() => import('./admin/pages/AdminForgotPassword'))
const AdminResetPassword = lazy(() => import('./admin/pages/AdminResetPassword'))
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'))
const AdminProjects = lazy(() => import('./admin/pages/AdminProjects'))
const AdminProjectEdit = lazy(() => import('./admin/pages/AdminProjectEdit'))
const AdminAudio = lazy(() => import('./admin/pages/AdminAudio'))
const AdminAudioEdit = lazy(() => import('./admin/pages/AdminAudioEdit'))
const AdminServices = lazy(() => import('./admin/pages/AdminServices'))
const AdminServiceEdit = lazy(() => import('./admin/pages/AdminServiceEdit'))
const AdminProfile = lazy(() => import('./admin/pages/AdminProfile'))
const AdminMessages = lazy(() => import('./admin/pages/AdminMessages'))

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
      { path: 'audio', element: <Audio /> },
      { path: 'parcours', element: <Career /> },
      { path: 'formation-competences', element: <Skills /> },
      { path: 'contact', element: <Contact /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <Suspense fallback={<Loader />}>
        <AdminRoot />
      </Suspense>
    ),
    errorElement: <RouteError />,
    children: [
      { path: 'connexion', element: <AdminLogin /> },
      { path: 'mot-de-passe-oublie', element: <AdminForgotPassword /> },
      { path: 'nouveau-mot-de-passe', element: <AdminResetPassword /> },
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'realisations', element: <AdminProjects /> },
          { path: 'realisations/nouvelle', element: <AdminProjectEdit /> },
          { path: 'realisations/:id', element: <AdminProjectEdit /> },
          { path: 'audios', element: <AdminAudio /> },
          { path: 'audios/nouveau', element: <AdminAudioEdit /> },
          { path: 'audios/:id', element: <AdminAudioEdit /> },
          { path: 'services', element: <AdminServices /> },
          { path: 'services/nouveau', element: <AdminServiceEdit /> },
          { path: 'services/:id', element: <AdminServiceEdit /> },
          { path: 'profil', element: <AdminProfile /> },
          { path: 'messages', element: <AdminMessages /> },
          { path: '*', element: <Navigate to={ROUTES.admin.dashboard} replace /> },
        ],
      },
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
