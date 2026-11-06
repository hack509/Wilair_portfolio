import { Link } from 'react-router'
import { usePageMeta } from '../../hooks/usePageMeta'
import { ROUTES } from '../../routes/paths'

// Affiché tant que les variables Supabase ne sont pas renseignées.
export default function AdminSetup() {
  usePageMeta({ title: 'Administration' })

  return (
    <main className="admin-auth">
      <div className="admin-auth__card">
        <h1 className="admin-auth__title">Administration non configurée</h1>
        <p>L’espace d’administration a besoin d’un projet Supabase pour enregistrer les contenus.</p>
        <ol className="admin-steps">
          <li>Créer un projet Supabase et y appliquer les migrations du dossier supabase/migrations.</li>
          <li>Renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY (voir .env.example).</li>
          <li>Créer le compte du propriétaire et l’ajouter à la table admin_users.</li>
        </ol>
        <p className="muted">Le détail de chaque étape se trouve dans docs/ADMIN.md.</p>
        <Link to={ROUTES.home} className="text-link">
          ← Retour au site
        </Link>
      </div>
    </main>
  )
}
