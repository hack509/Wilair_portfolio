import { useEffect } from 'react'
import { siteConfig } from '../data/siteConfig'

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

// Titre de l'onglet et balises meta propres à chaque page (SEO et partage).
export function usePageMeta({ title, description } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${siteConfig.siteName}` : siteConfig.defaultTitle
    const metaDescription = description || siteConfig.defaultDescription

    document.title = fullTitle
    setMeta('name', 'description', metaDescription)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', metaDescription)
  }, [title, description])
}
