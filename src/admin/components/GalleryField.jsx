import { ArrowDown, ArrowUp, ImagePlus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { MEDIA_RULES, validateMediaFile } from '../../services/mediaService'

// Photographies d'une réalisation : ajout multiple, ordre, description, retrait.
export default function GalleryField({ value, onChange }) {
  const [error, setError] = useState('')

  const onFiles = (event) => {
    const files = [...event.target.files]
    event.target.value = ''
    const rejected = files.map((file) => validateMediaFile(file, 'image') && file.name).filter(Boolean)
    const accepted = files.filter((file) => !validateMediaFile(file, 'image'))

    setError(rejected.length > 0 ? `Fichiers refusés (format ou taille) : ${rejected.join(', ')}` : '')
    onChange([
      ...value,
      ...accepted.map((file) => ({ id: crypto.randomUUID(), url: URL.createObjectURL(file), alt: '', file })),
    ])
  }

  const move = (index, delta) => {
    const next = [...value]
    const [item] = next.splice(index, 1)
    next.splice(index + delta, 0, item)
    onChange(next)
  }

  const update = (id, alt) => onChange(value.map((item) => (item.id === id ? { ...item, alt } : item)))

  return (
    <fieldset className="admin-media-field">
      <legend className="form-field__label">Photographies</legend>
      {value.length > 0 && (
        <ol className="admin-gallery">
          {value.map((item, index) => (
            <li key={item.id} className="admin-gallery__item">
              <img src={item.url} alt="" />
              <label className="visually-hidden" htmlFor={`alt-${item.id}`}>
                Description de la photo {index + 1}
              </label>
              <input
                id={`alt-${item.id}`}
                className="form-field__control"
                placeholder="Description de la photo"
                value={item.alt}
                onChange={(event) => update(item.id, event.target.value)}
              />
              <div className="admin-gallery__actions">
                <button type="button" className="admin-icon-button" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Monter la photo ${index + 1}`}>
                  <ArrowUp size={16} aria-hidden="true" />
                </button>
                <button type="button" className="admin-icon-button" disabled={index === value.length - 1} onClick={() => move(index, 1)} aria-label={`Descendre la photo ${index + 1}`}>
                  <ArrowDown size={16} aria-hidden="true" />
                </button>
                <button type="button" className="admin-icon-button" onClick={() => onChange(value.filter((other) => other.id !== item.id))} aria-label={`Retirer la photo ${index + 1}`}>
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
      <label className="btn btn--outline admin-file-button">
        <ImagePlus size={18} aria-hidden="true" />
        Ajouter des photos
        <input id="gallery-files" type="file" multiple accept={MEDIA_RULES.image.accept} className="visually-hidden" onChange={onFiles} />
      </label>
      {error && <p className="form-field__error">{error}</p>}
      <p className="form-field__hint">{MEDIA_RULES.image.label}, 10 Mo maximum par photo.</p>
    </fieldset>
  )
}
