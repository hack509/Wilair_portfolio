import SocialIcon from './SocialIcon'

// N'affiche que les réseaux dont l'URL est renseignée.
export default function SocialLinks({ links = [] }) {
  const available = links.filter((link) => link.url)
  if (available.length === 0) return null

  return (
    <ul className="social-links">
      {available.map((link) => (
        <li key={link.platform}>
          <a href={link.url} className="social-links__link" target="_blank" rel="noopener noreferrer">
            <SocialIcon platform={link.platform} />
            <span>{link.label}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
