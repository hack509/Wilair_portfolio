import { useState } from 'react'
import { Link } from 'react-router'
import Button from '../../components/common/Button'
import FormField from '../../components/forms/FormField'
import { usePageMeta } from '../../hooks/usePageMeta'
import { ROUTES } from '../../routes/paths'
import { requestPasswordReset } from '../../services/authService'
import { getErrorMessage } from '../../utils/errors'
import Notice from '../components/Notice'

export default function AdminForgotPassword() {
  usePageMeta({ title: 'Mot de passe oublié' })
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [notice, setNotice] = useState(null)

  const onSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setNotice(null)
    try {
      await requestPasswordReset(email.trim())
      setNotice({ type: 'success', text: 'Si ce compte existe, un e-mail de réinitialisation vient d’être envoyé.' })
    } catch (error) {
      setNotice({ type: 'error', text: getErrorMessage(error) })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="admin-auth">
      <form className="admin-auth__card form" onSubmit={onSubmit}>
        <h1 className="admin-auth__title">Mot de passe oublié</h1>
        {notice && <Notice type={notice.type}>{notice.text}</Notice>}
        <FormField id="email" type="email" label="Adresse e-mail" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Envoi…' : 'Recevoir le lien'}
        </Button>
        <Link to={ROUTES.admin.login} className="text-link">
          ← Retour à la connexion
        </Link>
      </form>
    </main>
  )
}
