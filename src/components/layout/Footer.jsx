import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { siteConfig } from '../../data/siteConfig'
import { useProfile } from '../../hooks/useProfile'
import { ROUTES } from '../../routes/paths'
import { toMailHref } from '../../utils/format'
import { toWhatsAppHref } from '../../utils/whatsapp'
import SocialIcon from '../common/SocialIcon'
import SocialLinks from '../common/SocialLinks'

const CURRENT_YEAR = new Date().getFullYear()

export default function Footer() {
  const { pathname } = useLocation()
  const { data: profile } = useProfile()
  const whatsappHref = toWhatsAppHref(profile?.whatsappNumber, profile?.whatsappMessage)

  return (
    <footer className="site-footer">
      <div className="container">
        {/* Invitation au contact, masquée sur la page Contact elle-même. */}
        {profile && pathname !== ROUTES.contact && (
          <div className="site-footer__cta">
            <p className="site-footer__cta-text">{profile.contactInvitation}</p>
            <Link to={ROUTES.contact} className="btn btn--light">
              <span>Me contacter</span>
              <ArrowRight className="btn__icon" size={18} aria-hidden="true" />
            </Link>
          </div>
        )}

        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <p className="site-footer__name">{siteConfig.siteName}</p>
            {profile && <p className="site-footer__text">{profile.specialties.join(' · ')}</p>}
            {profile && (
              <p className="site-footer__text site-footer__location">
                <MapPin size={16} aria-hidden="true" /> {profile.location}
              </p>
            )}
          </div>

          <nav aria-labelledby="footer-nav-title">
            <p id="footer-nav-title" className="site-footer__heading">
              Navigation
            </p>
            <ul className="site-footer__list">
              {siteConfig.navigation.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {profile && (
            <div>
              <p className="site-footer__heading">Contact</p>
              <ul className="site-footer__list">
                <li>
                  <a href={profile.phoneHref} className="site-footer__contact">
                    <Phone size={16} aria-hidden="true" /> {profile.phone}
                  </a>
                </li>
                <li>
                  <a href={toMailHref(profile.email)} className="site-footer__contact">
                    <Mail size={16} aria-hidden="true" /> {profile.email}
                  </a>
                </li>
                {whatsappHref && (
                  <li>
                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="site-footer__contact">
                      <SocialIcon platform="whatsapp" size={16} /> WhatsApp
                    </a>
                  </li>
                )}
              </ul>
              <SocialLinks links={profile.socialLinks} />
            </div>
          )}
        </div>

        <div className="site-footer__bottom">
          <p>
            © {CURRENT_YEAR} {siteConfig.siteName}. Tous droits réservés.
          </p>
          <p>Photographie · Journalisme · Publicité · Vidéographie</p>
        </div>
      </div>
    </footer>
  )
}
