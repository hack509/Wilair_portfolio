const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const CONTACT_LIMITS = {
  name: { min: 2, max: 120 },
  subject: { min: 3, max: 160 },
  message: { min: 20, max: 5000 },
}

export const isValidEmail = (value) => EMAIL_PATTERN.test(String(value ?? '').trim())

// Retourne un objet { champ: message } — vide si le formulaire est valide.
export function validateContactMessage(values) {
  const errors = {}
  const name = values.name?.trim() ?? ''
  const email = values.email?.trim() ?? ''
  const subject = values.subject?.trim() ?? ''
  const message = values.message?.trim() ?? ''

  if (!name) errors.name = 'Veuillez indiquer votre nom.'
  else if (name.length < CONTACT_LIMITS.name.min) errors.name = 'Votre nom semble trop court.'
  else if (name.length > CONTACT_LIMITS.name.max) errors.name = 'Votre nom est trop long.'

  if (!email) errors.email = 'Veuillez indiquer votre adresse e-mail.'
  else if (!isValidEmail(email)) errors.email = "Cette adresse e-mail n'est pas valide."

  if (!subject) errors.subject = 'Veuillez préciser l’objet de votre message.'
  else if (subject.length < CONTACT_LIMITS.subject.min) errors.subject = 'L’objet est trop court.'
  else if (subject.length > CONTACT_LIMITS.subject.max) errors.subject = 'L’objet est trop long.'

  if (!message) errors.message = 'Veuillez écrire votre message.'
  else if (message.length < CONTACT_LIMITS.message.min)
    errors.message = `Votre message doit contenir au moins ${CONTACT_LIMITS.message.min} caractères.`
  else if (message.length > CONTACT_LIMITS.message.max)
    errors.message = `Votre message ne doit pas dépasser ${CONTACT_LIMITS.message.max} caractères.`

  return errors
}
