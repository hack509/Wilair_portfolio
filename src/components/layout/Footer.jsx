import { Link } from 'react-router'
import { siteConfig } from '../../data/siteConfig'
import { useProfile } from '../../hooks/useProfile'
import { toMailHref } from '../../utils/format'
import SocialLinks from '../common/SocialLinks'

const CURRENT_YEAR = new Date().getFullYear()

export default function Footer() {
  const { data: profile } = useProfile()

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <p className="site-footer__name">{siteConfig.siteName}</p>
          {profile && <p className="site-footer__muted">{profile.specialties.join(' · ')}</p>}
          {profile && <p className="site-footer__muted">{profile.location}</p>}
        </div>

        <nav aria-label="Pied de page">
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
            <ul className="site-footer__list">
              <li>
                <a href={profile.phoneHref}>{profile.phone}</a>
              </li>
              <li>
                <a href={toMailHref(profile.email)}>{profile.email}</a>
              </li>
            </ul>
            <SocialLinks links={profile.socialLinks} />
          </div>
        )}
      </div>
      <div className="container site-footer__bottom">
        <p>
          © {CURRENT_YEAR} {siteConfig.siteName}. Tous droits réservés.
        </p>
      </div>
    </footer>
  )
}
