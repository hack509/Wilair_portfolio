import AsyncContent from '../components/common/AsyncContent'
import PageHeader from '../components/common/PageHeader'
import { usePageMeta } from '../hooks/usePageMeta'
import { useProfile } from '../hooks/useProfile'

export default function Skills() {
  const profileState = useProfile()
  usePageMeta({
    title: 'Formation et compétences',
    description: 'Formation, compétences professionnelles, outils et langues de Wilair Joseph.',
  })

  return (
    <>
      <PageHeader eyebrow="Formation" title="Formation et compétences" />
      <AsyncContent {...profileState}>
        {(profile) => (
          <section className="section">
            <div className="container grid grid--2">
              <div className="box">
                <h2 className="section-title">Formation</h2>
                <ul className="bullet-list">
                  {profile.education.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="box">
                <h2 className="section-title">Compétences professionnelles</h2>
                <ul className="bullet-list">
                  {profile.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>

              <div className="box">
                <h2 className="section-title">Outils et logiciels</h2>
                <ul className="tag-list">
                  {profile.tools.map((tool) => (
                    <li key={tool} className="tag">
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="box">
                <h2 className="section-title">Langues</h2>
                <dl className="definition-list">
                  {profile.languages.map((language) => (
                    <div key={language.id}>
                      <dt>{language.name}</dt>
                      <dd>{language.level}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>
        )}
      </AsyncContent>
    </>
  )
}
