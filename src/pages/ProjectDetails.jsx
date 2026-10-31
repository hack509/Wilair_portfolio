import { Link, useParams } from 'react-router'
import AsyncContent from '../components/common/AsyncContent'
import SmartImage from '../components/common/SmartImage'
import { EmptyState } from '../components/common/StateMessages'
import MediaGallery from '../components/gallery/MediaGallery'
import ProjectPager from '../components/projects/ProjectPager'
import VideoPlayer from '../components/projects/VideoPlayer'
import { usePageMeta } from '../hooks/usePageMeta'
import { useProject } from '../hooks/useProjects'
import { portfolioCategoryUrl, ROUTES } from '../routes/paths'
import { getCategoryLabel } from '../services/projectService'
import { formatMonthYear, toParagraphs } from '../utils/format'

export default function ProjectDetails() {
  const { slug } = useParams()
  const projectState = useProject(slug)
  const project = projectState.data?.project

  usePageMeta({
    title: project ? project.title : projectState.status === 'success' ? 'Réalisation introuvable' : 'Réalisation',
    description: project?.excerpt,
  })

  return (
    <AsyncContent
      {...projectState}
      isEmpty={(data) => !data?.project}
      empty={
        <div className="container section">
          <h1 className="visually-hidden">Réalisation introuvable</h1>
          <EmptyState
            title="Réalisation introuvable"
            message="Ce projet n'existe pas ou n'est plus publié."
            action={
              <Link to={ROUTES.portfolio} className="text-link">
                ← Retour aux réalisations
              </Link>
            }
          />
        </div>
      }
    >
      {({ project: current, previous, next }) => (
        <article className="section">
          <div className="container stack">
            <Link to={ROUTES.portfolio} className="text-link">
              ← Toutes les réalisations
            </Link>
            <p className="eyebrow">
              <Link to={portfolioCategoryUrl(current.category)}>{getCategoryLabel(current.category)}</Link>
              {current.projectDate && ` · ${formatMonthYear(current.projectDate)}`}
            </p>
            <h1 className="page-header__title">{current.title}</h1>
            {current.excerpt && <p className="lead">{current.excerpt}</p>}

            <SmartImage src={current.coverImage?.url} alt={current.coverImage?.alt ?? current.title} ratio="3 / 2" priority />

            {toParagraphs(current.description).map((paragraph) => (
              <p key={paragraph} className="prose">
                {paragraph}
              </p>
            ))}

            {current.videoUrl && (
              <>
                <h2 className="section-title">Vidéo</h2>
                <VideoPlayer url={current.videoUrl} title={current.title} poster={current.coverImage?.url} />
              </>
            )}

            {current.media.some((item) => item.type === 'image') && (
              <>
                <h2 className="section-title">Galerie</h2>
                <MediaGallery items={current.media} />
              </>
            )}

            <ProjectPager previous={previous} next={next} />
          </div>
        </article>
      )}
    </AsyncContent>
  )
}
