import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import { Button, DataTable } from '@org/ui'
import { ListPage } from '@/components/list-page'
import { applicationColumns } from './components/application-columns'
import { ApplicationDialogs } from './context/application-dialogs'
import ApplicationProvider, { useApplicationContext } from './context/application-context'
import { useApplications } from './hooks/use-applications'
import { usePermissions } from '@/features/auth/hooks/use-permissions'
import { useCurrentUser } from '@/features/auth/hooks/use-auth'
import type { StaffProfile } from '@/features/auth/data/types'
import { APPLICATION_STATUS_OPTIONS, type ApplicationTableState } from './data/types'
import { useDebounce } from '@/hooks/use-debounce'

function ApplicationsList() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { hasPermission } = usePermissions()
  const { data: currentUser } = useCurrentUser()
  const orgType = (currentUser?.profile as StaffProfile | undefined)?.organization?.orgType
  const { showFilters, setShowFilters } = useApplicationContext()
  const [tableState, setTableState] = useState<ApplicationTableState>({
    page: 1,
    limit: 10,
  })
  const debouncedSearch = useDebounce(tableState.search, 300)
  const { applications, isLoading, paginationInfo } = useApplications({ ...tableState, search: debouncedSearch })

  return (
    <ListPage
      title={t('applicationManagement')}
      subtitle={t('listOfApplications')}
      showFilters={showFilters}
      onToggleFilters={() => setShowFilters((v) => !v)}
    >
      <DataTable
        columns={applicationColumns}
        data={applications}
        initialColumnVisibility={{
          ...(orgType === 'INSURER' ? { insurerOrgName: false } : {}),
          ...(orgType === 'BANK' ? { bankOrgName: false } : {}),
        }}
        tableState={tableState}
        setTableState={setTableState}
        isLoading={isLoading}
        paginationInfo={paginationInfo}
        searchPlaceholder={t('searchApplications')}
        filters={[
          {
            field: 'status',
            title: t('status'),
            options: APPLICATION_STATUS_OPTIONS.map((opt) => ({
              label: t(opt.labelKey),
              value: opt.value,
            })),
          },
        ]}
      >
        {hasPermission('application:create') && (
          <Button
            size="sm"
            onClick={() => navigate({ to: '/applications/create' })}
          >
            <Plus className="h-4 w-4" />
            {t('createApplication')}
          </Button>
        )}
      </DataTable>

      <ApplicationDialogs />
    </ListPage>
  )
}

export default function ApplicationsPage() {
  return (
    <ApplicationProvider>
      <ApplicationsList />
    </ApplicationProvider>
  )
}
