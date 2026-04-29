import { ConfirmDialog } from '@org/ui'
import { useTranslation } from 'react-i18next'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  confirmVariant?: 'default' | 'destructive'
  onConfirm: () => void | Promise<void>
  isPending?: boolean
}

export default function ConfirmActionDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  confirmVariant = 'default',
  onConfirm,
  isPending = false,
}: Props) {
  const { t } = useTranslation()

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      confirmLabel={confirmLabel ?? t('confirm')}
      cancelLabel={t('cancel')}
      confirmVariant={confirmVariant}
      onConfirm={onConfirm}
      isPending={isPending}
    />
  )
}
