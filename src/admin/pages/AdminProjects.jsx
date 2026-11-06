import { Archive, ArchiveRestore, Eye, EyeOff, Pencil, Plus, Star, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import AsyncContent from '../../components/common/AsyncContent'
import Button from '../../components/common/Button'
import { EmptyState } from '../../components/common/StateMessages'
import { useAsync } from '../../hooks/useAsync'
import { usePageMeta } from '../../hooks/usePageMeta'
import { ROUTES } from '../../routes/paths'
import { adminListProjects, deleteProject, getCategoryLabel, updateProjectFlags } from '../../services/projectService'
import AdminHeader from '../components/AdminHeader'
import ConfirmDialog from '../components/ConfirmDialog'
import Notice from '../components/Notice'
import StatusBadge from '../components/StatusBadge'
import { useAdminAction, useFlashNotice } from '../hooks'

const FILTERS = [
  { id: 'all', label: 'Toutes', match: (project) => !project.isArchived },
  { id: 'published', label: 'Publiées', match: (project) => project.isPublished && !project.isArchived },
  { id: 'draft', label: 'Brouillons', match: (project) => !project.isPublished && !project.isArchived },
  { id: 'archived', label: 'Archivées', match: (project) => project.isArchived },
]

export default function AdminProjects() {
  usePageMeta({ title: 'Réalisations' })
  const projectsState = useAsync(adminListProjects, [])
  const { notice, busy, run } = useAdminAction(projectsState.reload)
  const flash = useFlashNotice()
  const [filter, setFilter] = useState('all')
  const [toDelete, setToDelete] = useState(null)

  const { match } = FILTERS.find((item) => item.id === filter)
  const message = notice ?? (flash && { type: 'success', text: flash })

  const confirmDelete = () => {
    const project = toDelete
    setToDelete(null)
    run(() => deleteProject(project), `« ${project.title} » a été supprimée.`)
  }

  return (
    <>
      <AdminHeader title="Réalisations" intro="Les réalisations publiées apparaissent automatiquement dans la galerie.">
        <Button to={ROUTES.admin.newProject} icon={Plus} iconPosition="start">
          Nouvelle réalisation
        </Button>
      </AdminHeader>

      {message && <Notice type={message.type}>{message.text}</Notice>}

      <div className="filter" role="group" aria-label="Filtrer par statut">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`filter__button ${filter === item.id ? 'is-active' : ''}`}
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <AsyncContent
        {...projectsState}
        isEmpty={(projects) => !projects || projects.filter(match).length === 0}
        empty={<EmptyState title="Aucune réalisation ici" message="Ajoutez votre première réalisation pour la publier dans la galerie." />}
      >
        {(projects) => (
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Réalisation</th>
                <th scope="col">Catégorie</th>
                <th scope="col">Statut</th>
                <th scope="col">
                  <span className="visually-hidden">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.filter(match).map((project) => (
                <tr key={project.id}>
                  <td data-label="Réalisation">
                    <div className="admin-table__title">
                      {project.coverImage?.url && <img src={project.coverImage.url} alt="" className="admin-table__thumb" loading="lazy" />}
                      <Link to={ROUTES.admin.project(project.id)}>{project.title}</Link>
                      {project.isFeatured && <Star size={14} aria-label="Mise en avant" fill="currentColor" className="admin-star" />}
                    </div>
                  </td>
                  <td data-label="Catégorie">{getCategoryLabel(project.category)}</td>
                  <td data-label="Statut">
                    <StatusBadge isPublished={project.isPublished} isArchived={project.isArchived} />
                  </td>
                  <td className="admin-table__actions">
                    <Link to={ROUTES.admin.project(project.id)} className="admin-icon-button" aria-label={`Modifier ${project.title}`} title="Modifier">
                      <Pencil size={16} aria-hidden="true" />
                    </Link>
                    <button
                      type="button"
                      className="admin-icon-button"
                      disabled={busy}
                      title={project.isPublished ? 'Repasser en brouillon' : 'Publier'}
                      aria-label={`${project.isPublished ? 'Repasser en brouillon' : 'Publier'} : ${project.title}`}
                      onClick={() =>
                        run(
                          () => updateProjectFlags(project.id, { isPublished: !project.isPublished }),
                          project.isPublished ? `« ${project.title} » est repassée en brouillon.` : `« ${project.title} » est publiée.`,
                        )
                      }
                    >
                      {project.isPublished ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                    </button>
                    <button
                      type="button"
                      className="admin-icon-button"
                      disabled={busy}
                      title={project.isArchived ? 'Restaurer' : 'Archiver'}
                      aria-label={`${project.isArchived ? 'Restaurer' : 'Archiver'} : ${project.title}`}
                      onClick={() =>
                        run(
                          () => updateProjectFlags(project.id, { isArchived: !project.isArchived }),
                          project.isArchived ? `« ${project.title} » est restaurée.` : `« ${project.title} » est archivée.`,
                        )
                      }
                    >
                      {project.isArchived ? <ArchiveRestore size={16} aria-hidden="true" /> : <Archive size={16} aria-hidden="true" />}
                    </button>
                    <button
                      type="button"
                      className="admin-icon-button admin-icon-button--danger"
                      disabled={busy}
                      title="Supprimer"
                      aria-label={`Supprimer ${project.title}`}
                      onClick={() => setToDelete(project)}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AsyncContent>

      <ConfirmDialog
        request={
          toDelete && {
            title: 'Supprimer cette réalisation ?',
            message: `« ${toDelete.title} » et tous ses médias seront définitivement supprimés. Pour la retirer du site sans la perdre, archivez-la.`,
          }
        }
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}
