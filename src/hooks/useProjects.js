import { getProjectBySlug, listProjects } from '../services/projectService'
import { useAsync } from './useAsync'

export function useProjects({ category = null } = {}) {
  return useAsync(() => listProjects({ category }), [category])
}

export function useProject(slug) {
  return useAsync(() => getProjectBySlug(slug), [slug])
}
