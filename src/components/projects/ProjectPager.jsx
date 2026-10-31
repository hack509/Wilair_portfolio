import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { ROUTES } from '../../routes/paths'

export default function ProjectPager({ previous, next }) {
  if (!previous && !next) return null

  return (
    <nav className="project-pager" aria-label="Autres réalisations">
      {previous ? (
        <Link to={ROUTES.project(previous.slug)} className="project-pager__link project-pager__link--prev">
          <span className="project-pager__label">
            <ArrowLeft size={16} aria-hidden="true" /> Réalisation précédente
          </span>
          <span className="project-pager__title">{previous.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link to={ROUTES.project(next.slug)} className="project-pager__link project-pager__link--next">
          <span className="project-pager__label">
            Réalisation suivante <ArrowRight size={16} aria-hidden="true" />
          </span>
          <span className="project-pager__title">{next.title}</span>
        </Link>
      )}
    </nav>
  )
}
