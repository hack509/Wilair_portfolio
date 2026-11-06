import { projectCategories } from '../data/categoriesData'
import { projectsData } from '../data/projectsData'
import { requireSupabase, supabase, unwrap } from '../lib/supabaseClient'
import { fromLocal } from './localSource'
import { projectFromRow, projectToRow } from './mappers'
import { removeMedia, withUploadRollback } from './mediaService'

const WITH_MEDIA = '*, project_media(*)'

// Ordre public : réalisations mises en avant, puis ordre d'affichage, puis date décroissante.
function sortProjects(a, b) {
  return (
    Number(b.isFeatured ?? false) - Number(a.isFeatured ?? false) ||
    a.displayOrder - b.displayOrder ||
    (b.projectDate ?? '').localeCompare(a.projectDate ?? '')
  )
}

const publishedLocalProjects = () => projectsData.filter((project) => project.isPublished).sort(sortProjects)

const publishedQuery = (columns) =>
  supabase
    .from('projects')
    .select(columns)
    .eq('is_published', true)
    .eq('is_archived', false)
    .order('is_featured', { ascending: false })
    .order('display_order')
    .order('project_date', { ascending: false, nullsFirst: false })

export async function listProjects({ category = null } = {}) {
  if (!supabase) {
    return fromLocal(() => {
      const projects = publishedLocalProjects()
      return category ? projects.filter((project) => project.category === category) : projects
    })
  }

  const query = publishedQuery(WITH_MEDIA)
  return unwrap(await (category ? query.eq('category', category) : query)).map(projectFromRow)
}

// Projet publié et ses voisins (navigation précédent / suivant).
export async function getProjectBySlug(slug) {
  const withNeighbours = (project, list) => {
    if (!project) return { project: null, previous: null, next: null }
    const index = list.findIndex((item) => item.slug === slug)
    const pick = (item) => (item ? { slug: item.slug, title: item.title } : null)
    return { project, previous: pick(list[index - 1]), next: pick(list[index + 1]) }
  }

  if (!supabase) {
    return fromLocal(() => {
      const projects = publishedLocalProjects()
      return withNeighbours(projects.find((project) => project.slug === slug), projects)
    })
  }

  const [row, list] = await Promise.all([
    publishedQuery(WITH_MEDIA).eq('slug', slug).maybeSingle().then(unwrap),
    publishedQuery('slug, title').then(unwrap),
  ])
  return withNeighbours(row ? projectFromRow(row) : null, list)
}

export const getCategory = (slug) => projectCategories.find((category) => category.slug === slug)

export const getCategoryLabel = (slug) => getCategory(slug)?.label ?? slug

// --- Administration ----------------------------------------------------------

export async function adminListProjects() {
  const rows = unwrap(
    await requireSupabase()
      .from('projects')
      .select(WITH_MEDIA)
      .order('display_order')
      .order('created_at', { ascending: false }),
  )
  return rows.map(projectFromRow)
}

export async function adminGetProject(id) {
  const row = unwrap(await requireSupabase().from('projects').select(WITH_MEDIA).eq('id', id).maybeSingle())
  return row ? projectFromRow(row) : null
}

/**
 * Crée ou met à jour une réalisation avec ses médias.
 * Les fichiers sont envoyés d'abord ; ceux qui ne servent plus sont supprimés une fois tout enregistré.
 * @param values état du formulaire (`coverImage.file`, `videoFile`, `media[].file` pour les nouveaux fichiers)
 * @param original réalisation avant modification, ou null à la création
 */
export async function saveProject(values, original, onProgress = () => {}) {
  const client = requireSupabase()
  const id = original?.id ?? crypto.randomUUID()
  const folder = `projects/${id}`

  await withUploadRollback(async (upload) => {
    const pending = [values.coverImage?.file, values.videoFile, ...values.media.map((item) => item.file)].filter(Boolean)
    let done = 0
    const send = async (file, kind) => {
      onProgress(`Envoi du fichier ${done + 1} sur ${pending.length}…`)
      const result = await upload(file, kind, folder)
      done += 1
      return result
    }

    let { coverImage, videoUrl } = values
    if (coverImage?.file) coverImage = { url: (await send(coverImage.file, 'image')).url, alt: coverImage.alt }
    if (values.videoFile) videoUrl = (await send(values.videoFile, 'video')).url

    const media = []
    for (const [index, item] of values.media.entries()) {
      const sent = item.file ? await send(item.file, 'image') : item
      media.push({
        id: item.file ? crypto.randomUUID() : item.id,
        project_id: id,
        media_url: sent.url,
        media_type: 'image',
        alt_text: item.alt,
        width: sent.width ?? null,
        height: sent.height ?? null,
        display_order: index,
      })
    }

    onProgress('Enregistrement…')
    unwrap(await client.from('projects').upsert({ ...projectToRow({ ...values, coverImage, videoUrl }), id }))
    if (media.length > 0) unwrap(await client.from('project_media').upsert(media))

    const keptIds = new Set(media.map((item) => item.id))
    const removed = (original?.media ?? []).filter((item) => !keptIds.has(item.id))
    if (removed.length > 0) {
      unwrap(await client.from('project_media').delete().in('id', removed.map((item) => item.id)))
    }

    const stale = removed.map((item) => item.url)
    if (original?.coverImage?.url && original.coverImage.url !== coverImage?.url) stale.push(original.coverImage.url)
    if (original?.videoUrl && original.videoUrl !== videoUrl) stale.push(original.videoUrl)
    await removeMedia(stale)
  })
}

// Changement rapide depuis la liste : publication, mise en avant, archivage.
export async function updateProjectFlags(id, flags) {
  const row = {}
  if ('isPublished' in flags) row.is_published = flags.isPublished
  if ('isArchived' in flags) row.is_archived = flags.isArchived
  if ('isFeatured' in flags) row.is_featured = flags.isFeatured
  unwrap(await requireSupabase().from('projects').update(row).eq('id', id))
}

export async function deleteProject(project) {
  unwrap(await requireSupabase().from('projects').delete().eq('id', project.id))
  await removeMedia([project.coverImage?.url, project.videoUrl, ...project.media.map((item) => item.url)])
}
