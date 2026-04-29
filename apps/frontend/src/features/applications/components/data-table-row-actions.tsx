import type { Row } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@org/ui'
import type { Application } from '../data/types'
import { usePermissions } from '@/features/auth/hooks/use-permissions'

interface DataTableRowActionsProps {
  row: Row<Application>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { hasPermission } = usePermissions()

  const canRead = hasPermission('application:read')
  const canEdit = hasPermission('application:update') && row.original.status === 'DRAFT'

  if (!canRead) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='h-8 w-8'>
          <MoreHorizontal className='h-4 w-4' />
          <span className='sr-only'>{t('openMenu')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem
          onClick={() => {
            navigate({
              to: '/applications/$applicationId',
              params: { applicationId: row.original.id },
            })
          }}
        >
          {t('view')}
        </DropdownMenuItem>
        {canEdit && (
          <DropdownMenuItem
            onClick={() => {
              navigate({
                to: '/applications/$applicationId/edit',
                params: { applicationId: row.original.id },
              })
            }}
          >
            {t('edit')}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
