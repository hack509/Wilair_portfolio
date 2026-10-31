import { ArrowRight } from 'lucide-react'
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
              <h1 className="hero__title">{profile.fullName}</h1>
              <p className="hero__specialties">{profile.specialties.join(' | ')}</p>
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
            <SmartImage
              src={profile.heroImage?.url}
              alt={profile.heroImage?.alt ?? 'Photographie principale'}
              placeholderLabel="Photographie principale"
              ratio="4 / 5"
              priority
            />
          </div>
        </section>
      )}
    </AsyncContent>
  )
}
