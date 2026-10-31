# Portfolio — Wilair Joseph

Portfolio de Wilair Joseph : photographe, journaliste, publicitaire et vidéaste basé aux Gonaïves.

## Démarrage

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # build de production dans dist/
npm run lint
```

## Pages

| URL | Page |
|---|---|
| `/` | Accueil |
| `/a-propos` | À propos |
| `/services` | Services (ancres `#photographie`, `#journalisme`, `#publicite-communication`, `#videographie`) |
| `/realisations` | Réalisations, filtrables (`?categorie=portraits`…) |
| `/realisations/:slug` | Détail d'une réalisation (photos en plein écran, vidéo) |
| `/parcours` | Parcours professionnel et collaborations |
| `/formation-competences` | Formation, compétences, outils, langues |
| `/contact` | Coordonnées, boutons d'appel / e-mail, formulaire |

## Modifier les contenus

Tout le contenu est dans `src/data/` — aucun texte n'est écrit dans les composants.

| Fichier | Contenu |
|---|---|
| `profileData.js` | Présentation, coordonnées, parcours, formation, compétences, langues, photos |
| `servicesData.js` | Les quatre services |
| `projectsData.js` | Les réalisations (vide pour l'instant ; un modèle est fourni en commentaire) |
| `categoriesData.js` | Catégories de la galerie |

### Ajouter des photos

1. Déposer les fichiers dans `public/images/` (ex. `public/images/hero.jpg`).
2. Renseigner le champ correspondant, ex. dans `profileData.js` :
   `heroImage: { url: '/images/hero.jpg', alt: 'Description de la photo' }`.

Tant qu'un champ image vaut `null`, un emplacement « à remplacer » s'affiche.

## Points à vérifier

- **E-mail** : `Wilwilairjoseph@gmai.com` est repris tel que fourni — « gmai.com » est probablement « gmail.com ».
- **Facebook** : l'URL exacte du profil n'a pas été fournie ; le lien mène à une recherche « Wilair Joseph ».

## Architecture

```
composant → hook (src/hooks) → service (src/services) → données (src/data)
```

En phase 2 (Supabase), seuls les fichiers de `src/services/` changeront.
Le formulaire de contact ouvre pour l'instant la messagerie du visiteur avec le message prérempli.

## Déploiement

Commande `npm run build`, dossier publié `dist`. Les redirections nécessaires sont configurées
pour Netlify (`public/_redirects`) et Vercel (`vercel.json`).
