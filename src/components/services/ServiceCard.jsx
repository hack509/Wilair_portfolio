import { Link } from 'react-router'
import { serviceContactUrl } from '../../routes/paths'
import { padNumber } from '../../utils/format'
import SmartImage from '../common/SmartImage'

export default function ServiceCard({ service, index }) {
  return (
    <article id={service.slug} className="service-card">
      <SmartImage src={service.image?.url} alt={service.image?.alt ?? service.title} placeholderLabel={`Photo — ${service.title}`} />
      <p className="service-card__number">{padNumber(index + 1)}</p>
      <h2 className="service-card__title">{service.title}</h2>
      <p className="service-card__description">{service.description}</p>
      <ul className="bullet-list">
        {service.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <Link to={serviceContactUrl(service.slug)} className="text-link">
        Demander ce service →
      </Link>
    </article>
  )
}
