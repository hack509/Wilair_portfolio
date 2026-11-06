import { Send } from 'lucide-react'
import { useRef, useState } from 'react'
import { isSupabaseConfigured } from '../../lib/supabaseClient'
import { sendContactMessage } from '../../services/contactService'
import { getErrorMessage } from '../../utils/errors'
import { CONTACT_LIMITS, validateContactMessage } from '../../utils/validation'
import Button from '../common/Button'
import FormField from './FormField'

const emptyValues = (subject = '') => ({ name: '', email: '', subject, message: '', website: '' })

export default function ContactForm({ recipientEmail, initialSubject = '' }) {
  const formRef = useRef(null)
  const [values, setValues] = useState(() => emptyValues(initialSubject))
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [submitError, setSubmitError] = useState('')

  const onChange = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validateContactMessage(values)
    setErrors(validationErrors)

    const firstInvalid = Object.keys(validationErrors)[0]
    if (firstInvalid) {
      formRef.current?.querySelector(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    try {
      setStatus('sending')
      await sendContactMessage(values, recipientEmail)
      setValues(emptyValues())
      setStatus('sent')
    } catch (error) {
      if (error.code === 'VALIDATION') setErrors(error.cause)
      setSubmitError(getErrorMessage(error))
      setStatus('error')
    }
  }

  return (
    <form ref={formRef} className="form" onSubmit={onSubmit} noValidate>
      <div className="form__row">
        <FormField id="name" label="Nom complet" autoComplete="name" required value={values.name} onChange={onChange} error={errors.name} maxLength={CONTACT_LIMITS.name.max} />
        <FormField id="email" type="email" label="Adresse e-mail" autoComplete="email" required value={values.email} onChange={onChange} error={errors.email} />
      </div>
      <FormField id="subject" label="Objet" required value={values.subject} onChange={onChange} error={errors.subject} maxLength={CONTACT_LIMITS.subject.max} />
      <FormField id="message" as="textarea" label="Message" rows={6} required value={values.message} onChange={onChange} error={errors.message} maxLength={CONTACT_LIMITS.message.max} />

      {/* Champ piège anti-spam : invisible pour les visiteurs, seul un robot le remplit. */}
      <div className="visually-hidden" aria-hidden="true">
        <label htmlFor="website">Ne pas remplir ce champ</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={onChange} />
      </div>

      {status === 'error' && submitError && (
        <p className="form__alert" role="alert">
          {submitError}
        </p>
      )}
      {status === 'sent' && (
        <p className="form__success" role="status">
          {isSupabaseConfigured
            ? 'Merci, votre message a bien été envoyé.'
            : 'Votre messagerie s’est ouverte avec le message prérempli : il ne reste qu’à l’envoyer.'}
        </p>
      )}

      <div className="form__footer">
        <p className="form__note">
          Tous les champs sont obligatoires.{' '}
          {isSupabaseConfigured
            ? 'Vos coordonnées servent uniquement à répondre à votre demande.'
            : 'L’envoi ouvre votre messagerie.'}
        </p>
        <Button type="submit" icon={Send} disabled={status === 'sending'}>
          {status === 'sending' ? 'Envoi…' : 'Envoyer le message'}
        </Button>
      </div>
    </form>
  )
}
