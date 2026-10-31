// URLs publiques centralisées : à utiliser partout au lieu de chaînes en dur.
export const ROUTES = {
  home: '/',
  about: '/a-propos',
  services: '/services',
  portfolio: '/realisations',
  project: (slug) => `/realisations/${slug}`,
  career: '/parcours',
  skills: '/formation-competences',
  contact: '/contact',
}

export const portfolioCategoryUrl = (category) =>
  category ? `${ROUTES.portfolio}?categorie=${encodeURIComponent(category)}` : ROUTES.portfolio

export const serviceContactUrl = (serviceSlug) =>
  `${ROUTES.contact}?service=${encodeURIComponent(serviceSlug)}`
