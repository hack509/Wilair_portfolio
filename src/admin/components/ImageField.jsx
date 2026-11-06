import { ImagePlus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import FormField from '../../components/forms/FormField'
import { MEDIA_RULES, validateMediaFile } from '../../services/mediaService'

/**
 * Choix d'une image et de son texte alternatif.
 * Le fichier reste dans le formulaire (`value.file`) : il n'est envoyé qu'à l'enregistrement.
 * @param value { url, alt, file? } ou null
 */
export default function ImageField({ id, label, value, onChange }) {
  const [error, setError] = useState('')

  const onFile = (event) => {
    const file = event.target.files[0]
    event.target.value = ''
    if (!file) return

    const invalid = validateMediaFile(file, 'image')
    setError(invalid ?? '')
    if (!invalid) onChange({ url: URL.createObjectURL(file), alt: value?.alt ?? '', file })
  }

  return (
    <fieldset className="admin-media-field">
      <legend className="form-field__label">{label}</legend>
      {value?.url && <img src={value.url} alt="" className="admin-media-field__preview" />}
      <div className="actions">
        <label className="btn btn--outline admin-file-button">
          <ImagePlus size={18} aria-hidden="true" />
          {value?.url ? 'Remplacer' : 'Choisir une image'}
          <input id={id} type="file" accept={MEDIA_RULES.image.accept} className="visually-hidden" onChange={onFile} />
        </label>
        {value?.url && (
          <button type="button" className="admin-icon-button" onClick={() => onChange(null)} aria-label={`Retirer : ${label}`}>
            <Trash2 size={18} aria-hidden="true" />
          </button>
        )}
      </div>
      {error && <p className="form-field__error">{error}</p>}
      {value?.url && (
        <FormField
          id={`${id}-alt`}
          label="Description de l’image"
          hint="Lue par les personnes malvoyantes et les moteurs de recherche."
          value={value.alt ?? ''}
          onChange={(event) => onChange({ ...value, alt: event.target.value })}
        />
      )}
      <p className="form-field__hint">{MEDIA_RULES.image.label}, 10 Mo maximum.</p>
    </fieldset>
  )
}
