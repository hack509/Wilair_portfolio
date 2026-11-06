// Statut de publication d'un contenu.
export default function StatusBadge({ isPublished, isArchived = false }) {
  if (isArchived) return <span className="admin-badge admin-badge--muted">Archivé</span>
  if (isPublished) return <span className="admin-badge admin-badge--success">Publié</span>
  return <span className="admin-badge">Brouillon</span>
}
