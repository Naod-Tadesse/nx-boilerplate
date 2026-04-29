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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@org/ui'
import { useStaffs } from '@/features/staffs/hooks/use-staffs'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  orgId: string
  currentAssigneeId?: string | null
  onConfirm: (staffId: string) => void | Promise<void>
  isPending?: boolean
}

export default function AssignDialog({
  open,
  onOpenChange,
  title,
  description,
  orgId,
  currentAssigneeId,
  onConfirm,
  isPending = false,
}: Props) {
  const { t } = useTranslation()
  const [selectedStaff, setSelectedStaff] = useState(currentAssigneeId ?? '')

  const { staffs, isLoading: staffLoading } = useStaffs({
    page: 1,
    limit: 100,
    orgId: orgId || undefined,
  })

  const handleConfirm = async () => {
    if (!selectedStaff) return
    await onConfirm(selectedStaff)
    setSelectedStaff('')
  }

  const handleOpenChange = (state: boolean) => {
    if (!state) setSelectedStaff(currentAssigneeId ?? '')
    onOpenChange(state)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label>{t('selectStaffMember')}</Label>
          <Select value={selectedStaff} onValueChange={setSelectedStaff}>
            <SelectTrigger>
              <SelectValue placeholder={t('selectStaffMember')} />
            </SelectTrigger>
            <SelectContent>
              {staffLoading ? (
                <SelectItem value="loading" disabled>
                  {t('loading')}
                </SelectItem>
              ) : staffs.length === 0 ? (
                <SelectItem value="empty" disabled>
                  {t('noResults')}
                </SelectItem>
              ) : (
                staffs.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.fullName}
                    {currentAssigneeId === staff.id && ` (${t('currentAssignee')})`}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
            {t('cancel')}
          </Button>
          <Button onClick={handleConfirm} disabled={isPending || !selectedStaff}>
            {isPending ? t('processing') : t('assign')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
