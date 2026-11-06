import { listAudioTracks } from '../services/audioService'
import { useAsync } from './useAsync'

export function useAudioTracks({ category = null } = {}) {
  return useAsync(() => listAudioTracks({ category }), [category])
}
