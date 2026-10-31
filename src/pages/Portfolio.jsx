import { useSearchParams } from 'react-router'
import AsyncContent from '../components/common/AsyncContent'
import PageHeader from '../components/common/PageHeader'
import CategoryFilter from '../components/gallery/CategoryFilter'
import PlaceholderGrid from '../components/gallery/PlaceholderGrid'
import ProjectGrid from '../components/gallery/ProjectGrid'
import { projectCategories } from '../data/categoriesData'
import { usePageMeta } from '../hooks/usePageMeta'
import { useProjects } from '../hooks/useProjects'

export default function Portfolio() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requested = searchParams.get('categorie')
  // Une catégorie inconnue dans l'URL est ignorée.
  const activeCategory = projectCategories.find((item) => item.slug === requested) ?? null

  const projectsState = useProjects({ category: activeCategory?.slug })

  usePageMeta({
    title: activeCategory ? `${activeCategory.label} — Réalisations` : 'Réalisations',
    description: 'Portraits, événements, reportages, productions audiovisuelles et publicitaires.',
  })

  const selectCategory = (slug) => {
    setSearchParams(slug ? { categorie: slug } : {}, { replace: true, preventScrollReset: true })
  }

  return (
    <>
      <PageHeader eyebrow="Réalisations" title="Réalisations" intro="Photographies, reportages et productions audiovisuelles." />
      <section className="section">
        <div className="container">
          <CategoryFilter categories={projectCategories} active={activeCategory?.slug} onChange={selectCategory} />
          <AsyncContent
            {...projectsState}
            empty={<PlaceholderGrid categories={activeCategory ? [activeCategory] : projectCategories} />}
          >
            {(projects) => <ProjectGrid projects={projects} />}
          </AsyncContent>
        </div>
      </section>
    </>
  )
}
