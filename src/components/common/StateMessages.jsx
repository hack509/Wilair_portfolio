import { RefreshCw } from 'lucide-react'
import Button from './Button'

export function Loader({ label = 'Chargement…' }) {
  return (
    <p className="state" role="status">
      {label}
    </p>
  )
}

export function EmptyState({ title = 'Aucun contenu pour le moment', message, action }) {
  return (
    <div className="state">
      <p className="state__title">{title}</p>
      {message && <p>{message}</p>}
      {action}
    </div>
  )
}

export function ErrorState({ title = 'Chargement impossible', message, onRetry }) {
  return (
    <div className="state" role="alert">
      <p className="state__title">{title}</p>
      {message && <p>{message}</p>}
      {onRetry && (
        <Button variant="outline" icon={RefreshCw} iconPosition="start" onClick={onRetry}>
          Réessayer
        </Button>
      )}
    </div>
  )
}
