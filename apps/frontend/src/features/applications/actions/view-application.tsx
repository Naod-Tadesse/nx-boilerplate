import { Badge, Dialog, DialogContent, DialogHeader, DialogTitle, Separator } from '@org/ui'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import type { Application, ApplicationStatus } from '../data/types'

interface ViewApplicationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  application: Application
}

const statusVariant: Record<ApplicationStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  WAITING: 'secondary',
  ACCEPTED: 'default',
  REJECTED: 'destructive',
  INCOMPLETE: 'outline',
}

const statusLabel: Record<ApplicationStatus, string> = {
  WAITING: 'Waiting',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  INCOMPLETE: 'Incomplete',
}

export default function ViewApplication({ open, onOpenChange, application }: ViewApplicationProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('viewApplication')}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <DetailRow label={t('applicationId')} value={application.applicationId} />
          <Separator />
          <DetailRow label={t('fullName')} value={application.fullName} />
          <Separator />
          <DetailRow label={t('phoneNumber')} value={application.phone} />
          <Separator />
          <DetailRow label={t('vehicle')} value={application.vehicle} />
          <Separator />
          <DetailRow
            label={t('appliedOn')}
            value={(() => {
              try {
                return format(new Date(application.appliedOn), 'dd MMM yyyy - hh:mm aa')
              } catch {
                return application.appliedOn
              }
            })()}
          />
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">{t('status')}</span>
            <Badge variant={statusVariant[application.status]}>
              {statusLabel[application.status]}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  )
}
