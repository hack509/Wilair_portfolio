/**
 * Informations du propriétaire — source unique pour tout le site.
 * Photos : laisser `null` tant qu'aucune photo n'est fournie ; un emplacement « à remplacer » s'affiche.
 * Exemple : heroImage: { url: '/images/hero.jpg', alt: 'Wilair Joseph en reportage' }
 */
export const profileData = {
  fullName: 'Wilair Joseph',
  firstName: 'Wilair',
  lastName: 'Joseph',
  specialties: ['Photographe', 'Journaliste', 'Publicitaire', 'Vidéaste'],
  location: 'Gonaïves',

  shortIntro: 'Photographe, journaliste, publicitaire et vidéaste basé aux Gonaïves.',

  biography: [
    "Passionné par l'image et la communication depuis son plus jeune âge, Wilair Joseph développe particulièrement son travail dans le portrait, la photographie événementielle et le photojournalisme.",
    "Il met également sa voix, son sens de la communication et sa capacité d'adaptation au service des productions publicitaires et des entreprises.",
    "Il poursuit des études en droit et en sciences administratives à l'EDSEG.",
  ],

  focusAreas: ['Portrait', 'Photographie événementielle', 'Photojournalisme', 'Production publicitaire'],

  heroImage: null,
  profileImage: null,

  phone: '+509 35 35 3531',
  phoneHref: 'tel:+50935353531',
  // ⚠ Adresse reprise telle que fournie (« gmai.com ») — à vérifier.
  email: 'Wilwilairjoseph@gmai.com',

  // ⚠ URL exacte du profil non fournie : lien de recherche Facebook en attendant.
  socialLinks: [
    {
      platform: 'facebook',
      label: 'Facebook — Wilair Joseph',
      url: 'https://www.facebook.com/search/top?q=Wilair%20Joseph',
    },
  ],

  contactInvitation:
    "Vous avez besoin d'un photographe, d'un journaliste ou d'un professionnel de la communication audiovisuelle ? Discutons de votre projet.",

  experiences: [
    {
      id: 'exp-zoom-programmation',
      role: 'Directeur de programmation',
      organization: 'Radio Télé Zoom, Gonaïves',
      startYear: '2020',
      endYear: null,
      tasks: [
        'Supervision et coordination des programmes radiophoniques et télévisuels.',
        'Gestion des équipes techniques et éditoriales.',
        'Planification des contenus et des programmes de diffusion.',
      ],
    },
    {
      id: 'exp-zoom-administrateur',
      role: 'Administrateur',
      organization: 'Radio Télé Zoom, Gonaïves',
      startYear: '2020',
      endYear: null,
      tasks: [
        'Gestion des opérations quotidiennes.',
        'Coordination des ressources humaines et matérielles.',
        'Optimisation des processus administratifs et opérationnels.',
      ],
    },
    {
      id: 'exp-storm-journaliste',
      role: 'Journaliste',
      organization: 'Radio Télé Storm',
      startYear: '2019',
      endYear: '2020',
      tasks: [
        'Recherche et rédaction de reportages.',
        "Conduite d'interviews.",
        'Édition de contenus multimédias.',
        "Couverture d'événements locaux et nationaux.",
      ],
    },
  ],

  collaborations: [
    { id: 'col-storm', name: 'Radio Storm TV', location: 'Port-au-Prince' },
    { id: 'col-zoom', name: 'Radio Télé Zoom', location: 'Gonaïves' },
    { id: 'col-media6', name: 'Media6Haïti', location: null },
  ],

  education: [
    "Études en droit et en sciences administratives à l'EDSEG.",
    'Formation en journalisme.',
    'Formation en photographie et vidéographie.',
  ],

  skills: [
    'Recherche et rédaction journalistique.',
    'Présentation et animation radiophonique et télévisuelle.',
    'Stratégies de communication et publicité.',
    'Photographie et vidéographie.',
    "Gestion et analyse de l'information.",
  ],

  tools: ['Microsoft Word', 'Microsoft Excel', 'Microsoft PowerPoint', 'Adobe Premiere Pro', 'Final Cut Pro', 'Cubase', 'Audacity'],

  languages: [
    { id: 'lang-ht', name: 'Créole haïtien', level: 'Langue maternelle' },
    { id: 'lang-fr', name: 'Français', level: 'Niveau avancé' },
    { id: 'lang-en', name: 'Anglais', level: 'Niveau débutant' },
  ],
}
