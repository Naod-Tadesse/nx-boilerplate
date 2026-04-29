import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Label,
  Textarea,
} from '@org/ui'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  fieldLabel: string
  fieldPlaceholder?: string
  confirmLabel?: string
  confirmVariant?: 'default' | 'destructive'
  onConfirm: (value: string) => void | Promise<void>
  isPending?: boolean
}

export default function ConfirmReasonDialog({
  open,
  onOpenChange,
  title,
  description,
  fieldLabel,
  fieldPlaceholder,
  confirmLabel,
  confirmVariant = 'default',
  onConfirm,
  isPending = false,
}: Props) {
  const { t } = useTranslation()
  const [value, setValue] = useState('')

  const handleConfirm = async () => {
    await onConfirm(value)
    setValue('')
  }

  const handleOpenChange = (state: boolean) => {
    if (!state) setValue('')
    onOpenChange(state)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label>{fieldLabel}</Label>
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={fieldPlaceholder}
            rows={3}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
            {t('cancel')}
          </Button>
          <Button variant={confirmVariant} onClick={handleConfirm} disabled={isPending}>
            {isPending ? t('processing') : (confirmLabel ?? t('confirm'))}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
