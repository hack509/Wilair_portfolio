import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { getErrorMessage } from '../utils/errors'

// État d'un formulaire : `set('titre', valeur)` modifie un champ et efface son erreur.
export function useFormValues(initial) {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})

  const set = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current))
  }

  return { values, setValues, set, errors, setErrors }
}

/**
 * Exécute une action d'administration et expose son résultat.
 * `run(action, 'Message de réussite')` affiche la réussite ou l'erreur, puis recharge la liste.
 */
export function useAdminAction(reload) {
  const [notice, setNotice] = useState(null)
  const [busy, setBusy] = useState(false)

  const run = async (action, successText) => {
    setBusy(true)
    setNotice(null)
    try {
      await action()
      setNotice({ type: 'success', text: successText })
      reload?.()
    } catch (error) {
      setNotice({ type: 'error', text: getErrorMessage(error) })
    } finally {
      setBusy(false)
    }
  }

  return { notice, setNotice, busy, run }
}

// Message transmis par la page précédente (« Réalisation enregistrée »), affiché une seule fois.
export function useFlashNotice() {
  const location = useLocation()
  const navigate = useNavigate()
  const [flash] = useState(location.state?.notice ?? null)

  useEffect(() => {
    if (location.state?.notice) navigate(location.pathname, { replace: true, state: null })
  }, [location, navigate])

  return flash
}
