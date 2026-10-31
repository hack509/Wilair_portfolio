/**
 * Services. `image: null` affiche un emplacement « à remplacer ».
 * Exemple : image: { url: '/images/services/photographie.jpg', alt: 'Séance portrait' }
 */
export const servicesData = [
  {
    id: 'svc-photographie',
    slug: 'photographie',
    title: 'Photographie',
    icon: 'camera',
    description: 'Portraits, événements et photojournalisme.',
    items: ['Portraits', 'Photographie événementielle', 'Photojournalisme'],
    image: null,
    isPublished: true,
    displayOrder: 1,
  },
  {
    id: 'svc-journalisme',
    slug: 'journalisme',
    title: 'Journalisme',
    icon: 'newspaper',
    description: 'Recherche, rédaction, reportages et interviews.',
    items: ['Recherche et rédaction journalistique', 'Reportages', 'Interviews', "Couverture d'événements"],
    image: null,
    isPublished: true,
    displayOrder: 2,
  },
  {
    id: 'svc-publicite',
    slug: 'publicite-communication',
    title: 'Publicité et communication',
    icon: 'megaphone',
    description: 'Spots, voix off, présentation et communication audiovisuelle.',
    items: ['Spots publicitaires', 'Voix off', 'Présentation et animation', 'Communication audiovisuelle'],
    image: null,
    isPublished: true,
    displayOrder: 3,
  },
  {
    id: 'svc-videographie',
    slug: 'videographie',
    title: 'Vidéographie',
    icon: 'video',
    description: 'Captation, production et montage vidéo.',
    items: ['Captation vidéo', 'Production audiovisuelle', 'Montage vidéo'],
    image: null,
    isPublished: true,
    displayOrder: 4,
  },
]
