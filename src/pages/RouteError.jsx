import { isRouteErrorResponse, useRouteError } from 'react-router'

// Filet de sécurité si une page plante : affichage minimal, indépendant du reste du site.
export default function RouteError() {
  const error = useRouteError()
  console.error(error)
  const notFound = isRouteErrorResponse(error) && error.status === 404

  return (
    <main className="container section">
      <h1 className="page-header__title">{notFound ? 'Cette page n’existe pas.' : 'Une erreur est survenue.'}</h1>
      <p>
        <a href="/" className="text-link">
          Retour à l’accueil
        </a>
      </p>
    </main>
  )
}
