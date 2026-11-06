// Erreur applicative dont le message peut être montré tel quel à l'utilisateur.
export class AppError extends Error {
  constructor(message, { code, cause } = {}) {
    super(message, { cause })
    this.name = 'AppError'
    this.code = code
  }
}

export const DEFAULT_ERROR_MESSAGE =
  'Une erreur inattendue est survenue. Veuillez réessayer dans quelques instants.'

export function getErrorMessage(error, fallback = DEFAULT_ERROR_MESSAGE) {
  return error instanceof AppError ? error.message : fallback
}

const DATABASE_MESSAGES = {
  23505: 'Cette adresse (slug) est déjà utilisée par un autre contenu.',
  23514: 'Une valeur saisie n’est pas acceptée. Vérifiez le formulaire.',
  42501: 'Vous n’avez pas l’autorisation d’effectuer cette action.',
}

// Traduit une erreur Supabase en message compréhensible, sans exposer les détails techniques.
export function toAppError(error) {
  if (error instanceof AppError) return error
  console.error(error)
  const message = DATABASE_MESSAGES[error?.code] ?? DEFAULT_ERROR_MESSAGE
  return new AppError(message, { code: error?.code, cause: error })
}
