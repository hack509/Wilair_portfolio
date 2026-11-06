import { ROUTES } from '../routes/paths'

/**
 * Assistant de navigation : chaque intention associe des mots-clés à une page.
 * Les mots-clés sont comparés sans accents ni majuscules.
 * `to` : page interne · `whatsapp: true` : propose le lien WhatsApp.
 */
export const chatbotGreeting =
  'Bonjour ! Je peux vous orienter dans le site. Choisissez un sujet ou posez votre question.'

export const chatbotFallback =
  "Je n'ai pas bien compris. Voici les pages que je peux vous montrer :"

export const chatbotIntents = [
  { id: 'accueil', label: 'Accueil', to: ROUTES.home, answer: "Je vous ramène à l'accueil.", keywords: ['accueil', 'debut', 'home', 'principal'] },
  { id: 'about', label: 'À propos', to: ROUTES.about, answer: 'Voici la présentation de Wilair Joseph.', keywords: ['propos', 'qui', 'biographie', 'presentation', 'profil', 'wilair', 'joseph'] },
  { id: 'services', label: 'Services', to: ROUTES.services, answer: 'Voici les quatre services proposés.', keywords: ['service', 'services', 'prestation', 'offre', 'tarif', 'prix', 'devis'] },
  { id: 'photo', label: 'Photographie', to: `${ROUTES.services}#photographie`, answer: 'Voici le service Photographie : portraits, événements, photojournalisme.', keywords: ['photo', 'photographe', 'photographie', 'portrait', 'evenement', 'evenementiel', 'photojournalisme'] },
  { id: 'journalisme', label: 'Journalisme', to: `${ROUTES.services}#journalisme`, answer: 'Voici le service Journalisme : reportages, interviews, couverture d’événements.', keywords: ['journalisme', 'journaliste', 'reportage', 'interview', 'article', 'redaction'] },
  { id: 'publicite', label: 'Publicité', to: `${ROUTES.services}#publicite-communication`, answer: 'Voici le service Publicité et communication : spots, voix off, animation.', keywords: ['publicite', 'pub', 'spot', 'voix', 'off', 'animation', 'animateur', 'communication', 'presentateur'] },
  { id: 'video', label: 'Vidéographie', to: `${ROUTES.services}#videographie`, answer: 'Voici le service Vidéographie : captation, production, montage.', keywords: ['video', 'videaste', 'videographie', 'montage', 'captation', 'film', 'tournage'] },
  { id: 'realisations', label: 'Réalisations', to: ROUTES.portfolio, answer: 'Voici les réalisations.', keywords: ['realisation', 'realisations', 'portfolio', 'travail', 'travaux', 'galerie', 'projet', 'projets'] },
  { id: 'audio', label: 'Audio', to: ROUTES.audio, answer: 'Voici les audios à écouter.', keywords: ['audio', 'audios', 'ecouter', 'son', 'sons', 'podcast', 'emission', 'emissions', 'enregistrement'] },
  { id: 'parcours', label: 'Parcours', to: ROUTES.career, answer: 'Voici le parcours professionnel.', keywords: ['parcours', 'experience', 'experiences', 'carriere', 'radio', 'tele', 'zoom', 'storm', 'media6haiti', 'collaboration'] },
  { id: 'formation', label: 'Formation', to: ROUTES.skills, answer: 'Voici la formation et les compétences.', keywords: ['formation', 'etude', 'etudes', 'diplome', 'competence', 'competences', 'logiciel', 'outil', 'langue', 'langues', 'edseg', 'droit'] },
  { id: 'contact', label: 'Contact', to: ROUTES.contact, answer: 'Voici la page Contact : téléphone, e-mail et formulaire.', keywords: ['contact', 'contacter', 'telephone', 'appeler', 'numero', 'email', 'mail', 'joindre', 'ecrire', 'message', 'facebook', 'rendez'] },
  { id: 'whatsapp', label: 'WhatsApp', whatsapp: true, answer: 'Vous pouvez écrire directement à Wilair Joseph sur WhatsApp :', keywords: ['whatsapp', 'whats', 'wa'] },
]

// Sujets proposés en boutons à l'ouverture.
export const chatbotSuggestions = ['services', 'realisations', 'audio', 'parcours', 'formation', 'contact', 'whatsapp']
