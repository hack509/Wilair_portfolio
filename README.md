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
| `/audio` | Audios à écouter, filtrables (`?categorie=voix-off`…) |
| `/parcours` | Parcours professionnel et collaborations |
| `/formation-competences` | Formation, compétences, outils, langues |
| `/contact` | Coordonnées, boutons d'appel / e-mail, formulaire |
| `/admin` | Administration privée (voir [docs/ADMIN.md](docs/ADMIN.md)) |

## Modifier les contenus

**Avec Supabase configuré**, tout se gère depuis `/admin`, sans toucher au code : réalisations, audios, services,
profil et messages. La mise en service et l'utilisation sont décrites dans [docs/ADMIN.md](docs/ADMIN.md).

**Sans Supabase**, le site public lit les fichiers de `src/data/` :

| Fichier | Contenu |
|---|---|
| `profileData.js` | Présentation, coordonnées, parcours, formation, compétences, langues, photos |
| `servicesData.js` | Les quatre services |
| `projectsData.js` | Les réalisations (vide pour l'instant ; un modèle est fourni en commentaire) |
| `audioData.js` | Catégories et audios de la page Audio |
| `categoriesData.js` | Catégories de la galerie (utilisées dans les deux cas) |

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

Les composants n'accèdent jamais directement à Supabase : tout passe par `src/services/`.
Chaque service interroge Supabase si `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont définies, sinon `src/data/`.

- `src/admin/` : espace d'administration, chargé uniquement sur `/admin`.
- `supabase/migrations/` : schéma, règles de sécurité (RLS), stockage et contenu initial.

Le formulaire de contact enregistre les messages dans Supabase. Sans Supabase, il ouvre la messagerie du visiteur.

## Déploiement

Commande `npm run build`, dossier publié `dist`. Les redirections nécessaires sont configurées
pour Netlify (`public/_redirects`) et Vercel (`vercel.json`). Ajouter les variables de `.env.example` chez l'hébergeur.

## WhatsApp et assistant de navigation

- **WhatsApp** : bouton flottant sur toutes les pages et bouton sur la page Contact.
  Numéro et message prérempli : `whatsappNumber` et `whatsappMessage` dans `src/data/profileData.js`.
- **Assistant** (bulle violette) : oriente le visiteur vers la bonne page à partir de mots-clés.
  Il fonctionne sans serveur ni IA. Pour ajouter un sujet ou des mots-clés : `src/data/chatbotData.js`.
