'use client'
import useRole from "@/hooks/userRole"
import useAuth from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  const [role, roleLoading] = useRole()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !roleLoading) {
      if (!user) {
        router.replace('/login')
      } else if (role !== 'admin') {
        router.replace('/')
      }
    }
  }, [user, role, loading, roleLoading, router])

  if (loading || roleLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-orange-600" size={40} />
      </div>
    )
  }

  if (user && role === 'admin') {
    return children
  }

  return null
}
