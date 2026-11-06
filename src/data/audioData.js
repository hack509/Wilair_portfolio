// Catégories de la page Audio. `media: 'audio'` affiche un emplacement audio quand la catégorie est vide.
export const audioCategories = [
  { slug: 'voix-off', label: 'Voix off', media: 'audio' },
  { slug: 'spots', label: 'Spots publicitaires', media: 'audio' },
  { slug: 'emissions', label: 'Émissions', media: 'audio' },
  { slug: 'reportages', label: 'Reportages et interviews', media: 'audio' },
]

/**
 * Audios utilisés quand Supabase n'est pas configuré.
 * Avec Supabase, ils se gèrent depuis /admin/audios. Aucun pour l'instant.
 */
export const audioTracksData = []
