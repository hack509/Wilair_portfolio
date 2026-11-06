import { requireSupabase, unwrap } from '../lib/supabaseClient'

async function countOf(query) {
  const response = await query
  unwrap(response)
  return response.count ?? 0
}

// Chiffres et dernières modifications du tableau de bord.
export async function getDashboard() {
  const client = requireSupabase()
  const count = (table) => client.from(table).select('id', { count: 'exact', head: true })
  const recent = async (table, kind) => {
    const rows = unwrap(await client.from(table).select('id, title, updated_at').order('updated_at', { ascending: false }).limit(5))
    return rows.map((row) => ({ id: row.id, title: row.title, kind, updatedAt: row.updated_at }))
  }

  const [projects, publishedProjects, audioTracks, services, messages, unreadMessages, ...recentLists] = await Promise.all([
    countOf(count('projects')),
    countOf(count('projects').eq('is_published', true).eq('is_archived', false)),
    countOf(count('audio_tracks')),
    countOf(count('services')),
    countOf(count('contact_messages').eq('is_archived', false)),
    countOf(count('contact_messages').eq('is_archived', false).eq('is_read', false)),
    recent('projects', 'project'),
    recent('audio_tracks', 'audio'),
    recent('services', 'service'),
  ])

  const latest = recentLists
    .flat()
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 6)

  return { projects, publishedProjects, audioTracks, services, messages, unreadMessages, latest }
}
