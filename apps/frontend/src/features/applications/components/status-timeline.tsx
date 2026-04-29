import { Badge, Skeleton } from '@org/ui'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import type { StatusHistoryEntry, ApplicationStatus } from '../data/types'

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  DRAFT: 'outline',
  NEW: 'outline',
  AGENT_REVIEW: 'secondary',
  AGENT_ACCEPTED: 'secondary',
  AGENT_REJECTED: 'destructive',
  QUOTATION_GENERATED: 'secondary',
  QUOTATION_REJECTED: 'destructive',
  QUOTATION_APPROVED: 'default',
  CUSTOMER_ACCEPTED: 'default',
  DEPOSIT_PAID: 'default',
  DISBURSED: 'default',
}

function getDotColor(action: string, toStatus: ApplicationStatus): string {
  if (action === 'REJECT' || action === 'REJECT_QUOTATION' || toStatus.includes('REJECTED')) {
    return 'bg-destructive'
  }
  if (toStatus === 'QUOTATION_APPROVED' || toStatus === 'CUSTOMER_ACCEPTED' || toStatus === 'DEPOSIT_PAID' || toStatus === 'DISBURSED') {
    return 'bg-green-500'
  }
  return 'bg-primary'
}

function formatTimelineDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), 'dd MMM yyyy - hh:mm aa')
  } catch {
    return dateStr
  }
}

interface Props {
  history: StatusHistoryEntry[]
  isLoading?: boolean
}

export default function StatusTimeline({ history, isLoading }: Props) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-3 w-3 rounded-full" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (history.length === 0) {
    return <p className="text-muted-foreground text-sm">{t('noStatusHistory')}</p>
  }

  return (
    <div className="relative flex flex-col">
      {history.map((entry, index) => (
        <div key={index} className="relative flex gap-4 pb-6 last:pb-0">
          {/* Vertical line */}
          {index < history.length - 1 && (
            <div className="bg-border absolute left-[5px] top-3 h-full w-px" />
          )}

          {/* Dot */}
          <div
            className={`relative z-10 mt-1.5 h-3 w-3 shrink-0 rounded-full ${getDotColor(entry.action, entry.toStatus)}`}
          />

          {/* Content */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Badge variant={statusVariant[entry.toStatus] ?? 'outline'} className="text-xs">
                {entry.toStatus.replace(/_/g, ' ')}
              </Badge>
              <span className="text-muted-foreground text-xs">{entry.action.replace(/_/g, ' ')}</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              {entry.actorName && (
                <>
                  <span>{t('transitionBy')}: {entry.actorName}</span>
                  <span>·</span>
                </>
              )}
              <span>{formatTimelineDate(entry.createdAt)}</span>
            </div>
            {entry.reason && (
              <p className="text-muted-foreground mt-1 text-sm italic">
                &ldquo;{entry.reason}&rdquo;
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
