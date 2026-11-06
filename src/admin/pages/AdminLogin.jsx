import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router'
import Button from '../../components/common/Button'
import FormField from '../../components/forms/FormField'
import { useAuth } from '../../hooks/useAuth'
import { usePageMeta } from '../../hooks/usePageMeta'
import { ROUTES } from '../../routes/paths'
import { signIn, signOut } from '../../services/authService'
import { getErrorMessage } from '../../utils/errors'
import Notice from '../components/Notice'

export default function AdminLogin() {
  usePageMeta({ title: 'Connexion' })
  const { status } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Compte valide mais sans droits d'administration : on ferme la session.
  useEffect(() => {
    if (status !== 'forbidden') return
    signOut()
      .catch(() => {})
      .finally(() => setError('Ce compte n’a pas accès à l’administration.'))
  }, [status])

  if (status === 'authenticated') {
    return <Navigate to={location.state?.from ?? ROUTES.admin.dashboard} replace />
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await signIn(email.trim(), password)
    } catch (signInError) {
      setError(getErrorMessage(signInError))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="admin-auth">
      <form className="admin-auth__card form" onSubmit={onSubmit}>
        <h1 className="admin-auth__title">Administration</h1>
        {error && <Notice type="error">{error}</Notice>}
        <FormField id="email" type="email" label="Adresse e-mail" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
        <FormField id="password" type="password" label="Mot de passe" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Connexion…' : 'Se connecter'}
        </Button>
        <div className="admin-auth__links">
          <Link to={ROUTES.admin.forgotPassword} className="text-link">
            Mot de passe oublié ?
          </Link>
          <Link to={ROUTES.home} className="text-link">
            Retour au site
          </Link>
        </div>
      </form>
    </main>
  )
}
