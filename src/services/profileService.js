import { profileData } from '../data/profileData'
import { requireSupabase, supabase, unwrap } from '../lib/supabaseClient'
import { fromLocal } from './localSource'
import { profileFromRow, profileToRow } from './mappers'
import { removeMedia, withUploadRollback } from './mediaService'

export async function getProfile() {
  if (!supabase) return fromLocal(() => profileData)

  const row = unwrap(await supabase.from('profiles').select('*').maybeSingle())
  return row ? profileFromRow(row) : null
}

// --- Administration ----------------------------------------------------------

export async function saveProfile(values, original) {
  const client = requireSupabase()

  await withUploadRollback(async (upload) => {
    const send = async (image) =>
      image?.file ? { url: (await upload(image.file, 'image', 'profile')).url, alt: image.alt } : image

    const heroImage = await send(values.heroImage)
    const profileImage = await send(values.profileImage)

    unwrap(await client.from('profiles').update(profileToRow({ ...values, heroImage, profileImage })).eq('id', original.id))

    const stale = []
    if (original.heroImage?.url && original.heroImage.url !== heroImage?.url) stale.push(original.heroImage.url)
    if (original.profileImage?.url && original.profileImage.url !== profileImage?.url) stale.push(original.profileImage.url)
    await removeMedia(stale)
  })
}
