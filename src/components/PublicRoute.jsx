'use client'
import { useContext, useEffect } from 'react'
import { AuthContext } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.replace('/')
    }
  }, [user, loading, router])

  if (loading) return null

  return !user ? children : null
}

export default PublicRoute
