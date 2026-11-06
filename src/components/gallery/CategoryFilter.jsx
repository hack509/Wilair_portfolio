export default function CategoryFilter({ categories, active, onChange, label = 'Filtrer les réalisations par catégorie' }) {
  const options = [{ slug: null, label: 'Tout' }, ...categories]

  return (
    <div className="filter" role="group" aria-label={label}>
      {options.map((category) => {
        const isActive = (active ?? null) === category.slug
        return (
          <button
            key={category.slug ?? 'all'}
            type="button"
            className={`filter__button ${isActive ? 'is-active' : ''}`}
            aria-pressed={isActive}
            onClick={() => onChange(category.slug)}
          >
            {category.label}
          </button>
        )
      })}
    </div>
  )
}
