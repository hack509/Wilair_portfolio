import { useAsync } from '../hooks/useAsync'
import { getProfile } from '../services/profileService'
import { ProfileContext } from './profileContext'

export default function ProfileProvider({ children }) {
  const profileState = useAsync(getProfile, [])
  return <ProfileContext.Provider value={profileState}>{children}</ProfileContext.Provider>
}
