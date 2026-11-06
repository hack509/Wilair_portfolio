import { AudioLines, Images, Plus, UserRound } from 'lucide-react'
import { Link } from 'react-router'
import AsyncContent from '../../components/common/AsyncContent'
import Button from '../../components/common/Button'
import { useAsync } from '../../hooks/useAsync'
import { usePageMeta } from '../../hooks/usePageMeta'
import { ROUTES } from '../../routes/paths'
import { getDashboard } from '../../services/dashboardService'
import { formatDateTime } from '../../utils/format'
import AdminHeader from '../components/AdminHeader'

const KINDS = {
  project: { label: 'Réalisation', url: ROUTES.admin.project },
  audio: { label: 'Audio', url: ROUTES.admin.audioTrack },
  service: { label: 'Service', url: ROUTES.admin.service },
}

function Stat({ label, value, detail, to }) {
  return (
    <Link to={to} className="admin-stat">
      <span className="admin-stat__value">{value}</span>
      <span className="admin-stat__label">{label}</span>
      {detail && <span className="form-field__hint">{detail}</span>}
    </Link>
  )
}

export default function AdminDashboard() {
  usePageMeta({ title: 'Tableau de bord' })
  const dashboardState = useAsync(getDashboard, [])

  return (
    <>
      <AdminHeader title="Tableau de bord">
        <Button to={ROUTES.admin.newProject} icon={Plus} iconPosition="start">
          Nouvelle réalisation
        </Button>
        <Button to={ROUTES.admin.newAudio} variant="outline" icon={AudioLines} iconPosition="start">
          Nouvel audio
        </Button>
      </AdminHeader>

      <AsyncContent {...dashboardState}>
        {(data) => (
          <div className="stack-lg">
            <div className="admin-stats">
              <Stat label="Réalisations" value={data.projects} detail={`${data.publishedProjects} publiée(s)`} to={ROUTES.admin.projects} />
              <Stat label="Audios" value={data.audioTracks} to={ROUTES.admin.audio} />
              <Stat label="Services" value={data.services} to={ROUTES.admin.services} />
              <Stat label="Messages" value={data.messages} detail={`${data.unreadMessages} non lu(s)`} to={ROUTES.admin.messages} />
            </div>

            <section aria-labelledby="latest-title">
              <h2 id="latest-title" className="section-title">
                Dernières modifications
              </h2>
              {data.latest.length === 0 ? (
                <p className="muted">Aucun contenu pour le moment.</p>
              ) : (
                <ul className="admin-latest">
                  {data.latest.map((item) => (
                    <li key={`${item.kind}-${item.id}`}>
                      <Link to={KINDS[item.kind].url(item.id)} className="text-link">
                        {item.title}
                      </Link>
                      <span className="muted">
                        {KINDS[item.kind].label} · {formatDateTime(item.updatedAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section aria-labelledby="shortcuts-title">
              <h2 id="shortcuts-title" className="section-title">
                Accès rapides
              </h2>
              <div className="actions">
                <Button to={ROUTES.admin.projects} variant="outline" icon={Images} iconPosition="start">
                  Gérer les réalisations
                </Button>
                <Button to={ROUTES.admin.profile} variant="outline" icon={UserRound} iconPosition="start">
                  Modifier le profil
                </Button>
              </div>
            </section>
          </div>
        )}
      </AsyncContent>
    </>
  )
}
