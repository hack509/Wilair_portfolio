import { ArrowRight, MapPin } from 'lucide-react'
import AsyncContent from '../components/common/AsyncContent'
import Button from '../components/common/Button'
import SmartImage from '../components/common/SmartImage'
import { usePageMeta } from '../hooks/usePageMeta'
import { useProfile } from '../hooks/useProfile'
import { ROUTES } from '../routes/paths'

export default function Home() {
  usePageMeta()
  const profileState = useProfile()

  return (
    <AsyncContent {...profileState}>
      {(profile) => (
        <section className="hero">
          <div className="container hero__grid">
            <div className="hero__text">
              <p className="badge">
                <MapPin size={14} aria-hidden="true" /> Basé aux {profile.location}
              </p>
              <h1 className="hero__title">
                {profile.firstName} <span className="hero__accent">{profile.lastName}</span>
              </h1>
              <ul className="hero__specialties" aria-label="Spécialités">
                {profile.specialties.map((specialty) => (
                  <li key={specialty}>{specialty}</li>
                ))}
              </ul>
              <p className="hero__intro">{profile.shortIntro}</p>
              <div className="actions">
                <Button to={ROUTES.portfolio} icon={ArrowRight}>
                  Découvrir mon travail
                </Button>
                <Button to={ROUTES.contact} variant="outline">
                  Me contacter
                </Button>
              </div>
            </div>
            <div className="hero__media">
              <SmartImage
                src={profile.heroImage?.url}
                alt={profile.heroImage?.alt ?? 'Photographie principale'}
                placeholderLabel="Photographie principale"
                ratio="4 / 5"
                priority
              />
            </div>
          </div>
        </section>
      )}
    </AsyncContent>
  )
}
