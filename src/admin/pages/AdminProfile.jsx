import { useState } from 'react'
import AsyncContent from '../../components/common/AsyncContent'
import FormField from '../../components/forms/FormField'
import { usePageMeta } from '../../hooks/usePageMeta'
import { useProfile } from '../../hooks/useProfile'
import { saveProfile } from '../../services/profileService'
import { getErrorMessage } from '../../utils/errors'
import AdminHeader from '../components/AdminHeader'
import FormActions from '../components/FormActions'
import ImageField from '../components/ImageField'
import LinesField from '../components/LinesField'
import Notice from '../components/Notice'
import RepeaterField from '../components/RepeaterField'
import { useFormValues } from '../hooks'
import { validateProfile } from '../validation'

const PLATFORMS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'x', label: 'X' },
]

const newId = () => crypto.randomUUID()

export default function AdminProfile() {
  usePageMeta({ title: 'Profil' })
  const profileState = useProfile()
  const [notice, setNotice] = useState(null)

  return (
    <>
      <AdminHeader title="Profil" intro="Ces informations alimentent tout le site : accueil, à propos, parcours, formation et contact." />
      {notice && <Notice type={notice.type}>{notice.text}</Notice>}
      <AsyncContent {...profileState}>
        {(profile) => (
          <ProfileForm
            key={profile.updatedAt}
            original={profile}
            onSaved={() => {
              setNotice({ type: 'success', text: 'Le profil a été enregistré.' })
              profileState.reload()
              window.scrollTo({ top: 0 })
            }}
            onError={(text) => {
              setNotice({ type: 'error', text })
              window.scrollTo({ top: 0 })
            }}
          />
        )}
      </AsyncContent>
    </>
  )
}

function ProfileForm({ original, onSaved, onError }) {
  const { values, set, errors, setErrors } = useFormValues(() => ({
    ...original,
    // Les réseaux issus du contenu initial n'ont pas d'identifiant.
    socialLinks: original.socialLinks.map((link) => ({ ...link, id: link.id ?? newId() })),
  }))
  const [saving, setSaving] = useState(false)

  const text = (id, label, props = {}) => (
    <FormField id={id} label={label} value={values[id]} onChange={(event) => set(id, event.target.value)} error={errors[id]} {...props} />
  )

  const onSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validateProfile(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      onError('Le formulaire contient des erreurs.')
      return
    }

    setSaving(true)
    try {
      await saveProfile(values, original)
      onSaved()
    } catch (error) {
      onError(getErrorMessage(error))
      setSaving(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={onSubmit} noValidate>
      <section className="box stack">
        <h2 className="section-title">Identité</h2>
        <div className="form__row">
          {text('firstName', 'Prénom', { required: true })}
          {text('lastName', 'Nom', { required: true })}
        </div>
        <LinesField id="specialties" label="Spécialités" value={values.specialties} onChange={(value) => set('specialties', value)} />
        {text('location', 'Localisation', { hint: 'Ville affichée publiquement. Ne pas indiquer d’adresse personnelle.' })}
      </section>

      <section className="box stack">
        <h2 className="section-title">Présentation</h2>
        {text('shortIntro', 'Courte présentation', { as: 'textarea', rows: 2, hint: 'Affichée sur la page d’accueil.' })}
        <LinesField id="biography" label="Biographie" value={values.biography} onChange={(value) => set('biography', value)} paragraphs rows={8} />
        <LinesField id="focusAreas" label="Domaines de prédilection" value={values.focusAreas} onChange={(value) => set('focusAreas', value)} />
      </section>

      <section className="box stack">
        <h2 className="section-title">Photographies</h2>
        <ImageField id="heroImage" label="Photographie principale (accueil)" value={values.heroImage} onChange={(value) => set('heroImage', value)} />
        <ImageField id="profileImage" label="Portrait (à propos)" value={values.profileImage} onChange={(value) => set('profileImage', value)} />
      </section>

      <section className="box stack">
        <h2 className="section-title">Coordonnées</h2>
        <div className="form__row">
          {text('phone', 'Téléphone')}
          {text('email', 'Adresse e-mail', { type: 'email' })}
        </div>
        {text('whatsappNumber', 'Numéro WhatsApp', { hint: 'Chiffres uniquement, avec l’indicatif du pays.' })}
        {text('whatsappMessage', 'Message WhatsApp prérempli')}
        {text('contactInvitation', 'Invitation au contact', { as: 'textarea', rows: 2 })}
      </section>

      <section className="box stack">
        <RepeaterField
          legend="Réseaux sociaux"
          itemLabel="réseau"
          value={values.socialLinks}
          onChange={(value) => set('socialLinks', value)}
          createItem={() => ({ id: newId(), platform: 'facebook', label: '', url: '' })}
          renderItem={(link, change, index) => (
            <div className="form__row">
              <FormField id={`social-platform-${index}`} as="select" label="Réseau" value={link.platform} onChange={(event) => change({ platform: event.target.value })}>
                {PLATFORMS.map((platform) => (
                  <option key={platform.value} value={platform.value}>
                    {platform.label}
                  </option>
                ))}
              </FormField>
              <FormField id={`social-label-${index}`} label="Libellé" value={link.label} onChange={(event) => change({ label: event.target.value })} />
              <FormField id={`social-url-${index}`} type="url" label="Lien" className="admin-span-2" value={link.url} onChange={(event) => change({ url: event.target.value })} />
            </div>
          )}
        />
        {errors.socialLinks && <p className="form-field__error">{errors.socialLinks}</p>}
      </section>

      <section className="box stack">
        <RepeaterField
          legend="Expériences professionnelles"
          itemLabel="expérience"
          value={values.experiences}
          onChange={(value) => set('experiences', value)}
          createItem={() => ({ id: newId(), role: '', organization: '', startYear: '', endYear: null, tasks: [] })}
          renderItem={(item, change, index) => (
            <div className="stack">
              <div className="form__row">
                <FormField id={`exp-role-${index}`} label="Poste" value={item.role} onChange={(event) => change({ role: event.target.value })} />
                <FormField id={`exp-org-${index}`} label="Structure" value={item.organization} onChange={(event) => change({ organization: event.target.value })} />
                <FormField id={`exp-start-${index}`} label="Année de début" value={item.startYear} onChange={(event) => change({ startYear: event.target.value })} />
                <FormField id={`exp-end-${index}`} label="Année de fin" hint="Vide si le poste est en cours." value={item.endYear ?? ''} onChange={(event) => change({ endYear: event.target.value || null })} />
              </div>
              <LinesField id={`exp-tasks-${index}`} label="Responsabilités" value={item.tasks} onChange={(tasks) => change({ tasks })} />
            </div>
          )}
        />
      </section>

      <section className="box stack">
        <RepeaterField
          legend="Collaborations médiatiques"
          itemLabel="collaboration"
          value={values.collaborations}
          onChange={(value) => set('collaborations', value)}
          createItem={() => ({ id: newId(), name: '', location: null })}
          renderItem={(item, change, index) => (
            <div className="form__row">
              <FormField id={`col-name-${index}`} label="Média" value={item.name} onChange={(event) => change({ name: event.target.value })} />
              <FormField id={`col-location-${index}`} label="Lieu" value={item.location ?? ''} onChange={(event) => change({ location: event.target.value || null })} />
            </div>
          )}
        />
      </section>

      <section className="box stack">
        <h2 className="section-title">Formation et compétences</h2>
        <LinesField id="education" label="Formation" value={values.education} onChange={(value) => set('education', value)} />
        <LinesField id="skills" label="Compétences professionnelles" value={values.skills} onChange={(value) => set('skills', value)} rows={6} />
        <LinesField id="tools" label="Outils et logiciels" value={values.tools} onChange={(value) => set('tools', value)} rows={6} />
      </section>

      <section className="box stack">
        <RepeaterField
          legend="Langues"
          itemLabel="langue"
          value={values.languages}
          onChange={(value) => set('languages', value)}
          createItem={() => ({ id: newId(), name: '', level: '' })}
          renderItem={(item, change, index) => (
            <div className="form__row">
              <FormField id={`lang-name-${index}`} label="Langue" value={item.name} onChange={(event) => change({ name: event.target.value })} />
              <FormField id={`lang-level-${index}`} label="Niveau" value={item.level} onChange={(event) => change({ level: event.target.value })} />
            </div>
          )}
        />
      </section>

      <FormActions saving={saving} />
    </form>
  )
}
