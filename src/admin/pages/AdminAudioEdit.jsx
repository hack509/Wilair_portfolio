import { Upload } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import AsyncContent from '../../components/common/AsyncContent'
import { EmptyState } from '../../components/common/StateMessages'
import FormField from '../../components/forms/FormField'
import { audioCategories } from '../../data/audioData'
import { useAsync } from '../../hooks/useAsync'
import { usePageMeta } from '../../hooks/usePageMeta'
import { ROUTES } from '../../routes/paths'
import { adminGetAudioTrack, saveAudioTrack } from '../../services/audioService'
import { MEDIA_RULES, validateMediaFile } from '../../services/mediaService'
import { getErrorMessage } from '../../utils/errors'
import AdminHeader from '../components/AdminHeader'
import CheckboxField from '../components/CheckboxField'
import FormActions from '../components/FormActions'
import Notice from '../components/Notice'
import { useFormValues } from '../hooks'
import { validateAudio } from '../validation'

const EMPTY_TRACK = {
  title: '',
  category: '',
  description: '',
  recordedOn: '',
  audioUrl: '',
  audioFile: null,
  durationSeconds: null,
  isPublished: false,
  displayOrder: 0,
}

// Lit la durée d'un fichier audio ; null si le navigateur ne sait pas la déterminer.
function readDuration(url) {
  return new Promise((resolve) => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audio.onloadedmetadata = () => resolve(Number.isFinite(audio.duration) ? Math.round(audio.duration) : null)
    audio.onerror = () => resolve(null)
    audio.src = url
  })
}

export default function AdminAudioEdit() {
  const { id } = useParams()
  const trackState = useAsync(() => (id ? adminGetAudioTrack(id) : Promise.resolve(null)), [id])
  usePageMeta({ title: id ? 'Modifier un audio' : 'Nouvel audio' })

  return (
    <>
      <AdminHeader title={id ? 'Modifier l’audio' : 'Nouvel audio'} />
      <AsyncContent {...trackState} isEmpty={(track) => Boolean(id) && !track} empty={<EmptyState title="Audio introuvable" />}>
        {(track) => <AudioForm key={track?.id ?? 'new'} original={track} />}
      </AsyncContent>
    </>
  )
}

function AudioForm({ original }) {
  const navigate = useNavigate()
  const { values, set, setValues, errors, setErrors } = useFormValues(() =>
    original ? { ...EMPTY_TRACK, ...original, recordedOn: original.recordedOn ?? '', audioFile: null } : EMPTY_TRACK,
  )
  const [previewUrl, setPreviewUrl] = useState(original?.audioUrl ?? '')
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const onFile = async (event) => {
    const file = event.target.files[0]
    event.target.value = ''
    if (!file) return

    const invalid = validateMediaFile(file, 'audio')
    setErrors((current) => ({ ...current, audioUrl: invalid ?? undefined }))
    if (invalid) return

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    const durationSeconds = await readDuration(url)
    setValues((current) => ({ ...current, audioFile: file, durationSeconds }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validateAudio(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      setSubmitError('Le formulaire contient des erreurs.')
      return
    }

    setSaving(true)
    setSubmitError('')
    try {
      const title = values.title.trim()
      await saveAudioTrack({ ...values, title, displayOrder: Number(values.displayOrder) || 0 }, original)
      navigate(ROUTES.admin.audio, { state: { notice: `« ${title} » a été enregistré.` } })
    } catch (error) {
      setSubmitError(getErrorMessage(error))
      setSaving(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={onSubmit} noValidate>
      {submitError && <Notice type="error">{submitError}</Notice>}

      <section className="box stack">
        <FormField id="title" label="Titre" required value={values.title} onChange={(event) => set('title', event.target.value)} error={errors.title} />
        <div className="form__row">
          <FormField id="category" as="select" label="Catégorie" required value={values.category} onChange={(event) => set('category', event.target.value)} error={errors.category}>
            <option value="">Choisir…</option>
            {audioCategories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.label}
              </option>
            ))}
          </FormField>
          <FormField id="recordedOn" type="date" label="Date" value={values.recordedOn} onChange={(event) => set('recordedOn', event.target.value)} />
        </div>
        <FormField id="description" as="textarea" rows={3} label="Description" value={values.description} onChange={(event) => set('description', event.target.value)} />
      </section>

      <section className="box stack">
        <h2 className="section-title">Fichier audio</h2>
        {previewUrl && <audio src={previewUrl} controls preload="metadata" className="audio-card__player" />}
        <div className="actions">
          <label className="btn btn--outline admin-file-button">
            <Upload size={18} aria-hidden="true" />
            {previewUrl ? 'Remplacer le fichier' : 'Choisir un fichier'}
            <input id="audio-file" type="file" accept={MEDIA_RULES.audio.accept} className="visually-hidden" onChange={onFile} />
          </label>
        </div>
        <p className="form-field__hint">{MEDIA_RULES.audio.label}, 50 Mo maximum.</p>
        <FormField
          id="audioUrl"
          type="url"
          label="Ou lien direct vers un fichier audio"
          placeholder="https://"
          value={values.audioFile ? '' : values.audioUrl}
          disabled={Boolean(values.audioFile)}
          onChange={(event) => {
            set('audioUrl', event.target.value)
            setPreviewUrl(event.target.value)
          }}
          error={errors.audioUrl}
        />
      </section>

      <section className="box stack">
        <h2 className="section-title">Publication</h2>
        <CheckboxField id="isPublished" label="Publier sur le site" hint="Décoché : l’audio reste en brouillon." checked={values.isPublished} onChange={(value) => set('isPublished', value)} />
        <FormField id="displayOrder" type="number" label="Ordre d’affichage" hint="Les petits nombres s’affichent en premier." value={values.displayOrder} onChange={(event) => set('displayOrder', event.target.value)} />
      </section>

      <FormActions saving={saving} progress={saving && values.audioFile ? 'Envoi du fichier…' : ''} cancelTo={ROUTES.admin.audio} />
    </form>
  )
}
