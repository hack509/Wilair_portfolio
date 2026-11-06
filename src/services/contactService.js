import { requireSupabase, supabase, unwrap } from '../lib/supabaseClient'
import { AppError, toAppError } from '../utils/errors'
import { validateContactMessage } from '../utils/validation'
import { messageFromRow } from './mappers'

export const MESSAGES_PER_PAGE = 20

/**
 * Enregistre le message dans Supabase.
 * Sans Supabase, il passe par la messagerie du visiteur (lien mailto prérempli).
 */
export async function sendContactMessage(values, recipientEmail) {
  // Champ piège : seul un robot le remplit. On feint la réussite sans rien enregistrer.
  if (values.website) return { channel: 'database' }

  const errors = validateContactMessage(values)
  if (Object.keys(errors).length > 0) {
    throw new AppError('Le formulaire contient des erreurs.', { code: 'VALIDATION', cause: errors })
  }

  const name = values.name.trim()
  const email = values.email.trim()
  const subject = values.subject.trim()
  const message = values.message.trim()

  if (supabase) {
    // Pas de .select() ici : le public a le droit d'écrire un message, pas de le relire.
    const { error } = await supabase
      .from('contact_messages')
      .insert({ sender_name: name, sender_email: email, subject, message })
    if (error) throw toAppError(error)
    return { channel: 'database' }
  }

  const body = `${message}\n\n— ${name} (${email})`
  const query = new URLSearchParams({ subject, body }).toString().replace(/\+/g, '%20')
  window.location.href = `mailto:${recipientEmail}?${query}`

  return { channel: 'mailto' }
}

// --- Administration ----------------------------------------------------------

/** @param {{ filter?: 'inbox'|'unread'|'archived', page?: number }} options */
export async function listMessages({ filter = 'inbox', page = 0 } = {}) {
  let query = requireSupabase()
    .from('contact_messages')
    .select('*', { count: 'exact' })
    .eq('is_archived', filter === 'archived')
    .order('created_at', { ascending: false })
    .range(page * MESSAGES_PER_PAGE, (page + 1) * MESSAGES_PER_PAGE - 1)
  if (filter === 'unread') query = query.eq('is_read', false)

  const response = await query
  return { messages: unwrap(response).map(messageFromRow), total: response.count ?? 0 }
}

export async function updateMessageFlags(id, flags) {
  const row = {}
  if ('isRead' in flags) row.is_read = flags.isRead
  if ('isArchived' in flags) row.is_archived = flags.isArchived
  unwrap(await requireSupabase().from('contact_messages').update(row).eq('id', id))
}

export async function deleteMessage(id) {
  unwrap(await requireSupabase().from('contact_messages').delete().eq('id', id))
}
