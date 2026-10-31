import { Link } from 'react-router'

/**
 * Bouton ou lien stylé.
 * `to` → lien interne, `href` → lien externe / tel: / mailto:, sinon <button>.
 * Variantes : primary | dark | outline | light | outline-light | text
 */
export default function Button({
  to,
  href,
  variant = 'primary',
  size,
  icon: Icon,
  iconPosition = 'end',
  className = '',
  children,
  ...rest
}) {
  const classes = ['btn', `btn--${variant}`, size && `btn--${size}`, className].filter(Boolean).join(' ')
  const icon = Icon ? <Icon className="btn__icon" aria-hidden="true" size={18} strokeWidth={1.75} /> : null

  const content = (
    <>
      {iconPosition === 'start' && icon}
      <span>{children}</span>
      {iconPosition === 'end' && icon}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    )
  }
  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  )
}
