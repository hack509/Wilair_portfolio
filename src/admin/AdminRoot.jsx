import { Suspense } from 'react'
import { Outlet } from 'react-router'
import { Loader } from '../components/common/StateMessages'
import AuthProvider from '../context/AuthProvider'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import './admin.css'
import AdminSetup from './pages/AdminSetup'

// Point d'entrée de /admin : session, styles dédiés et exclusion des moteurs de recherche.
export default function AdminRoot() {
  return (
    <>
      <meta name="robots" content="noindex, nofollow" />
      {isSupabaseConfigured ? (
        <AuthProvider>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </AuthProvider>
      ) : (
        <AdminSetup />
      )}
    </>
  )
}
