import { useContext } from 'react'
import { ProfileContext } from '../context/profileContext'

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) throw new Error('useProfile doit être utilisé dans <ProfileProvider>.')
  return context
}
