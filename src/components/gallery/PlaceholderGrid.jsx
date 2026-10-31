import MediaPlaceholder from '../common/MediaPlaceholder'

// Emplacements réservés par catégorie, affichés tant qu'aucune réalisation n'est publiée.
export default function PlaceholderGrid({ categories }) {
  return (
    <div className="placeholder-groups">
      {categories.map((category) => (
        <section key={category.slug} aria-labelledby={`emplacement-${category.slug}`}>
          <h2 id={`emplacement-${category.slug}`} className="section-title">
            {category.label}
          </h2>
          <ul className="grid grid--3">
            {[1, 2, 3].map((n) => (
              <li key={n}>
                <MediaPlaceholder
                  type={category.media}
                  label={`${category.media === 'video' ? 'Vidéo' : 'Photo'} — ${category.label}`}
                  ratio={category.media === 'video' ? '16 / 9' : '4 / 3'}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
