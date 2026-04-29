import { useCurrentUser } from '@/features/auth/hooks/use-auth'
import type { StaffProfile } from '@/features/auth/data/types'
import type { OrgType } from '../data/types'

export function useUserOrgType(): OrgType | null {
  const { data: user } = useCurrentUser()
  if (!user || user.userType !== 'STAFF') return null
  return ((user.profile as StaffProfile).organization?.orgType as OrgType) ?? null
}
