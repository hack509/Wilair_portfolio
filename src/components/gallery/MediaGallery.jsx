import { useState } from 'react'
import Lightbox from './Lightbox'

// Grille de photos ; un clic ouvre la photo en plein écran.
export default function MediaGallery({ items }) {
  const [openIndex, setOpenIndex] = useState(null)
  const images = items.filter((item) => item.type === 'image')

  if (images.length === 0) return null

  return (
    <>
      <ul className="grid grid--3">
        {images.map((image, index) => (
          <li key={image.id}>
            <button
              type="button"
              className="gallery-button"
              onClick={() => setOpenIndex(index)}
              aria-label={`Agrandir l'image ${index + 1} sur ${images.length}`}
            >
              <img src={image.url} alt={image.alt} className="image" style={{ aspectRatio: '4 / 3' }} loading="lazy" decoding="async" />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox items={images} index={openIndex} onClose={() => setOpenIndex(null)} onIndexChange={setOpenIndex} />
    </>
  )
}
