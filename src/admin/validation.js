import { isValidEmail } from '../utils/validation'

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

const isHttpUrl = (value) => {
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol)
  } catch {
    return false
  }
}

function checkTitleAndSlug(values, errors) {
  if (!values.title.trim()) errors.title = 'Le titre est obligatoire.'
  if (!SLUG_PATTERN.test(values.slug)) {
    errors.slug = 'Utilisez uniquement des minuscules, des chiffres et des tirets.'
  }
}

export function validateProject(values) {
  const errors = {}
  checkTitleAndSlug(values, errors)
  if (!values.category) errors.category = 'Choisissez une catégorie.'
  if (values.videoUrl && !values.videoFile && !isHttpUrl(values.videoUrl)) {
    errors.videoUrl = 'Saisissez un lien complet, commençant par https://'
  }
  return errors
}

export function validateService(values) {
  const errors = {}
  checkTitleAndSlug(values, errors)
  return errors
}

export function validateAudio(values) {
  const errors = {}
  if (!values.title.trim()) errors.title = 'Le titre est obligatoire.'
  if (!values.category) errors.category = 'Choisissez une catégorie.'
  if (!values.audioFile && !values.audioUrl) errors.audioUrl = 'Ajoutez un fichier audio ou un lien.'
  else if (!values.audioFile && !isHttpUrl(values.audioUrl)) errors.audioUrl = 'Saisissez un lien complet, commençant par https://'
  return errors
}

export function validateProfile(values) {
  const errors = {}
  if (!values.firstName.trim()) errors.firstName = 'Le prénom est obligatoire.'
  if (!values.lastName.trim()) errors.lastName = 'Le nom est obligatoire.'
  if (values.email && !isValidEmail(values.email)) errors.email = 'Cette adresse e-mail n’est pas valide.'
  if (values.whatsappNumber && !/^\d{6,15}$/.test(values.whatsappNumber)) {
    errors.whatsappNumber = 'Chiffres uniquement, avec l’indicatif du pays. Exemple : 50935353531'
  }
  if (values.socialLinks.some((link) => !isHttpUrl(link.url))) {
    errors.socialLinks = 'Chaque réseau social doit avoir un lien complet, commençant par https://'
  }
  return errors
}
