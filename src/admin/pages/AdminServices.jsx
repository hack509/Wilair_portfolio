import { Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import AsyncContent from '../../components/common/AsyncContent'
import Button from '../../components/common/Button'
import { EmptyState } from '../../components/common/StateMessages'
import { useAsync } from '../../hooks/useAsync'
import { usePageMeta } from '../../hooks/usePageMeta'
import { ROUTES } from '../../routes/paths'
import { adminListServices, deleteService, updateServiceFlags } from '../../services/serviceService'
import AdminHeader from '../components/AdminHeader'
import ConfirmDialog from '../components/ConfirmDialog'
import Notice from '../components/Notice'
import StatusBadge from '../components/StatusBadge'
import { useAdminAction, useFlashNotice } from '../hooks'

export default function AdminServices() {
  usePageMeta({ title: 'Services' })
  const servicesState = useAsync(adminListServices, [])
  const { notice, busy, run } = useAdminAction(servicesState.reload)
  const flash = useFlashNotice()
  const [toDelete, setToDelete] = useState(null)
  const message = notice ?? (flash && { type: 'success', text: flash })

  const confirmDelete = () => {
    const service = toDelete
    setToDelete(null)
    run(() => deleteService(service), `« ${service.title} » a été supprimé.`)
  }

  return (
    <>
      <AdminHeader title="Services" intro="Les services publiés apparaissent automatiquement sur la page Services.">
        <Button to={ROUTES.admin.newService} icon={Plus} iconPosition="start">
          Nouveau service
        </Button>
      </AdminHeader>

      {message && <Notice type={message.type}>{message.text}</Notice>}

      <AsyncContent {...servicesState} empty={<EmptyState title="Aucun service" />}>
        {(services) => (
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Service</th>
                <th scope="col">Ordre</th>
                <th scope="col">Statut</th>
                <th scope="col">
                  <span className="visually-hidden">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td data-label="Service">
                    <Link to={ROUTES.admin.service(service.id)}>{service.title}</Link>
                  </td>
                  <td data-label="Ordre">{service.displayOrder}</td>
                  <td data-label="Statut">
                    <StatusBadge isPublished={service.isPublished} />
                  </td>
                  <td className="admin-table__actions">
                    <Link to={ROUTES.admin.service(service.id)} className="admin-icon-button" aria-label={`Modifier ${service.title}`} title="Modifier">
                      <Pencil size={16} aria-hidden="true" />
                    </Link>
                    <button
                      type="button"
                      className="admin-icon-button"
                      disabled={busy}
                      title={service.isPublished ? 'Désactiver' : 'Publier'}
                      aria-label={`${service.isPublished ? 'Désactiver' : 'Publier'} : ${service.title}`}
                      onClick={() =>
                        run(
                          () => updateServiceFlags(service.id, { isPublished: !service.isPublished }),
                          service.isPublished ? `« ${service.title} » est désactivé.` : `« ${service.title} » est publié.`,
                        )
                      }
                    >
                      {service.isPublished ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                    </button>
                    <button
                      type="button"
                      className="admin-icon-button admin-icon-button--danger"
                      disabled={busy}
                      title="Supprimer"
                      aria-label={`Supprimer ${service.title}`}
                      onClick={() => setToDelete(service)}
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
            title: 'Supprimer ce service ?',
            message: `« ${toDelete.title} » sera définitivement supprimé. Pour le retirer du site sans le perdre, désactivez-le.`,
          }
        }
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}
