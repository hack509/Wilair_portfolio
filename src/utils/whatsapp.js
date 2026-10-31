// Lien « click to chat » WhatsApp, avec message prérempli facultatif.
export function toWhatsAppHref(number, message) {
  if (!number) return null
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${number}${text}`
}
