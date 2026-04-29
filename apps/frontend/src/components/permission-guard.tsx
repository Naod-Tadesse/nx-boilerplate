import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { usePermissions } from '@/features/auth/hooks/use-permissions'
import { useAuthStore } from '@/features/auth/context/auth-store'

interface PermissionGuardProps {
  permission: string
  children: React.ReactNode
}

export function PermissionGuard({ permission, children }: PermissionGuardProps) {
  const accessToken = useAuthStore((s) => s.accessToken)
  const { hasPermission } = usePermissions()
  const navigate = useNavigate()
  const allowed = hasPermission(permission)

  useEffect(() => {
    // Don't redirect if logged out — root layout handles that
    if (!accessToken) return
    if (!allowed) {
      navigate({ to: '/' })
    }
  }, [accessToken, allowed, navigate])

  if (!accessToken || !allowed) {
    return null
  }

  return children
}
