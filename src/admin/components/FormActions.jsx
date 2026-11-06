import { Link } from 'react-router'
import Button from '../../components/common/Button'

// Barre d'enregistrement, toujours visible en bas des longs formulaires.
export default function FormActions({ saving, progress, cancelTo }) {
  return (
    <div className="admin-form-actions">
      <Button type="submit" disabled={saving}>
        {saving ? (progress || 'Enregistrement…') : 'Enregistrer'}
      </Button>
      {cancelTo && (
        <Link to={cancelTo} className="text-link">
          Annuler
        </Link>
      )}
    </div>
  )
}
