import { useProfile } from '../../hooks/useProfile'
import { toWhatsAppHref } from '../../utils/whatsapp'
import SocialIcon from './SocialIcon'

// Bouton WhatsApp. `floating` : bouton rond fixé en bas de l'écran, visible sur toutes les pages.
export default function WhatsAppButton({ floating = false, label = 'Écrire sur WhatsApp' }) {
  const { data: profile } = useProfile()
  const href = toWhatsAppHref(profile?.whatsappNumber, profile?.whatsappMessage)
  if (!href) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={floating ? 'whatsapp-float' : 'btn btn--whatsapp'}
      aria-label={floating ? `${label} (nouvel onglet)` : undefined}
    >
      <SocialIcon platform="whatsapp" size={floating ? 26 : 18} />
      {!floating && <span>{label}</span>}
    </a>
  )
}
