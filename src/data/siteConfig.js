import { ROUTES } from '../routes/paths'

export const siteConfig = {
  siteName: 'Wilair Joseph',
  defaultTitle: 'Wilair Joseph — Photographe, journaliste, publicitaire, vidéaste',
  defaultDescription:
    'Wilair Joseph, photographe, journaliste, publicitaire et vidéaste basé aux Gonaïves.',
  navigation: [
    { label: 'Accueil', to: ROUTES.home, end: true },
    { label: 'À propos', to: ROUTES.about },
    { label: 'Services', to: ROUTES.services },
    { label: 'Réalisations', to: ROUTES.portfolio },
    { label: 'Audio', to: ROUTES.audio },
    { label: 'Parcours', to: ROUTES.career },
    { label: 'Formation', to: ROUTES.skills },
    { label: 'Contact', to: ROUTES.contact, cta: true },
  ],
}
