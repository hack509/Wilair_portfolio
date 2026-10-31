import { useCallback, useEffect, useState } from 'react'

/**
 * Exécute une fonction asynchrone et expose un état uniforme :
 *   status : 'loading' | 'success' | 'error'
 * `deps` relance la requête lorsqu'une valeur change ; `reload()` la relance manuellement.
 */
export function useAsync(fetcher, deps = []) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    setState((previous) => ({ ...previous, status: 'loading', error: null }))

    fetcher().then(
      (data) => active && setState({ status: 'success', data, error: null }),
      (error) => {
        if (!active) return
        console.error(error)
        setState({ status: 'error', data: null, error })
      },
    )

    return () => {
      active = false
    }
    // `fetcher` est volontairement exclu : seules les dépendances déclarées relancent la requête.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt])

  const reload = useCallback(() => setAttempt((value) => value + 1), [])

  return { ...state, reload }
}
