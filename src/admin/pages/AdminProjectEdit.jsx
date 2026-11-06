import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import AsyncContent from '../../components/common/AsyncContent'
import { EmptyState } from '../../components/common/StateMessages'
import FormField from '../../components/forms/FormField'
import { projectCategories } from '../../data/categoriesData'
import { useAsync } from '../../hooks/useAsync'
import { usePageMeta } from '../../hooks/usePageMeta'
import { ROUTES } from '../../routes/paths'
import { MEDIA_RULES, validateMediaFile } from '../../services/mediaService'
import { adminGetProject, saveProject } from '../../services/projectService'
import { getErrorMessage } from '../../utils/errors'
import { toSlug } from '../../utils/format'
import AdminHeader from '../components/AdminHeader'
import CheckboxField from '../components/CheckboxField'
import FormActions from '../components/FormActions'
import GalleryField from '../components/GalleryField'
import ImageField from '../components/ImageField'
import Notice from '../components/Notice'
import { useFormValues } from '../hooks'
import { validateProject } from '../validation'

const EMPTY_PROJECT = {
  title: '',
  slug: '',
  category: '',
  excerpt: '',
  description: '',
  projectDate: '',
  coverImage: null,
  videoUrl: '',
  videoFile: null,
  media: [],
  isFeatured: false,
  isPublished: false,
  displayOrder: 0,
}

export default function AdminProjectEdit() {
  const { id } = useParams()
  const projectState = useAsync(() => (id ? adminGetProject(id) : Promise.resolve(null)), [id])
  usePageMeta({ title: id ? 'Modifier une réalisation' : 'Nouvelle réalisation' })

  return (
    <>
      <AdminHeader title={id ? 'Modifier la réalisation' : 'Nouvelle réalisation'} />
      <AsyncContent {...projectState} isEmpty={(project) => Boolean(id) && !project} empty={<EmptyState title="Réalisation introuvable" />}>
        {(project) => <ProjectForm key={project?.id ?? 'new'} original={project} />}
      </AsyncContent>
    </>
  )
}

function ProjectForm({ original }) {
  const navigate = useNavigate()
  const { values, set, setValues, errors, setErrors } = useFormValues(() =>
    original
      ? { ...EMPTY_PROJECT, ...original, projectDate: original.projectDate ?? '', videoUrl: original.videoUrl ?? '', videoFile: null }
      : EMPTY_PROJECT,
  )
  const [slugEdited, setSlugEdited] = useState(Boolean(original))
  const [saving, setSaving] = useState(false)
  const [progress, setProgress] = useState('')
  const [submitError, setSubmitError] = useState('')

  const onTitle = (event) => {
    const title = event.target.value
    setValues((current) => ({ ...current, title, slug: slugEdited ? current.slug : toSlug(title) }))
  }

  const onVideoFile = (event) => {
    const file = event.target.files[0]
    event.target.value = ''
    if (!file) return
    const invalid = validateMediaFile(file, 'video')
    setErrors((current) => ({ ...current, videoFile: invalid ?? undefined }))
    if (!invalid) set('videoFile', file)
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validateProject(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      setSubmitError('Le formulaire contient des erreurs.')
      return
    }

    setSaving(true)
    setSubmitError('')
    try {
      const title = values.title.trim()
      await saveProject(
        {
          ...values,
          title,
          coverImage: values.coverImage && { ...values.coverImage, alt: values.coverImage.alt || title },
          media: values.media.map((item) => ({ ...item, alt: item.alt || title })),
          displayOrder: Number(values.displayOrder) || 0,
        },
        original,
        setProgress,
      )
      navigate(ROUTES.admin.projects, { state: { notice: `« ${title} » a été enregistrée.` } })
    } catch (error) {
      setSubmitError(getErrorMessage(error))
      setSaving(false)
      setProgress('')
    }
  }

  return (
    <form className="admin-form" onSubmit={onSubmit} noValidate>
      {submitError && <Notice type="error">{submitError}</Notice>}

      <section className="box stack">
        <FormField id="title" label="Titre" required value={values.title} onChange={onTitle} error={errors.title} />
        <FormField
          id="slug"
          label="Adresse de la page"
          hint={`/realisations/${values.slug || '…'}`}
          required
          value={values.slug}
          error={errors.slug}
          onChange={(event) => {
            setSlugEdited(true)
            set('slug', event.target.value)
          }}
        />
        <div className="form__row">
          <FormField id="category" as="select" label="Catégorie" required value={values.category} onChange={(event) => set('category', event.target.value)} error={errors.category}>
            <option value="">Choisir…</option>
            {projectCategories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.label}
              </option>
            ))}
          </FormField>
          <FormField id="projectDate" type="date" label="Date" value={values.projectDate} onChange={(event) => set('projectDate', event.target.value)} />
        </div>
        <FormField id="excerpt" label="Courte présentation" hint="Une phrase affichée sous le titre." value={values.excerpt} onChange={(event) => set('excerpt', event.target.value)} />
        <FormField id="description" as="textarea" rows={7} label="Description" hint="Séparez les paragraphes par une ligne vide." value={values.description} onChange={(event) => set('description', event.target.value)} />
      </section>

      <section className="box stack">
        <h2 className="section-title">Médias</h2>
        <ImageField id="cover" label="Image de couverture" value={values.coverImage} onChange={(value) => set('coverImage', value)} />
        <GalleryField value={values.media} onChange={(value) => set('media', value)} />

        <fieldset className="admin-media-field">
          <legend className="form-field__label">Vidéo</legend>
          <FormField
            id="videoUrl"
            type="url"
            label="Lien YouTube, Vimeo ou fichier vidéo"
            placeholder="https://"
            value={values.videoFile ? '' : values.videoUrl}
            disabled={Boolean(values.videoFile)}
            onChange={(event) => set('videoUrl', event.target.value)}
            error={errors.videoUrl}
          />
          <div className="actions">
            <label className="btn btn--outline admin-file-button">
              Envoyer un fichier vidéo
              <input id="video-file" type="file" accept={MEDIA_RULES.video.accept} className="visually-hidden" onChange={onVideoFile} />
            </label>
            {values.videoFile && (
              <button type="button" className="text-link admin-link-button" onClick={() => set('videoFile', null)}>
                Retirer {values.videoFile.name}
              </button>
            )}
          </div>
          {errors.videoFile && <p className="form-field__error">{errors.videoFile}</p>}
          <p className="form-field__hint">{MEDIA_RULES.video.label}, 50 Mo maximum. Pour une vidéo plus lourde, utilisez un lien YouTube ou Vimeo.</p>
        </fieldset>
      </section>

      <section className="box stack">
        <h2 className="section-title">Publication</h2>
        <CheckboxField id="isPublished" label="Publier sur le site" hint="Décoché : la réalisation reste en brouillon." checked={values.isPublished} onChange={(value) => set('isPublished', value)} />
        <CheckboxField id="isFeatured" label="Mettre en avant" hint="Affichée en tête de la galerie." checked={values.isFeatured} onChange={(value) => set('isFeatured', value)} />
        <FormField id="displayOrder" type="number" label="Ordre d’affichage" hint="Les petits nombres s’affichent en premier." value={values.displayOrder} onChange={(event) => set('displayOrder', event.target.value)} />
      </section>

      <FormActions saving={saving} progress={progress} cancelTo={ROUTES.admin.projects} />
    </form>
  )
}
