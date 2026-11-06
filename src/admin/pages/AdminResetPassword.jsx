import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import Button from '../../components/common/Button'
import { Loader } from '../../components/common/StateMessages'
import FormField from '../../components/forms/FormField'
import { useAuth } from '../../hooks/useAuth'
import { usePageMeta } from '../../hooks/usePageMeta'
import { ROUTES } from '../../routes/paths'
import { updatePassword } from '../../services/authService'
import { getErrorMessage } from '../../utils/errors'
import Notice from '../components/Notice'

const MIN_LENGTH = 10

// Page d'arrivée du lien reçu par e-mail : Supabase ouvre une session à partir de ce lien.
export default function AdminResetPassword() {
  usePageMeta({ title: 'Nouveau mot de passe' })
  const { status } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (status === 'loading') return <Loader />

  if (status === 'anonymous') {
    return (
      <main className="admin-auth">
        <div className="admin-auth__card">
          <h1 className="admin-auth__title">Lien expiré</h1>
          <p>Ce lien n’est plus valide. Demandez-en un nouveau.</p>
          <Link to={ROUTES.admin.forgotPassword} className="text-link">
            Mot de passe oublié
          </Link>
        </div>
      </main>
    )
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (password.length < MIN_LENGTH) {
      setError(`Le mot de passe doit contenir au moins ${MIN_LENGTH} caractères.`)
      return
    }
    if (password !== confirmation) {
      setError('Les deux mots de passe ne correspondent pas.')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      await updatePassword(password)
      navigate(ROUTES.admin.dashboard, { replace: true })
    } catch (updateError) {
      setError(getErrorMessage(updateError))
      setSubmitting(false)
    }
  }

  return (
    <main className="admin-auth">
      <form className="admin-auth__card form" onSubmit={onSubmit}>
        <h1 className="admin-auth__title">Nouveau mot de passe</h1>
        {error && <Notice type="error">{error}</Notice>}
        <FormField id="password" type="password" label="Nouveau mot de passe" autoComplete="new-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
        <FormField id="confirmation" type="password" label="Confirmation" autoComplete="new-password" required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </form>
    </main>
  )
}
