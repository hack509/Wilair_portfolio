import AsyncContent from '../components/common/AsyncContent'
import PageHeader from '../components/common/PageHeader'
import Timeline from '../components/profile/Timeline'
import { usePageMeta } from '../hooks/usePageMeta'
import { useProfile } from '../hooks/useProfile'

export default function Career() {
  const profileState = useProfile()
  usePageMeta({
    title: 'Parcours',
    description: 'Expériences professionnelles et collaborations médiatiques de Wilair Joseph.',
  })

  return (
    <>
      <PageHeader eyebrow="Parcours" title="Parcours professionnel" />
      <AsyncContent {...profileState}>
        {(profile) => (
          <section className="section">
            <div className="container stack-lg">
              <div>
                <h2 className="section-title">Expériences</h2>
                <Timeline items={profile.experiences} />
              </div>

              <div>
                <h2 className="section-title">Collaborations médiatiques</h2>
                <ul className="grid grid--3">
                  {profile.collaborations.map((collaboration) => (
                    <li key={collaboration.id} className="box">
                      <p className="box__title">{collaboration.name}</p>
                      {collaboration.location && <p className="muted">{collaboration.location}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}
      </AsyncContent>
    </>
  )
}
