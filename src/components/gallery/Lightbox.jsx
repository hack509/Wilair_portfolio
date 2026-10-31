import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useRef } from 'react'

/**
 * Visionneuse plein écran basée sur <dialog> : piège du focus, touche Échap
 * et restitution du focus gérés nativement par le navigateur.
 * Navigation : flèches du clavier, boutons, balayage tactile.
 */
export default function Lightbox({ items, index, onClose, onIndexChange }) {
  const dialogRef = useRef(null)
  const touchStartX = useRef(null)
  const isOpen = index !== null && index >= 0
  const item = isOpen ? items[index] : null
  const hasMany = items.length > 1

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  const go = (delta) => onIndexChange((index + delta + items.length) % items.length)

  const onKeyDown = (event) => {
    if (!hasMany) return
    if (event.key === 'ArrowRight') go(1)
    if (event.key === 'ArrowLeft') go(-1)
  }

  const onTouchEnd = (event) => {
    if (touchStartX.current === null || !hasMany) return
    const deltaX = event.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(deltaX) > 50) go(deltaX < 0 ? 1 : -1)
    touchStartX.current = null
  }

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label="Visionneuse d'images"
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={(event) => event.target === event.currentTarget && onClose()}
      onTouchStart={(event) => (touchStartX.current = event.touches[0].clientX)}
      onTouchEnd={onTouchEnd}
    >
      {item && (
        <>
          <div className="lightbox__bar">
            <p className="lightbox__counter" aria-live="polite">
              {index + 1} / {items.length}
            </p>
            <button type="button" className="icon-btn icon-btn--light" onClick={onClose} aria-label="Fermer la visionneuse" autoFocus>
              <X aria-hidden="true" />
            </button>
          </div>

          <figure className="lightbox__figure" onClick={(event) => event.target === event.currentTarget && onClose()}>
            <img key={item.url} src={item.url} alt={item.alt} className="lightbox__image" />
            {item.alt && <figcaption className="lightbox__caption">{item.alt}</figcaption>}
          </figure>

          {hasMany && (
            <>
              <button type="button" className="icon-btn icon-btn--light lightbox__nav lightbox__nav--prev" onClick={() => go(-1)} aria-label="Image précédente">
                <ChevronLeft aria-hidden="true" />
              </button>
              <button type="button" className="icon-btn icon-btn--light lightbox__nav lightbox__nav--next" onClick={() => go(1)} aria-label="Image suivante">
                <ChevronRight aria-hidden="true" />
              </button>
            </>
          )}
        </>
      )}
    </dialog>
  )
}
