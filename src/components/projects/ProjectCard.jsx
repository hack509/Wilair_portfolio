import { Link } from 'react-router'
import { ROUTES } from '../../routes/paths'
import { getCategoryLabel } from '../../services/projectService'
import { formatYear } from '../../utils/format'
import SmartImage from '../common/SmartImage'

export default function ProjectCard({ project }) {
  const year = formatYear(project.projectDate)

  return (
    <Link to={ROUTES.project(project.slug)} className="card">
      <SmartImage src={project.coverImage?.url} alt={project.coverImage?.alt ?? project.title} />
      <h3 className="card__title">{project.title}</h3>
      <p className="card__meta">
        {getCategoryLabel(project.category)}
        {year && ` · ${year}`}
        {project.videoUrl && ' · Vidéo'}
      </p>
    </Link>
  )
}
