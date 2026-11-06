import { servicesData } from '../data/servicesData'
import { requireSupabase, supabase, unwrap } from '../lib/supabaseClient'
import { fromLocal } from './localSource'
import { serviceFromRow, serviceToRow } from './mappers'
import { removeMedia, withUploadRollback } from './mediaService'

export async function listServices() {
  if (!supabase) {
    return fromLocal(() =>
      servicesData.filter((service) => service.isPublished).sort((a, b) => a.displayOrder - b.displayOrder),
    )
  }

  const rows = unwrap(await supabase.from('services').select('*').eq('is_published', true).order('display_order'))
  return rows.map(serviceFromRow)
}

// --- Administration ----------------------------------------------------------

export async function adminListServices() {
  const rows = unwrap(await requireSupabase().from('services').select('*').order('display_order'))
  return rows.map(serviceFromRow)
}

export async function adminGetService(id) {
  const row = unwrap(await requireSupabase().from('services').select('*').eq('id', id).maybeSingle())
  return row ? serviceFromRow(row) : null
}

export async function saveService(values, original) {
  const client = requireSupabase()
  const id = original?.id ?? crypto.randomUUID()

  await withUploadRollback(async (upload) => {
    let { image } = values
    if (image?.file) image = { url: (await upload(image.file, 'image', 'services')).url, alt: image.alt }

    unwrap(await client.from('services').upsert({ ...serviceToRow({ ...values, image }), id }))

    if (original?.image?.url && original.image.url !== image?.url) await removeMedia([original.image.url])
  })
}

export async function updateServiceFlags(id, { isPublished }) {
  unwrap(await requireSupabase().from('services').update({ is_published: isPublished }).eq('id', id))
}

export async function deleteService(service) {
  unwrap(await requireSupabase().from('services').delete().eq('id', service.id))
  await removeMedia([service.image?.url])
}
