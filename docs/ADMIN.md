# Administration du portfolio

Ce guide explique comment mettre en service l'espace d'administration, puis comment l'utiliser.
L'adresse de l'administration est `/admin` (elle n'apparaît volontairement pas dans le menu du site).

## 1. Mise en service (une seule fois)

### Créer le projet Supabase

1. Créer un compte et un projet sur [supabase.com](https://supabase.com).
2. Appliquer les deux migrations du dossier `supabase/migrations`, dans l'ordre :
   - soit avec l'outil en ligne de commande : `npx supabase link --project-ref <id-du-projet>` puis `npx supabase db push` ;
   - soit en copiant le contenu de chaque fichier dans **SQL Editor**, puis **Run**.

   La première crée les tables, les règles de sécurité et les espaces de stockage.
   La seconde reprend le profil et les services actuels, pour que le site ne se vide pas.

### Sécuriser l'authentification

Dans **Authentication > Sign In / Providers** : désactiver **Allow new users to sign up**.

Même sans cela, un compte non autorisé n'aurait aucun droit, mais cette option évite les inscriptions inutiles.

Dans **Authentication > URL Configuration** :

- **Site URL** : l'adresse publique du site (ex. `https://www.exemple.com`) ;
- **Redirect URLs** : ajouter `https://www.exemple.com/admin/nouveau-mot-de-passe`.

### Créer le compte du propriétaire

1. **Authentication > Users > Add user** : saisir l'e-mail et un mot de passe solide.
2. Dans **SQL Editor**, autoriser ce compte en remplaçant l'adresse :

   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'adresse@du-proprietaire.com';
   ```

Seuls les comptes présents dans `admin_users` ont accès à l'administration.
Cette table ne peut pas être modifiée depuis le site.

### Brancher le site

Récupérer l'URL du projet et la clé publique dans **Project Settings > API**.

- **En local** : copier `.env.example` en `.env.local` et renseigner les deux valeurs.
- **En ligne** (Vercel ou Netlify) : ajouter `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans les
  variables d'environnement du projet, puis redéployer.

Ne jamais utiliser la clé `service_role` dans le site : elle donne tous les droits et serait visible de tous.

## 2. Utilisation

| Rubrique | Ce qu'on peut faire |
|---|---|
| **Tableau de bord** | Voir les chiffres clés, les dernières modifications et les accès rapides |
| **Réalisations** | Créer, modifier, publier, passer en brouillon, archiver, restaurer, supprimer ; couverture, photos, vidéo |
| **Audios** | Créer, modifier, publier, passer en brouillon, supprimer ; envoi d'un fichier ou lien direct |
| **Services** | Créer, modifier, publier, désactiver, supprimer ; image et prestations |
| **Profil** | Modifier l'identité, la biographie, les photos, les coordonnées, les réseaux, le parcours, la formation, les langues |
| **Messages** | Lire, répondre, marquer lu ou non lu, archiver, supprimer |

Chaque contenu publié apparaît immédiatement sur le site, sans intervention technique.

### Bon à savoir

- **Brouillon** : un contenu non publié reste invisible sur le site.
- **Archiver ou supprimer** : archiver retire une réalisation du site sans la perdre. Supprimer est définitif et efface aussi ses fichiers.
- **Formats acceptés** :
  - photos : JPEG, PNG ou WebP, 10 Mo maximum (les très grandes images sont réduites automatiquement) ;
  - audios : MP3, M4A, WAV ou OGG, 50 Mo maximum ;
  - vidéos : MP4 ou WebM, 50 Mo maximum. Pour une vidéo plus lourde, utiliser un lien YouTube ou Vimeo.
- **Description des images** : elle sert aux personnes malvoyantes et au référencement. Si elle est vide, le titre est utilisé.
- **Droits des médias** : ne publier que des contenus dont vous détenez les droits, avec l'accord des personnes identifiables.

### Mot de passe oublié

Sur la page de connexion, **Mot de passe oublié ?** envoie un lien par e-mail.
L'envoi utilise le service d'e-mail intégré à Supabase, limité à quelques messages par heure.

## 3. Sauvegarde

Le plan gratuit de Supabase ne conserve pas de sauvegardes téléchargeables.
Exporter régulièrement la base : `npx supabase db dump --data-only -f sauvegarde.sql`.
Les fichiers se récupèrent dans **Storage**. Un projet gratuit inactif pendant plusieurs jours est mis en pause :
il se réactive depuis le tableau de bord Supabase.

## 4. Sécurité : ce qui est appliqué

La protection repose sur les règles de la base de données (Row Level Security), pas sur l'interface.

| Donnée | Public | Administrateur |
|---|---|---|
| Profil | Lecture | Lecture, écriture |
| Services, audios | Lecture des contenus publiés | Tout |
| Réalisations et leurs médias | Lecture des contenus publiés et non archivés | Tout |
| Messages | Envoi uniquement (aucune lecture) | Lecture, modification, suppression |
| Fichiers | Lecture par lien direct | Envoi, remplacement, suppression |
| `admin_users` | Aucun accès | Lecture de sa propre ligne ; ajout uniquement via SQL Editor |

## 5. Développement local

Docker doit être démarré.

```bash
npx supabase start     # base locale, migrations appliquées automatiquement
npx supabase status    # affiche l'URL et la clé à mettre dans .env.local
npm run dev
```
