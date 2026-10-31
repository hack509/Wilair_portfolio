import MediaPlaceholder from './MediaPlaceholder'

/**
 * Image chargée à la demande. Sans `src`, affiche un emplacement à remplacer.
 * `ratio` : proportions réservées (ex. "4 / 5") pour éviter les sauts de mise en page.
 */
export default function SmartImage({ src, alt, ratio = '4 / 3', placeholderLabel, priority = false, className = '', ...rest }) {
  if (!src) return <MediaPlaceholder label={placeholderLabel ?? alt} ratio={ratio} className={className} />

  return (
    <img
      src={src}
      alt={alt}
      className={`image ${className}`}
      style={{ aspectRatio: ratio }}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      {...rest}
    />
  )
}
