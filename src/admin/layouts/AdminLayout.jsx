import { AudioLines, Briefcase, ExternalLink, Images, LayoutDashboard, LogOut, Mail, UserRound } from 'lucide-react'
import { Suspense } from 'react'
import { Link, Navigate, NavLink, Outlet, ScrollRestoration, useLocation, useNavigate } from 'react-router'
import { ErrorState, Loader } from '../../components/common/StateMessages'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../routes/paths'
import { signOut } from '../../services/authService'

const NAVIGATION = [
  { label: 'Tableau de bord', to: ROUTES.admin.dashboard, icon: LayoutDashboard, end: true },
  { label: 'Réalisations', to: ROUTES.admin.projects, icon: Images },
  { label: 'Audios', to: ROUTES.admin.audio, icon: AudioLines },
  { label: 'Services', to: ROUTES.admin.services, icon: Briefcase },
  { label: 'Profil', to: ROUTES.admin.profile, icon: UserRound },
  { label: 'Messages', to: ROUTES.admin.messages, icon: Mail },
]

// Cadre de l'administration. Redirige vers la connexion si la session n'est pas valide.
export default function AdminLayout() {
  const { status, user, retry } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  if (status === 'loading') return <Loader label="Vérification de la session…" />
  if (status === 'error') {
    return <ErrorState message="Impossible de vérifier votre session." onRetry={retry} />
  }
  if (status !== 'authenticated') {
    return <Navigate to={ROUTES.admin.login} replace state={{ from: location.pathname }} />
  }

  const logout = async () => {
    await signOut()
    navigate(ROUTES.admin.login, { replace: true })
  }

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <Link to={ROUTES.admin.dashboard} className="admin__brand">
          Administration
        </Link>
        <nav aria-label="Administration">
          <ul className="admin__nav">
            {NAVIGATION.map(({ label, to, icon: Icon, end }) => (
              <li key={to}>
                <NavLink to={to} end={end} className="admin__nav-link">
                  <Icon size={18} aria-hidden="true" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="admin__sidebar-footer">
          <p className="admin__user" title={user.email}>
            {user.email}
          </p>
          <a href={ROUTES.home} target="_blank" rel="noopener noreferrer" className="admin__nav-link">
            <ExternalLink size={18} aria-hidden="true" />
            Voir le site
          </a>
          <button type="button" className="admin__nav-link" onClick={logout}>
            <LogOut size={18} aria-hidden="true" />
            Se déconnecter
          </button>
        </div>
      </aside>

      <main className="admin__main">
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </main>
      <ScrollRestoration />
    </div>
  )
}
