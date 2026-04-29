import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormTextField,
  FormSelectField,
} from '@org/ui'
import { VEHICLE_BODY_TYPE_OPTIONS } from '../data/types'
import type { ApplicationFormApi } from '../data/types'

interface StepVehicleDetailsProps {
  form: ApplicationFormApi
  stepErrors: Record<string, string>
}

export function StepVehicleDetails({ form, stepErrors }: StepVehicleDetailsProps) {
  const { t } = useTranslation()

  const bodyTypeOptions = VEHICLE_BODY_TYPE_OPTIONS.map((opt) => ({
    value: opt.value,
    label: t(opt.labelKey),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('vehicleDetails')}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormTextField form={form} name="plateNumber" label={t('plateNumber')} required placeholder={t('plateNumber')} />
        <FormTextField form={form} name="chassisNumber" label={t('chassisNumber')} required placeholder={t('chassisNumber')} />
        <FormTextField form={form} name="engineNumber" label={t('engineNumber')} required placeholder={t('engineNumber')} />
        <FormTextField form={form} name="vehicleMake" label={t('vehicleMake')} required placeholder={t('vehicleMake')} />
        <FormSelectField form={form} name="bodyType" label={t('bodyType')} required options={bodyTypeOptions} placeholder={t('bodyType')} />
        <FormTextField form={form} name="horsePowerOrCc" label={t('horsePowerOrCc')} required type="number" placeholder={t('horsePowerOrCc')} />
        <FormTextField form={form} name="yearOfManufacture" label={t('yearOfManufacture')} required type="number" placeholder={t('yearOfManufacture')} />
        <FormTextField form={form} name="carryingCapacity" label={t('carryingCapacity')} required type="number" placeholder={t('carryingCapacity')} />
        <FormTextField form={form} name="yearPurchased" label={t('yearPurchased')} required type="number" placeholder={t('yearPurchased')} />
        <FormTextField form={form} name="pricePaid" label={t('pricePaid')} required type="number" placeholder={t('pricePaid')} />
        <FormTextField form={form} name="presentEstimatedValue" label={t('presentEstimatedValue')} required type="number" placeholder={t('presentEstimatedValue')} />
      </CardContent>

      {Object.keys(stepErrors).length > 0 && (
        <CardContent className="pt-0">
          <p className="text-destructive text-sm">
            {Object.values(stepErrors)[0]}
          </p>
        </CardContent>
      )}
    </Card>
  )
}
