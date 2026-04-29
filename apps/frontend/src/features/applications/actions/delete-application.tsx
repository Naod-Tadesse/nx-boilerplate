import { ConfirmDialog } from '@org/ui'
import { useTranslation } from 'react-i18next'
import type { Application } from '../data/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  application: Application
}

export default function DeleteApplication({ open, onOpenChange, application }: Props) {
  const { t } = useTranslation()

  const handleConfirm = async () => {
    // Delete endpoint not yet implemented
    onOpenChange(false)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('deleteApplication')}
      description={t('deleteApplicationConfirmation', { id: application.id.slice(0, 8) })}
      confirmLabel={t('delete')}
      cancelLabel={t('cancel')}
      confirmVariant="destructive"
      onConfirm={handleConfirm}
      isPending={false}
    />
  )
}
