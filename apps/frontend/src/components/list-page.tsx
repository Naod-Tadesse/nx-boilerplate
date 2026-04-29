import type { ReactNode } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardHeader,
  FilterCard,
} from '@org/ui'

interface ListPageProps {
  title: string
  subtitle?: string
  showFilters?: boolean
  onToggleFilters?: () => void
  filterContent?: ReactNode
  headerActions?: ReactNode
  children: ReactNode
  className?: string
}

export function ListPage({
  title,
  subtitle,
  showFilters,
  onToggleFilters,
  filterContent,
  headerActions,
  children,
  className = 'my-3 mx-2',
}: ListPageProps) {
  const { t } = useTranslation()

  const hasFilterSupport = onToggleFilters !== undefined

  return (
    <>
      {hasFilterSupport && showFilters && filterContent && (
        <FilterCard className="my-2 mx-2">
          {filterContent}
        </FilterCard>
      )}

      <Card className={className}>
        <CardHeader>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground text-sm">{subtitle}</p>
          )}
          {(hasFilterSupport || headerActions) && (
            <CardAction>
              <div className="flex items-center gap-2">
                {headerActions}
                {hasFilterSupport && (
                  <Button variant="outline" onClick={onToggleFilters}>
                    <SlidersHorizontal className="h-4 w-4" />
                    {t('filter')}
                  </Button>
                )}
              </div>
            </CardAction>
          )}
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {children}
        </CardContent>
      </Card>
    </>
  )
}
