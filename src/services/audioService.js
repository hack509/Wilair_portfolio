import { audioTracksData } from '../data/audioData'
import { requireSupabase, supabase, unwrap } from '../lib/supabaseClient'
import { fromLocal } from './localSource'
import { audioFromRow, audioToRow } from './mappers'
import { removeMedia, withUploadRollback } from './mediaService'

export async function listAudioTracks({ category = null } = {}) {
  if (!supabase) {
    return fromLocal(() =>
      audioTracksData
        .filter((track) => track.isPublished && (!category || track.category === category))
        .sort((a, b) => a.displayOrder - b.displayOrder),
    )
  }

  const query = supabase
    .from('audio_tracks')
    .select('*')
    .eq('is_published', true)
    .order('display_order')
    .order('recorded_on', { ascending: false, nullsFirst: false })
  return unwrap(await (category ? query.eq('category', category) : query)).map(audioFromRow)
}

// --- Administration ----------------------------------------------------------

export async function adminListAudioTracks() {
  const rows = unwrap(
    await requireSupabase()
      .from('audio_tracks')
      .select('*')
      .order('display_order')
      .order('created_at', { ascending: false }),
  )
  return rows.map(audioFromRow)
}

export async function adminGetAudioTrack(id) {
  const row = unwrap(await requireSupabase().from('audio_tracks').select('*').eq('id', id).maybeSingle())
  return row ? audioFromRow(row) : null
}

export async function saveAudioTrack(values, original) {
  const client = requireSupabase()
  const id = original?.id ?? crypto.randomUUID()

  await withUploadRollback(async (upload) => {
    const audioUrl = values.audioFile ? (await upload(values.audioFile, 'audio', 'tracks')).url : values.audioUrl

    unwrap(await client.from('audio_tracks').upsert({ ...audioToRow({ ...values, audioUrl }), id }))

    if (original?.audioUrl && original.audioUrl !== audioUrl) await removeMedia([original.audioUrl])
  })
}

export async function updateAudioFlags(id, { isPublished }) {
  unwrap(await requireSupabase().from('audio_tracks').update({ is_published: isPublished }).eq('id', id))
}

export async function deleteAudioTrack(track) {
  unwrap(await requireSupabase().from('audio_tracks').delete().eq('id', track.id))
  await removeMedia([track.audioUrl])
}
