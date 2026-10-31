import { ExternalLink } from 'lucide-react'
import { parseVideoUrl } from '../../utils/video'
import Button from '../common/Button'

// Lecteur unique pour YouTube, Vimeo et fichiers vidéo (ex. Supabase Storage).
export default function VideoPlayer({ url, title, poster }) {
  const video = parseVideoUrl(url)
  if (!video) return null

  if (video.provider === 'external') {
    return (
      <Button href={video.src} variant="outline" icon={ExternalLink} target="_blank" rel="noopener noreferrer">
        Voir la vidéo (nouvel onglet)
      </Button>
    )
  }

  return (
    <div className="video-player">
      {video.provider === 'file' ? (
        <video controls preload="metadata" poster={poster} playsInline>
          <source src={video.src} />
          Votre navigateur ne peut pas lire cette vidéo.{' '}
          <a href={video.src}>Télécharger la vidéo</a>.
        </video>
      ) : (
        <iframe
          src={video.embedUrl}
          title={title ? `Vidéo : ${title}` : 'Vidéo'}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      )}
    </div>
  )
}
