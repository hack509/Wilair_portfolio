import { Camera, Mic, Video } from 'lucide-react'

const ICONS = { image: Camera, video: Video, audio: Mic }

// Emplacement clairement identifié, en attendant le média du propriétaire.
export default function MediaPlaceholder({ label = 'Photo à venir', type = 'image', ratio = '4 / 3', className = '' }) {
  const Icon = ICONS[type] ?? Camera
  return (
    <div className={`placeholder ${className}`} style={{ aspectRatio: ratio }} role="img" aria-label={`Emplacement réservé : ${label}`}>
      <Icon aria-hidden="true" strokeWidth={1.25} />
      <span className="placeholder__label">{label}</span>
      <span className="placeholder__hint">Emplacement à remplacer</span>
    </div>
  )
}
