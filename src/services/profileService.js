import { profileData } from '../data/profileData'
import { fromLocal } from './localSource'

export function getProfile() {
  return fromLocal(() => profileData)
}
