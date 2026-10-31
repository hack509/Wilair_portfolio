import AsyncContent from '../components/common/AsyncContent'
import PageHeader from '../components/common/PageHeader'
import SmartImage from '../components/common/SmartImage'
import { usePageMeta } from '../hooks/usePageMeta'
import { useProfile } from '../hooks/useProfile'
import { ROUTES } from '../routes/paths'
import { Link } from 'react-router'

export default function About() {
  const profileState = useProfile()
  usePageMeta({
    title: 'À propos',
    description: "Wilair Joseph : passionné par l'image et la communication, basé aux Gonaïves.",
  })

  return (
    <>
      <PageHeader eyebrow="À propos" title="Wilair Joseph" intro="L'image et la communication, depuis toujours." />
      <AsyncContent {...profileState}>
        {(profile) => (
          <section className="section">
            <div className="container split">
              <SmartImage
                src={profile.profileImage?.url}
                alt={profile.profileImage?.alt ?? 'Portrait de Wilair Joseph'}
                placeholderLabel="Portrait de présentation"
                ratio="4 / 5"
              />
              <div className="stack">
                {profile.biography.map((paragraph) => (
                  <p key={paragraph} className="lead">
                    {paragraph}
                  </p>
                ))}

                <h2 className="section-title">Domaines de prédilection</h2>
                <ul className="tag-list">
                  {profile.focusAreas.map((area) => (
                    <li key={area} className="tag">
                      {area}
                    </li>
                  ))}
                </ul>

                <p>
                  <Link to={ROUTES.career} className="text-link">
                    Voir le parcours professionnel →
                  </Link>
                </p>
              </div>
            </div>
          </section>
        )}
      </AsyncContent>
    </>
  )
}
