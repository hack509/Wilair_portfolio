import { requireSupabase, unwrap } from '../lib/supabaseClient'
import { AppError } from '../utils/errors'
import { optimizeImage } from '../utils/imageOptimizer'

const MB = 1024 * 1024

export const MEDIA_RULES = {
  image: {
    bucket: 'portfolio-images',
    maxSize: 10 * MB,
    types: ['image/jpeg', 'image/png', 'image/webp'],
    accept: 'image/jpeg,image/png,image/webp',
    label: 'JPEG, PNG ou WebP',
  },
  audio: {
    bucket: 'portfolio-audio',
    maxSize: 50 * MB,
    types: ['audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/x-m4a', 'audio/aac', 'audio/wav', 'audio/x-wav', 'audio/ogg'],
    accept: 'audio/*',
    label: 'MP3, M4A, WAV ou OGG',
  },
  video: {
    bucket: 'portfolio-video',
    maxSize: 50 * MB,
    types: ['video/mp4', 'video/webm'],
    accept: 'video/mp4,video/webm',
    label: 'MP4 ou WebM',
  },
}

// Renvoie un message d'erreur, ou null si le fichier est accepté.
export function validateMediaFile(file, kind) {
  const rule = MEDIA_RULES[kind]
  if (!rule.types.includes(file.type)) return `Format non accepté (${rule.label}).`
  if (file.size > rule.maxSize) return `Fichier trop lourd : ${rule.maxSize / MB} Mo maximum.`
  return null
}

const extensionOf = (file) => file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin'

/**
 * Envoie un fichier vers Supabase Storage sous un nom unique.
 * @returns {{ url: string, width: number|null, height: number|null }}
 */
export async function uploadMedia(file, kind, folder) {
  const invalid = validateMediaFile(file, kind)
  if (invalid) throw new AppError(invalid, { code: 'INVALID_FILE' })

  const client = requireSupabase()
  const { bucket } = MEDIA_RULES[kind]
  const prepared = kind === 'image' ? await optimizeImage(file) : { file }
  const path = `${folder}/${crypto.randomUUID()}.${extensionOf(prepared.file)}`

  unwrap(
    await client.storage.from(bucket).upload(path, prepared.file, {
      contentType: prepared.file.type,
      cacheControl: '31536000',
    }),
  )

  const { data } = client.storage.from(bucket).getPublicUrl(path)
  return { url: data.publicUrl, width: prepared.width ?? null, height: prepared.height ?? null }
}

// Retrouve l'espace et le chemin d'un fichier ; null s'il n'est pas hébergé sur Supabase (lien YouTube…).
function parseStorageUrl(url) {
  const match = url?.match(/\/storage\/v1\/object\/public\/(portfolio-[a-z]+)\/(.+)$/)
  return match ? { bucket: match[1], path: decodeURIComponent(match[2]) } : null
}

/**
 * Supprime des fichiers devenus inutiles. Un échec ne bloque pas l'opération :
 * le contenu est déjà enregistré, il ne reste au pire qu'un fichier orphelin.
 */
export async function removeMedia(urls) {
  const client = requireSupabase()
  const byBucket = new Map()
  for (const url of urls) {
    const parsed = parseStorageUrl(url)
    if (parsed) byBucket.set(parsed.bucket, [...(byBucket.get(parsed.bucket) ?? []), parsed.path])
  }

  await Promise.all(
    [...byBucket].map(async ([bucket, paths]) => {
      const { error } = await client.storage.from(bucket).remove(paths)
      if (error) console.error(error)
    }),
  )
}

// Exécute `work` en suivant les fichiers envoyés : en cas d'échec, ils sont retirés du stockage.
export async function withUploadRollback(work) {
  const uploaded = []
  const upload = async (file, kind, folder) => {
    const result = await uploadMedia(file, kind, folder)
    uploaded.push(result.url)
    return result
  }

  try {
    return await work(upload)
  } catch (error) {
    await removeMedia(uploaded)
    throw error
  }
}
