import { useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useForm } from '@tanstack/react-form'
import { ArrowLeft } from 'lucide-react'
import { Button, Skeleton, Card, CardHeader, CardContent } from '@org/ui'
import { useApplication, useUpdateApplication } from '../hooks/use-applications'
import { step2Schema, step3Schema } from '../data/schema'
import { StepperIndicator } from '../components/stepper-indicator'
import { StepCustomerProductReadonly } from '../components/step-customer-product-readonly'
import { StepVehicleDetails } from '../components/step-vehicle-details'
import { StepDocuments } from '../components/step-documents'

const STEPS = [
  { key: 'customer-product', labelKey: 'customerAndProduct' },
  { key: 'vehicle-details', labelKey: 'vehicleDetails' },
  { key: 'documents', labelKey: 'documents' },
]

const STEP_SCHEMAS = [null, step2Schema, step3Schema]

export default function EditApplicationPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { applicationId } = useParams({ strict: false }) as { applicationId: string }
  const { application, isLoading } = useApplication(applicationId)

  if (isLoading) {
    return (
      <div className="mx-2 my-3 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Card>
          <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="mx-2 my-3">
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/applications' })}>
          {t('back')}
        </Button>
        <p className="text-muted-foreground mt-4 text-center text-sm">{t('noResults')}</p>
      </div>
    )
  }

  if (application.status !== 'DRAFT') {
    navigate({
      to: '/applications/$applicationId',
      params: { applicationId },
    })
    return null
  }

  return <EditApplicationForm applicationId={applicationId} application={application} />
}

function EditApplicationForm({
  applicationId,
  application,
}: {
  applicationId: string
  application: NonNullable<ReturnType<typeof useApplication>['application']>
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { mutate: updateApplication, mutateAsync: updateApplicationAsync, isPending } = useUpdateApplication()
  const [currentStep, setCurrentStep] = useState(0)
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({})

  const vd = application.vehicleDetail

  const form = useForm({
    defaultValues: {
      customerId: application.customerId,
      insurerOrgId: application.insurerOrgId,
      subtypeId: application.subtypeId,
      plateNumber: vd?.plateNumber ?? '',
      chassisNumber: vd?.chassisNumber ?? '',
      engineNumber: vd?.engineNumber ?? '',
      vehicleMake: vd?.vehicleMake ?? '',
      bodyType: vd?.bodyType ?? '',
      horsePowerOrCc: vd?.horsePowerOrCc ?? 0,
      yearOfManufacture: vd?.yearOfManufacture ?? 2024,
      carryingCapacity: vd?.carryingCapacity ?? 0,
      yearPurchased: vd?.yearPurchased ?? 2024,
      pricePaid: vd?.pricePaid ? Number(vd.pricePaid) : 0,
      presentEstimatedValue: vd?.presentEstimatedValue ? Number(vd.presentEstimatedValue) : 0,
      titleDeedUrl: vd?.titleDeedUrl ?? '',
      driversLicenseUrl: vd?.driversLicenseUrl ?? '',
      photoUrls: vd?.photos?.map((p) => p.url) ?? ([] as string[]),
    },
    onSubmit: async ({ value }) => {
      updateApplication({
        applicationId,
        data: {
          insurerOrgId: value.insurerOrgId,
          subtypeId: value.subtypeId,
          plateNumber: value.plateNumber,
          chassisNumber: value.chassisNumber,
          engineNumber: value.engineNumber,
          vehicleMake: value.vehicleMake,
          bodyType: value.bodyType,
          horsePowerOrCc: value.horsePowerOrCc,
          yearOfManufacture: value.yearOfManufacture,
          carryingCapacity: value.carryingCapacity,
          yearPurchased: value.yearPurchased,
          pricePaid: value.pricePaid,
          presentEstimatedValue: value.presentEstimatedValue,
          titleDeedUrl: value.titleDeedUrl || undefined,
          driversLicenseUrl: value.driversLicenseUrl || undefined,
          photoUrls: value.photoUrls.length > 0 ? value.photoUrls : undefined,
        },
      })
      navigate({
        to: '/applications/$applicationId',
        params: { applicationId },
      })
    },
  })

  const validateAndProceed = (onValid: () => void) => {
    const schema = STEP_SCHEMAS[currentStep]
    if (!schema) {
      // Step 0 (customer/product) — read-only in edit, no validation needed
      onValid()
      return
    }
    const result = schema.safeParse(form.state.values)
    if (result.success) {
      setStepErrors({})
      onValid()
    } else {
      const errors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        errors[issue.path.join('.')] = issue.message
      }
      setStepErrors(errors)
    }
  }

  const handleNext = () => validateAndProceed(() => setCurrentStep((s) => s + 1))
  const handleBack = () => { setStepErrors({}); setCurrentStep((s) => s - 1) }
  const handleSubmit = () => validateAndProceed(() => form.handleSubmit())

  const buildPayload = () => {
    const value = form.state.values
    return {
      insurerOrgId: value.insurerOrgId,
      subtypeId: value.subtypeId,
      plateNumber: value.plateNumber,
      chassisNumber: value.chassisNumber,
      engineNumber: value.engineNumber,
      vehicleMake: value.vehicleMake,
      bodyType: value.bodyType,
      horsePowerOrCc: value.horsePowerOrCc,
      yearOfManufacture: value.yearOfManufacture,
      carryingCapacity: value.carryingCapacity,
      yearPurchased: value.yearPurchased,
      pricePaid: value.pricePaid,
      presentEstimatedValue: value.presentEstimatedValue,
      titleDeedUrl: value.titleDeedUrl || undefined,
      driversLicenseUrl: value.driversLicenseUrl || undefined,
      photoUrls: value.photoUrls.length > 0 ? value.photoUrls : undefined,
    }
  }

  const handleSaveAsDraft = () =>
    validateAndProceed(async () => {
      await updateApplicationAsync({ applicationId, data: buildPayload() })
      navigate({ to: '/applications/$applicationId', params: { applicationId } })
    })

  return (
    <div className="mx-2 my-3 flex min-h-0 flex-1 flex-col gap-4">
      <Card className="flex flex-1 flex-col">
        <CardContent className="flex flex-1 flex-col gap-4 pt-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => navigate({ to: '/applications/$applicationId', params: { applicationId } })}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <StepperIndicator steps={STEPS} currentStep={currentStep} />
          </div>

          {currentStep === 0 && (
            <StepCustomerProductReadonly
              form={form}
              application={application}
            />
          )}
          {currentStep === 1 && <StepVehicleDetails form={form} stepErrors={stepErrors} />}
          {currentStep === 2 && <StepDocuments form={form} stepErrors={stepErrors} />}

          {/* Bottom action bar */}
          <div className="mt-auto flex flex-col gap-2 rounded-xl border bg-muted/25 p-2 sm:flex-row sm:items-center sm:justify-between sm:p-3">
            <Button disabled={currentStep <= 0} type="button" variant="ghost" className="border w-full sm:w-auto" onClick={handleBack}>
              {t('back')}
            </Button>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="ghost"
                onClick={handleSaveAsDraft}
                disabled={isPending}
                className="border w-full sm:w-auto"
              >
                {t('saveAsDraftAndExit')}
              </Button>
              {currentStep < STEPS.length - 1 ? (
                <Button type="button" className="w-full sm:w-auto" onClick={handleNext}>
                  {t('saveAndContinue')}
                </Button>
              ) : (
                <Button type="button" className="w-full sm:w-auto" onClick={handleSubmit} disabled={isPending}>
                  {isPending ? t('processing') : t('save')}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
