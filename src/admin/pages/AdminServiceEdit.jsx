import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import AsyncContent from '../../components/common/AsyncContent'
import { EmptyState } from '../../components/common/StateMessages'
import FormField from '../../components/forms/FormField'
import { useAsync } from '../../hooks/useAsync'
import { usePageMeta } from '../../hooks/usePageMeta'
import { ROUTES } from '../../routes/paths'
import { adminGetService, saveService } from '../../services/serviceService'
import { getErrorMessage } from '../../utils/errors'
import { toSlug } from '../../utils/format'
import AdminHeader from '../components/AdminHeader'
import CheckboxField from '../components/CheckboxField'
import FormActions from '../components/FormActions'
import ImageField from '../components/ImageField'
import LinesField from '../components/LinesField'
import Notice from '../components/Notice'
import { useFormValues } from '../hooks'
import { validateService } from '../validation'

const EMPTY_SERVICE = {
  title: '',
  slug: '',
  description: '',
  items: [],
  image: null,
  isPublished: false,
  displayOrder: 0,
}

export default function AdminServiceEdit() {
  const { id } = useParams()
  const serviceState = useAsync(() => (id ? adminGetService(id) : Promise.resolve(null)), [id])
  usePageMeta({ title: id ? 'Modifier un service' : 'Nouveau service' })

  return (
    <>
      <AdminHeader title={id ? 'Modifier le service' : 'Nouveau service'} />
      <AsyncContent {...serviceState} isEmpty={(service) => Boolean(id) && !service} empty={<EmptyState title="Service introuvable" />}>
        {(service) => <ServiceForm key={service?.id ?? 'new'} original={service} />}
      </AsyncContent>
    </>
  )
}

function ServiceForm({ original }) {
  const navigate = useNavigate()
  const { values, set, setValues, errors, setErrors } = useFormValues(() => original ?? EMPTY_SERVICE)
  const [slugEdited, setSlugEdited] = useState(Boolean(original))
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const onTitle = (event) => {
    const title = event.target.value
    setValues((current) => ({ ...current, title, slug: slugEdited ? current.slug : toSlug(title) }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validateService(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      setSubmitError('Le formulaire contient des erreurs.')
      return
    }

    setSaving(true)
    setSubmitError('')
    try {
      const title = values.title.trim()
      await saveService(
        {
          ...values,
          title,
          image: values.image && { ...values.image, alt: values.image.alt || title },
          displayOrder: Number(values.displayOrder) || 0,
        },
        original,
      )
      navigate(ROUTES.admin.services, { state: { notice: `« ${title} » a été enregistré.` } })
    } catch (error) {
      setSubmitError(getErrorMessage(error))
      setSaving(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={onSubmit} noValidate>
      {submitError && <Notice type="error">{submitError}</Notice>}

      <section className="box stack">
        <FormField id="title" label="Titre" required value={values.title} onChange={onTitle} error={errors.title} />
        <FormField
          id="slug"
          label="Ancre de la page"
          hint={`/services#${values.slug || '…'}`}
          required
          value={values.slug}
          error={errors.slug}
          onChange={(event) => {
            setSlugEdited(true)
            set('slug', event.target.value)
          }}
        />
        <FormField id="description" as="textarea" rows={3} label="Description" value={values.description} onChange={(event) => set('description', event.target.value)} />
        <LinesField id="items" label="Prestations" value={values.items} onChange={(value) => set('items', value)} rows={5} />
        <ImageField id="image" label="Image" value={values.image} onChange={(value) => set('image', value)} />
      </section>

      <section className="box stack">
        <h2 className="section-title">Publication</h2>
        <CheckboxField id="isPublished" label="Publier sur le site" hint="Décoché : le service n’apparaît plus sur le site." checked={values.isPublished} onChange={(value) => set('isPublished', value)} />
        <FormField id="displayOrder" type="number" label="Ordre d’affichage" hint="Les petits nombres s’affichent en premier." value={values.displayOrder} onChange={(event) => set('displayOrder', event.target.value)} />
      </section>

      <FormActions saving={saving} cancelTo={ROUTES.admin.services} />
    </form>
  )
}
