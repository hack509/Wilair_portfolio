import { requireSupabase, unwrap } from '../lib/supabaseClient'
import { ROUTES } from '../routes/paths'
import { AppError, toAppError } from '../utils/errors'

export async function signIn(email, password) {
  const { error } = await requireSupabase().auth.signInWithPassword({ email, password })
  if (!error) return
  if (error.code === 'invalid_credentials') throw new AppError('E-mail ou mot de passe incorrect.')
  throw toAppError(error)
}

export async function signOut() {
  unwrap(await requireSupabase().auth.signOut())
}

export async function requestPasswordReset(email) {
  const redirectTo = `${window.location.origin}${ROUTES.admin.resetPassword}`
  unwrap(await requireSupabase().auth.resetPasswordForEmail(email, { redirectTo }))
}

export async function updatePassword(password) {
  unwrap(await requireSupabase().auth.updateUser({ password }))
}

export async function checkIsAdmin() {
  return unwrap(await requireSupabase().rpc('is_admin'))
}
