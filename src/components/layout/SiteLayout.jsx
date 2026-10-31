import { Suspense, useEffect, useRef } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import ChatbotWidget from '../chatbot/ChatbotWidget'
import { Loader } from '../common/StateMessages'
import WhatsAppButton from '../common/WhatsAppButton'
import Header from '../navigation/Header'
import Footer from './Footer'

export default function SiteLayout() {
  const { pathname } = useLocation()
  const mainRef = useRef(null)
  const firstRender = useRef(true)

  // Accessibilité : après un changement de page, le focus revient au contenu principal.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    // Sauf si le visiteur utilise l'assistant : il garde le focus dans la conversation.
    if (document.activeElement?.closest('.chatbot')) return
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <>
      <a href="#contenu" className="skip-link">
        Aller au contenu
      </a>
      <Header />
      <main id="contenu" ref={mainRef} tabIndex={-1} className="site-main">
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <div className="floating-actions">
        <ChatbotWidget />
        <WhatsAppButton floating />
      </div>
      <ScrollRestoration />
    </>
  )
}
