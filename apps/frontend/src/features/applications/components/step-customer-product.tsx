import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormComboboxField,
} from '@org/ui'
import { useCustomers } from '@/features/customers/hooks/use-customers'
import { useOrganizations } from '@/features/organizations/hooks/use-organizations'
import { useInsuranceProductSubtypes } from '../hooks/use-applications'
import { CustomerPreviewCard } from './customer-preview-card'
import type { ApplicationFormApi } from '../data/types'

interface StepCustomerProductProps {
  form: ApplicationFormApi
  stepErrors: Record<string, string>
}

export function StepCustomerProduct({ form, stepErrors }: StepCustomerProductProps) {
  const { t } = useTranslation()
  const [selectedCustomerId, setSelectedCustomerId] = useState('')

  const { customers } = useCustomers({ page: 1, limit: 20, search: '' })
  const { organizations } = useOrganizations({ page: 1, limit: 100 })
  const { subtypes } = useInsuranceProductSubtypes()

  const insurerOrgs = organizations.filter((org) => org.orgType === 'INSURER')

  const customerOptions = customers.map((c) => ({ value: c.id, label: c.fullName }))
  const insurerOptions = insurerOrgs.map((o) => ({ value: o.id, label: o.name }))
  const subtypeOptions = subtypes.map((s) => ({ value: s.id, label: s.name }))

  return (
    <div className="flex flex-col gap-4">
      <Card className='shadow-none'>
        <CardHeader>
          <CardTitle>{t('customerAndProduct')}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormComboboxField
            form={form}
            name="customerId"
            label={t('selectCustomer')}
            required
            options={customerOptions}
            placeholder={t('selectCustomer')}
            searchPlaceholder={t('searchCustomers')}
            emptyMessage={t('noCustomerFound')}
            onValueChange={setSelectedCustomerId}
          />
          <div /> {/* spacer for grid */}
          {selectedCustomerId && (
            <CustomerPreviewCard customerId={selectedCustomerId} />
          )}
        </CardContent>
      </Card>

      <Card className='shadow-none'>
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

      {Object.keys(stepErrors).length > 0 && (
        <p className="text-destructive text-sm">
          {Object.values(stepErrors)[0]}
        </p>
      )}
    </div>
  )
}
