import { audioCategories } from '../../data/audioData'
import { formatDuration, formatMonthYear } from '../../utils/format'

// Lancer un audio met les autres en pause.
function pauseOthers(event) {
  document.querySelectorAll('audio').forEach((audio) => {
    if (audio !== event.currentTarget) audio.pause()
  })
}

export default function AudioCard({ track }) {
  const category = audioCategories.find((item) => item.slug === track.category)?.label
  const meta = [category, formatMonthYear(track.recordedOn), formatDuration(track.durationSeconds)].filter(Boolean)

  return (
    <article className="audio-card">
      <h2 className="audio-card__title">{track.title}</h2>
      {meta.length > 0 && <p className="card__meta">{meta.join(' · ')}</p>}
      {track.description && <p className="muted">{track.description}</p>}
      <audio className="audio-card__player" src={track.audioUrl} controls preload="none" onPlay={pauseOthers}>
        <a href={track.audioUrl}>Écouter le fichier audio</a>
      </audio>
    </article>
  )
}
