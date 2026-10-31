import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { siteConfig } from '../../data/siteConfig'
import { ROUTES } from '../../routes/paths'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  // Menu mobile : fermeture avec la touche Échap.
  useEffect(() => {
    if (!menuOpen) return undefined
    const onKeyDown = (event) => event.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to={ROUTES.home} className="brand" onClick={closeMenu}>
          {siteConfig.siteName}
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
          <span>{menuOpen ? 'Fermer' : 'Menu'}</span>
        </button>

        <nav id="primary-navigation" className={`primary-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navigation principale">
          <ul className="primary-nav__list">
            {siteConfig.navigation.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className="primary-nav__link" onClick={closeMenu}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
