import { getErrorMessage } from '../../utils/errors'
import { EmptyState, ErrorState, Loader } from './StateMessages'

const defaultIsEmpty = (data) => data == null || (Array.isArray(data) && data.length === 0)

// Affiche l'état d'une donnée asynchrone : chargement, erreur, vide, ou contenu (`children(data)`).
export default function AsyncContent({ status, data, error, reload, children, isEmpty = defaultIsEmpty, empty }) {
  if (status === 'loading' && data == null) return <Loader />
  if (status === 'error') return <ErrorState message={getErrorMessage(error)} onRetry={reload} />
  if (isEmpty(data)) return empty ?? <EmptyState />
  return children(data)
}
