const MAX_DIMENSION = 2400
const QUALITY = 0.85

/**
 * Réduit une image trop grande avant l'envoi et renvoie ses dimensions.
 * En cas d'échec (format non décodable), le fichier d'origine est conservé.
 */
export async function optimizeImage(file) {
  let bitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    return { file, width: null, height: null }
  }

  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  if (scale === 1) {
    bitmap.close()
    return { file, width, height }
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', QUALITY))
  if (!blob) return { file, width: null, height: null }
  return { file: new File([blob], 'image.webp', { type: 'image/webp' }), width, height }
}
