import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from '@tanstack/react-form'
import { Info } from 'lucide-react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  FormTextField,
  Separator,
} from '@org/ui'
import { generateQuotationSchema } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (data: { insuredValue: number; premiumRatePct: number }) => void | Promise<void>
  isPending?: boolean
  defaultInsuredValue?: number
  defaultPremiumRatePct?: number
}

function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function QuotationFormDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
  defaultInsuredValue = 0,
  defaultPremiumRatePct = 0,
}: Props) {
  const { t } = useTranslation()

  const form = useForm({
    defaultValues: {
      insuredValue: defaultInsuredValue,
      premiumRatePct: defaultPremiumRatePct,
    },
    validators: {
      onChange: generateQuotationSchema,
    },
    onSubmit: async ({ value }) => {
      await onConfirm(value)
      form.reset()
    },
  })

  // Reset form to new defaults when they change or dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        insuredValue: defaultInsuredValue,
        premiumRatePct: defaultPremiumRatePct,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultInsuredValue, defaultPremiumRatePct])

  const handleOpenChange = (state: boolean) => {
    if (!state) form.reset()
    onOpenChange(state)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('generateQuotationTitle')}</DialogTitle>
          <DialogDescription>{t('generateQuotationDescription')}</DialogDescription>
        </DialogHeader>

        {/* Pre-populated values info banner */}
        {(defaultInsuredValue > 0 || defaultPremiumRatePct > 0) && (
          <div className="bg-muted/50 border rounded-md p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span>{t('prePopulatedValues')}</span>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-2 text-sm">
              {defaultInsuredValue > 0 && (
                <>
                  <span className="text-muted-foreground">{t('estimatedVehicleValue')}</span>
                  <span className="text-right font-medium">{formatCurrency(defaultInsuredValue)}</span>
                </>
              )}
              {defaultPremiumRatePct > 0 && (
                <>
                  <span className="text-muted-foreground">{t('configuredPremiumRate')}</span>
                  <span className="text-right font-medium">{defaultPremiumRatePct}%</span>
                </>
              )}
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex flex-col gap-4"
        >
          <FormTextField
            form={form}
            name="insuredValue"
            label={t('insuredValue')}
            type="number"
            required
            placeholder="0"
          />
          <FormTextField
            form={form}
            name="premiumRatePct"
            label={t('premiumRatePct')}
            type="number"
            required
            placeholder="0"
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t('processing') : t('generateQuotation')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
