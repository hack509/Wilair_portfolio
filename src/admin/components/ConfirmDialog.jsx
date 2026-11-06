import { useEffect, useRef } from 'react'
import Button from '../../components/common/Button'

/**
 * Demande de confirmation avant une action irréversible.
 * @param request { title, message, confirmLabel } pour ouvrir, null pour fermer
 */
export default function ConfirmDialog({ request, onCancel, onConfirm }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (request && !dialog.open) dialog.showModal()
    if (!request && dialog.open) dialog.close()
  }, [request])

  return (
    <dialog ref={dialogRef} className="admin-dialog" onClose={onCancel} aria-labelledby="confirm-title">
      {request && (
        <>
          <h2 id="confirm-title" className="section-title">
            {request.title}
          </h2>
          <p>{request.message}</p>
          <div className="actions">
            <Button variant="outline" onClick={onCancel} autoFocus>
              Annuler
            </Button>
            <Button className="btn--danger" onClick={onConfirm}>
              {request.confirmLabel ?? 'Supprimer'}
            </Button>
          </div>
        </>
      )}
    </dialog>
  )
}
