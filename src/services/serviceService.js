import { servicesData } from '../data/servicesData'
import { fromLocal } from './localSource'

export function listServices() {
  return fromLocal(() =>
    servicesData.filter((service) => service.isPublished).sort((a, b) => a.displayOrder - b.displayOrder),
  )
}
