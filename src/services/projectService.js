import { projectCategories } from '../data/categoriesData'
import { projectsData } from '../data/projectsData'
import { fromLocal } from './localSource'

// Ordre public : ordre d'affichage, puis date décroissante.
function sortProjects(a, b) {
  return a.displayOrder - b.displayOrder || (b.projectDate ?? '').localeCompare(a.projectDate ?? '')
}

const publishedProjects = () => projectsData.filter((project) => project.isPublished).sort(sortProjects)

export function listProjects({ category = null } = {}) {
  return fromLocal(() => {
    const projects = publishedProjects()
    return category ? projects.filter((project) => project.category === category) : projects
  })
}

// Projet publié et ses voisins (navigation précédent / suivant).
export function getProjectBySlug(slug) {
  return fromLocal(() => {
    const projects = publishedProjects()
    const index = projects.findIndex((project) => project.slug === slug)
    if (index === -1) return { project: null, previous: null, next: null }

    const pick = (item) => (item ? { slug: item.slug, title: item.title } : null)
    return { project: projects[index], previous: pick(projects[index - 1]), next: pick(projects[index + 1]) }
  })
}

export const getCategory = (slug) => projectCategories.find((category) => category.slug === slug)

export const getCategoryLabel = (slug) => getCategory(slug)?.label ?? slug
