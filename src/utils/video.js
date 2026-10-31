const FILE_EXTENSIONS = /\.(mp4|webm|ogv|ogg|mov|m4v)$/i

/**
 * Identifie la source d'une vidéo :
 * - youtube / vimeo → URL d'intégration (iframe)
 * - file            → fichier lu par la balise <video> (ex. Supabase Storage)
 * - external        → lien simple, ouvert dans un nouvel onglet
 */
export function parseVideoUrl(url) {
  if (!url) return null

  let parsed
  try {
    parsed = new URL(url, window.location.origin)
  } catch {
    return null
  }

  const host = parsed.hostname.replace(/^(www|m)\./, '')

  if (host === 'youtu.be' || host.endsWith('youtube.com') || host === 'youtube-nocookie.com') {
    const id =
      host === 'youtu.be'
        ? parsed.pathname.slice(1)
        : parsed.searchParams.get('v') ?? parsed.pathname.match(/\/(embed|shorts|live)\/([^/?]+)/)?.[2]
    if (id) return { provider: 'youtube', embedUrl: `https://www.youtube-nocookie.com/embed/${id}` }
  }

  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const id = parsed.pathname.match(/(\d+)/)?.[1]
    if (id) return { provider: 'vimeo', embedUrl: `https://player.vimeo.com/video/${id}` }
  }

  if (FILE_EXTENSIONS.test(parsed.pathname)) return { provider: 'file', src: parsed.href }

  return { provider: 'external', src: parsed.href }
}
