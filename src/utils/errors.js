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
