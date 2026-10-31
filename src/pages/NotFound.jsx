import Button from '../components/common/Button'
import PageHeader from '../components/common/PageHeader'
import { usePageMeta } from '../hooks/usePageMeta'
import { ROUTES } from '../routes/paths'

export default function NotFound() {
  usePageMeta({ title: 'Page introuvable' })

  return (
    <>
      <PageHeader eyebrow="Erreur 404" title="Cette page n’existe pas." intro="Le lien est peut-être erroné, ou la page a été déplacée." />
      <div className="container section">
        <Button to={ROUTES.home}>Retour à l’accueil</Button>
      </div>
    </>
  )
}
