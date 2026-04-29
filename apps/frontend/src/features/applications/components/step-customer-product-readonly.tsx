import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormComboboxField,
} from '@org/ui'
import { useOrganizations } from '@/features/organizations/hooks/use-organizations'
import { useInsuranceProductSubtypes } from '../hooks/use-applications'
import type { Application, ApplicationFormApi } from '../data/types'

interface StepCustomerProductReadonlyProps {
  form: ApplicationFormApi
  application: Application
}

export function StepCustomerProductReadonly({ form, application }: StepCustomerProductReadonlyProps) {
  const { t } = useTranslation()
  const { organizations } = useOrganizations({ page: 1, limit: 100 })
  const { subtypes } = useInsuranceProductSubtypes()

  const insurerOrgs = organizations.filter((org) => org.orgType === 'INSURER')

  const insurerOptions = insurerOrgs.map((o) => ({ value: o.id, label: o.name }))
  const subtypeOptions = subtypes.map((s) => ({ value: s.id, label: s.name }))

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('customerAndProduct')}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Customer is read-only — show as static text */}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">
              {t('selectCustomer')} <span className="text-destructive">*</span>
            </span>
            <div className="bg-muted rounded-md border px-3 py-2 text-sm">
              {application.customer?.fullName ?? application.customerId}
            </div>
            <span className="text-muted-foreground text-xs">{t('customerCannotBeChanged')}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('insuranceDetails')}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormComboboxField
            form={form}
            name="insurerOrgId"
            label={t('selectInsurer')}
            required
            options={insurerOptions}
            placeholder={t('selectInsurer')}
            searchPlaceholder={t('searchInsurer')}
            emptyMessage={t('noResults')}
          />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">{t('productType')}</span>
            <div className="bg-muted rounded-md border px-3 py-2 text-sm">MOTOR</div>
          </div>
          <FormComboboxField
            form={form}
            name="subtypeId"
            label={t('selectProductSubtype')}
            required
            options={subtypeOptions}
            placeholder={t('selectProductSubtype')}
            searchPlaceholder={t('searchProductSubtype')}
            emptyMessage={t('noResults')}
          />
        </CardContent>
      </Card>
    </div>
  )
}
