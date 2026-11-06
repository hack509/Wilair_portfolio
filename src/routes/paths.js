// URLs centralisées : à utiliser partout au lieu de chaînes en dur.
export const ROUTES = {
  home: '/',
  about: '/a-propos',
  services: '/services',
  portfolio: '/realisations',
  project: (slug) => `/realisations/${slug}`,
  audio: '/audio',
  career: '/parcours',
  skills: '/formation-competences',
  contact: '/contact',
  admin: {
    dashboard: '/admin',
    login: '/admin/connexion',
    forgotPassword: '/admin/mot-de-passe-oublie',
    resetPassword: '/admin/nouveau-mot-de-passe',
    projects: '/admin/realisations',
    newProject: '/admin/realisations/nouvelle',
    project: (id) => `/admin/realisations/${id}`,
    audio: '/admin/audios',
    newAudio: '/admin/audios/nouveau',
    audioTrack: (id) => `/admin/audios/${id}`,
    services: '/admin/services',
    newService: '/admin/services/nouveau',
    service: (id) => `/admin/services/${id}`,
    profile: '/admin/profil',
    messages: '/admin/messages',
  },
}

export const portfolioCategoryUrl = (category) =>
  category ? `${ROUTES.portfolio}?categorie=${encodeURIComponent(category)}` : ROUTES.portfolio

export const serviceContactUrl = (serviceSlug) =>
  `${ROUTES.contact}?service=${encodeURIComponent(serviceSlug)}`
