import { Mail, Phone } from 'lucide-react'
import { useSearchParams } from 'react-router'
import AsyncContent from '../components/common/AsyncContent'
import Button from '../components/common/Button'
import PageHeader from '../components/common/PageHeader'
import SocialLinks from '../components/common/SocialLinks'
import ContactForm from '../components/forms/ContactForm'
import { usePageMeta } from '../hooks/usePageMeta'
import { useProfile } from '../hooks/useProfile'
import { useServices } from '../hooks/useServices'
import { toMailHref } from '../utils/format'

export default function Contact() {
  const profileState = useProfile()
  const { data: services } = useServices()
  const [searchParams] = useSearchParams()
  usePageMeta({
    title: 'Contact',
    description: 'Contacter Wilair Joseph : téléphone, e-mail et formulaire de contact.',
  })

  // Lien « Demander ce service » : l'objet du message est prérempli.
  const service = services?.find((item) => item.slug === searchParams.get('service'))
  const initialSubject = service ? `Demande — ${service.title}` : ''

  return (
    <>
      <PageHeader eyebrow="Contact" title="Contact" intro={profileState.data?.contactInvitation} />
      <AsyncContent {...profileState}>
        {(profile) => (
          <section className="section">
            <div className="container split">
              <div className="stack">
                <dl className="definition-list">
                  <div>
                    <dt>Téléphone</dt>
                    <dd>
                      <a href={profile.phoneHref}>{profile.phone}</a>
                    </dd>
                  </div>
                  <div>
                    <dt>E-mail</dt>
                    <dd>
                      <a href={toMailHref(profile.email)}>{profile.email}</a>
                    </dd>
                  </div>
                  <div>
                    <dt>Localisation</dt>
                    <dd>{profile.location}</dd>
                  </div>
                </dl>

                <div className="actions">
                  <Button href={profile.phoneHref} icon={Phone} iconPosition="start">
                    Appeler
                  </Button>
                  <Button href={toMailHref(profile.email, initialSubject)} variant="outline" icon={Mail} iconPosition="start">
                    Envoyer un e-mail
                  </Button>
                </div>

                <SocialLinks links={profile.socialLinks} />
              </div>

              <div className="box">
                <h2 className="section-title">Écrire un message</h2>
                <ContactForm key={initialSubject} recipientEmail={profile.email} initialSubject={initialSubject} />
              </div>
            </div>
          </section>
        )}
      </AsyncContent>
    </>
  )
}
