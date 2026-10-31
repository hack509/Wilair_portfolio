import { createContext } from 'react'

// Le profil est chargé une seule fois et partagé par toutes les pages (en-tête, pied de page…).
export const ProfileContext = createContext(null)
