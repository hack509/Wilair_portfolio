import { useSearchParams } from 'react-router'
import AudioCard from '../components/audio/AudioCard'
import AsyncContent from '../components/common/AsyncContent'
import PageHeader from '../components/common/PageHeader'
import CategoryFilter from '../components/gallery/CategoryFilter'
import PlaceholderGrid from '../components/gallery/PlaceholderGrid'
import { audioCategories } from '../data/audioData'
import { useAudioTracks } from '../hooks/useAudioTracks'
import { usePageMeta } from '../hooks/usePageMeta'

export default function Audio() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requested = searchParams.get('categorie')
  const activeCategory = audioCategories.find((item) => item.slug === requested) ?? null

  const tracksState = useAudioTracks({ category: activeCategory?.slug })

  usePageMeta({
    title: activeCategory ? `${activeCategory.label} — Audio` : 'Audio',
    description: 'Voix off, spots publicitaires, émissions et reportages de Wilair Joseph à écouter.',
  })

  const selectCategory = (slug) => {
    setSearchParams(slug ? { categorie: slug } : {}, { replace: true, preventScrollReset: true })
  }

  return (
    <>
      <PageHeader eyebrow="Audio" title="Audio" intro="Voix off, spots, émissions et reportages à écouter." />
      <section className="section">
        <div className="container">
          <CategoryFilter
            categories={audioCategories}
            active={activeCategory?.slug}
            onChange={selectCategory}
            label="Filtrer les audios par catégorie"
          />
          <AsyncContent
            {...tracksState}
            empty={<PlaceholderGrid categories={activeCategory ? [activeCategory] : audioCategories} />}
          >
            {(tracks) => (
              <ul className="grid grid--2">
                {tracks.map((track) => (
                  <li key={track.id}>
                    <AudioCard track={track} />
                  </li>
                ))}
              </ul>
            )}
          </AsyncContent>
        </div>
      </section>
    </>
  )
}
