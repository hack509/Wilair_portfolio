import { listServices } from '../services/serviceService'
import { useAsync } from './useAsync'

export function useServices() {
  return useAsync(listServices, [])
}
