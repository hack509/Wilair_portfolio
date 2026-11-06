import { createClient } from '@supabase/supabase-js'
import { AppError, toAppError } from '../utils/errors'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Sans ces variables, le site public utilise src/data et /admin affiche la marche à suivre.
export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null

// Renvoie les données d'une réponse Supabase, ou lève une erreur affichable.
export function unwrap({ data, error }) {
  if (error) throw toAppError(error)
  return data
}

export function requireSupabase() {
  if (!supabase) throw new AppError("Supabase n'est pas configuré.", { code: 'NOT_CONFIGURED' })
  return supabase
}
