import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { checkIsAdmin } from '../services/authService'
import { AuthContext } from './authContext'

/**
 * Session de l'administrateur.
 *   status : 'loading' | 'anonymous' | 'authenticated' | 'forbidden' | 'error'
 * « forbidden » : connecté, mais le compte n'est pas dans la table admin_users.
 * Ce statut ne sert qu'à l'affichage : la protection réelle est assurée par RLS.
 */
export default function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined)
  const [adminCheck, setAdminCheck] = useState({ userId: null, result: null })
  const [attempt, setAttempt] = useState(0)
  const userId = session?.user?.id ?? null

  useEffect(() => {
    let active = true
    supabase.auth.getSession().then(({ data }) => active && setSession(data.session))

    // Ne pas appeler Supabase dans ce rappel : le client y détient un verrou interne.
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!userId) return undefined
    let active = true
    checkIsAdmin().then(
      (isAdmin) => active && setAdminCheck({ userId, result: isAdmin ? 'authenticated' : 'forbidden' }),
      () => active && setAdminCheck({ userId, result: 'error' }),
    )
    return () => {
      active = false
    }
  }, [userId, attempt])

  const retry = useCallback(() => {
    setAdminCheck({ userId: null, result: null })
    setAttempt((value) => value + 1)
  }, [])

  const value = useMemo(() => {
    let status = 'loading'
    if (session === null) status = 'anonymous'
    else if (session && adminCheck.userId === userId) status = adminCheck.result
    return { status, user: session?.user ?? null, retry }
  }, [session, adminCheck, userId, retry])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
