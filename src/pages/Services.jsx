import { useEffect } from 'react'
import { useLocation } from 'react-router'
import AsyncContent from '../components/common/AsyncContent'
import PageHeader from '../components/common/PageHeader'
import ServiceCard from '../components/services/ServiceCard'
import { usePageMeta } from '../hooks/usePageMeta'
import { useServices } from '../hooks/useServices'

export default function Services() {
  const servicesState = useServices()
  const { hash } = useLocation()
  usePageMeta({
    title: 'Services',
    description: 'Photographie, journalisme, publicité et communication, vidéographie.',
  })

  // Lien direct vers un service (#slug) : on le rejoint une fois la liste affichée.
  useEffect(() => {
    if (servicesState.status !== 'success' || !hash) return
    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
  }, [servicesState.status, hash])

  return (
    <>
      <PageHeader eyebrow="Services" title="Services" intro="Quatre domaines, au service de vos projets." />
      <section className="section">
        <div className="container">
          <AsyncContent {...servicesState}>
            {(services) => (
              <div className="grid grid--2">
                {services.map((service, index) => (
                  <ServiceCard key={service.id} service={service} index={index} />
                ))}
              </div>
            )}
          </AsyncContent>
        </div>
      </section>
    </>
  )
}
