import MediaPlaceholder from '../common/MediaPlaceholder'

const MEDIA_DISPLAY = {
  image: { label: 'Photo', ratio: '4 / 3' },
  video: { label: 'Vidéo', ratio: '16 / 9' },
  audio: { label: 'Audio', ratio: '3 / 1' },
}

// Emplacements réservés par catégorie, affichés tant qu'aucun contenu n'est publié.
export default function PlaceholderGrid({ categories }) {
  return (
    <div className="placeholder-groups">
      {categories.map((category) => {
        const display = MEDIA_DISPLAY[category.media]
        return (
          <section key={category.slug} aria-labelledby={`emplacement-${category.slug}`}>
            <h2 id={`emplacement-${category.slug}`} className="section-title">
              {category.label}
            </h2>
            <ul className="grid grid--3">
              {[1, 2, 3].map((n) => (
                <li key={n}>
                  <MediaPlaceholder type={category.media} label={`${display.label} — ${category.label}`} ratio={display.ratio} />
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
