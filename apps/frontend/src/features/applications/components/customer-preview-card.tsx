import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle, Badge, Separator, Skeleton } from '@org/ui'
import { useCustomer } from '@/features/customers/hooks/use-customers'

interface CustomerPreviewCardProps {
  customerId: string
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (value == null) return null
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground text-sm font-medium">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  )
}

export function CustomerPreviewCard({ customerId }: CustomerPreviewCardProps) {
  const { t } = useTranslation()
  const { customer, isLoading } = useCustomer(customerId)

  if (isLoading) {
    return (
      <Card className="sm:col-span-2">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    )
  }

  if (!customer) return null

  return (
    <Card className="sm:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{t('customerDetails')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <DetailRow label={t('fullName')} value={customer.fullName} />
        <Separator />
        <DetailRow label={t('phone')} value={customer.phone} />
        {customer.email && (
          <>
            <Separator />
            <DetailRow label={t('email')} value={customer.email} />
          </>
        )}
        {customer.dateOfBirth && (
          <>
            <Separator />
            <DetailRow label={t('dateOfBirth')} value={customer.dateOfBirth} />
          </>
        )}
        {customer.nationalIdNumber && (
          <>
            <Separator />
            <DetailRow label={t('nationalIdNumber')} value={customer.nationalIdNumber} />
          </>
        )}
        {customer.licenseNumber && (
          <>
            <Separator />
            <DetailRow label={t('licenseNumber')} value={customer.licenseNumber} />
          </>
        )}
        <Separator />
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm font-medium">{t('status')}</span>
          <Badge
            variant={customer.status === 'ACTIVE' ? 'default' : 'destructive'}
            className="capitalize"
          >
            {customer.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
