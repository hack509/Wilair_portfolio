import { AppError } from '../utils/errors'
import { validateContactMessage } from '../utils/validation'

/**
 * Sans backend, le message est transmis via la messagerie du visiteur (lien mailto prérempli).
 * Phase 2 : insertion dans la table `contact_messages` de Supabase.
 */
export async function sendContactMessage(values, recipientEmail) {
  const errors = validateContactMessage(values)
  if (Object.keys(errors).length > 0) {
    throw new AppError('Le formulaire contient des erreurs.', { code: 'VALIDATION', cause: errors })
  }

  const body = `${values.message.trim()}\n\n— ${values.name.trim()} (${values.email.trim()})`
  const query = new URLSearchParams({ subject: values.subject.trim(), body }).toString().replace(/\+/g, '%20')
  window.location.href = `mailto:${recipientEmail}?${query}`

  return { channel: 'mailto' }
}
