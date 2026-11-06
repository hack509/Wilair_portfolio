import { Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import AsyncContent from '../../components/common/AsyncContent'
import Button from '../../components/common/Button'
import { EmptyState } from '../../components/common/StateMessages'
import { audioCategories } from '../../data/audioData'
import { useAsync } from '../../hooks/useAsync'
import { usePageMeta } from '../../hooks/usePageMeta'
import { ROUTES } from '../../routes/paths'
import { adminListAudioTracks, deleteAudioTrack, updateAudioFlags } from '../../services/audioService'
import { formatDuration } from '../../utils/format'
import AdminHeader from '../components/AdminHeader'
import ConfirmDialog from '../components/ConfirmDialog'
import Notice from '../components/Notice'
import StatusBadge from '../components/StatusBadge'
import { useAdminAction, useFlashNotice } from '../hooks'

const categoryLabel = (slug) => audioCategories.find((item) => item.slug === slug)?.label ?? slug

export default function AdminAudio() {
  usePageMeta({ title: 'Audios' })
  const tracksState = useAsync(adminListAudioTracks, [])
  const { notice, busy, run } = useAdminAction(tracksState.reload)
  const flash = useFlashNotice()
  const [toDelete, setToDelete] = useState(null)
  const message = notice ?? (flash && { type: 'success', text: flash })

  const confirmDelete = () => {
    const track = toDelete
    setToDelete(null)
    run(() => deleteAudioTrack(track), `« ${track.title} » a été supprimé.`)
  }

  return (
    <>
      <AdminHeader title="Audios" intro="Les audios publiés apparaissent automatiquement sur la page Audio.">
        <Button to={ROUTES.admin.newAudio} icon={Plus} iconPosition="start">
          Nouvel audio
        </Button>
      </AdminHeader>

      {message && <Notice type={message.type}>{message.text}</Notice>}

      <AsyncContent {...tracksState} empty={<EmptyState title="Aucun audio" message="Ajoutez votre premier audio pour le publier sur le site." />}>
        {(tracks) => (
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Audio</th>
                <th scope="col">Catégorie</th>
                <th scope="col">Durée</th>
                <th scope="col">Statut</th>
                <th scope="col">
                  <span className="visually-hidden">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((track) => (
                <tr key={track.id}>
                  <td data-label="Audio">
                    <Link to={ROUTES.admin.audioTrack(track.id)}>{track.title}</Link>
                  </td>
                  <td data-label="Catégorie">{categoryLabel(track.category)}</td>
                  <td data-label="Durée">{formatDuration(track.durationSeconds) || '—'}</td>
                  <td data-label="Statut">
                    <StatusBadge isPublished={track.isPublished} />
                  </td>
                  <td className="admin-table__actions">
                    <Link to={ROUTES.admin.audioTrack(track.id)} className="admin-icon-button" aria-label={`Modifier ${track.title}`} title="Modifier">
                      <Pencil size={16} aria-hidden="true" />
                    </Link>
                    <button
                      type="button"
                      className="admin-icon-button"
                      disabled={busy}
                      title={track.isPublished ? 'Repasser en brouillon' : 'Publier'}
                      aria-label={`${track.isPublished ? 'Repasser en brouillon' : 'Publier'} : ${track.title}`}
                      onClick={() =>
                        run(
                          () => updateAudioFlags(track.id, { isPublished: !track.isPublished }),
                          track.isPublished ? `« ${track.title} » est repassé en brouillon.` : `« ${track.title} » est publié.`,
                        )
                      }
                    >
                      {track.isPublished ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                    </button>
                    <button
                      type="button"
                      className="admin-icon-button admin-icon-button--danger"
                      disabled={busy}
                      title="Supprimer"
                      aria-label={`Supprimer ${track.title}`}
                      onClick={() => setToDelete(track)}
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
            title: 'Supprimer cet audio ?',
            message: `« ${toDelete.title} » et son fichier seront définitivement supprimés.`,
          }
        }
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}
