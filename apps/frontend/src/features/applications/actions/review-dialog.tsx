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
  RadioGroup,
  RadioGroupItem,
} from '@org/ui'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  acceptLabel?: string
  rejectLabel?: string
  onConfirm: (action: 'ACCEPT' | 'REJECT', reason?: string) => void | Promise<void>
  isPending?: boolean
}

export default function ReviewDialog({
  open,
  onOpenChange,
  title,
  description,
  acceptLabel,
  rejectLabel,
  onConfirm,
  isPending = false,
}: Props) {
  const { t } = useTranslation()
  const [action, setAction] = useState<'ACCEPT' | 'REJECT'>('ACCEPT')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  const handleConfirm = async () => {
    if (action === 'REJECT' && !reason.trim()) {
      setError(t('rejectionReasonRequired'))
      return
    }
    setError('')
    await onConfirm(action, action === 'REJECT' ? reason : undefined)
    setAction('ACCEPT')
    setReason('')
  }

  const handleOpenChange = (state: boolean) => {
    if (!state) {
      setAction('ACCEPT')
      setReason('')
      setError('')
    }
    onOpenChange(state)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <RadioGroup value={action} onValueChange={(v) => setAction(v as 'ACCEPT' | 'REJECT')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ACCEPT" id="review-accept" />
              <Label htmlFor="review-accept">{acceptLabel ?? t('accept')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="REJECT" id="review-reject" />
              <Label htmlFor="review-reject">{rejectLabel ?? t('reject')}</Label>
            </div>
          </RadioGroup>

          {action === 'REJECT' && (
            <div className="flex flex-col gap-2">
              <Label>{t('rejectionReason')} *</Label>
              <Textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value)
                  if (error) setError('')
                }}
                placeholder={t('rejectionReasonPlaceholder')}
                rows={3}
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
            {t('cancel')}
          </Button>
          <Button
            variant={action === 'REJECT' ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? t('processing') : t('confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
