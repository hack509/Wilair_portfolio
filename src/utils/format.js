const monthYearFormatter = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1)

function parseIsoDate(iso) {
  if (!iso) return null
  const date = new Date(`${iso.slice(0, 10)}T00:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatMonthYear(iso) {
  const date = parseIsoDate(iso)
  return date ? capitalize(monthYearFormatter.format(date)) : ''
}

export function formatYear(iso) {
  const date = parseIsoDate(iso)
  return date ? String(date.getFullYear()) : ''
}

export function formatPeriod(start, end) {
  if (!start) return ''
  if (!end) return `${start} — Aujourd'hui`
  return start === end ? start : `${start} — ${end}`
}

export const padNumber = (value) => String(value).padStart(2, '0')

// Découpe un texte en paragraphes (séparés par une ligne vide).
export function toParagraphs(text) {
  if (Array.isArray(text)) return text
  return (text ?? '')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

export const toTelHref = (phone) => `tel:${(phone ?? '').replace(/[^\d+]/g, '')}`
export const toMailHref = (email, subject) =>
  `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`
