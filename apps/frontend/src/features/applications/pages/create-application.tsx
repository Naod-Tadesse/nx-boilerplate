import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useForm } from '@tanstack/react-form'
import { ArrowLeft } from 'lucide-react'
import { Button, Card, CardContent } from '@org/ui'
import { useCreateApplication, useSubmitApplication } from '../hooks/use-applications'
import { step1Schema, step2Schema, step3Schema } from '../data/schema'
import { StepperIndicator } from '../components/stepper-indicator'
import { StepCustomerProduct } from '../components/step-customer-product'
import { StepVehicleDetails } from '../components/step-vehicle-details'
import { StepDocuments } from '../components/step-documents'
import type { Application } from '../data/types'
import { toast } from 'sonner'

const STEPS = [
  { key: 'customer-product', labelKey: 'customerAndProduct' },
  { key: 'vehicle-details', labelKey: 'vehicleDetails' },
  { key: 'documents', labelKey: 'documents' },
]

const STEP_SCHEMAS = [step1Schema, step2Schema, step3Schema]

export default function CreateApplicationPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { createApplicationAsync, isPending: isCreating } = useCreateApplication()
  const { mutateAsync: submitApplicationAsync, isPending: isSubmitting } = useSubmitApplication()
  const [currentStep, setCurrentStep] = useState(0)
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({})

  const isPending = isCreating || isSubmitting

  const form = useForm({
    defaultValues: {
      customerId: '',
      insurerOrgId: '',
      subtypeId: '',
      plateNumber: '',
      chassisNumber: '',
      engineNumber: '',
      vehicleMake: '',
      bodyType: '',
      horsePowerOrCc: 0,
      yearOfManufacture: 2024,
      carryingCapacity: 0,
      yearPurchased: 2024,
      pricePaid: 0,
      presentEstimatedValue: 0,
      titleDeedUrl: '',
      driversLicenseUrl: '',
      photoUrls: [] as string[],
    },
  })

  const buildPayload = () => {
    const value = form.state.values
    return {
      customerId: value.customerId,
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
      insurerOrgId: value.insurerOrgId,
      subtypeId: value.subtypeId,
      appliedFrom: 'WEB' as const,
    }
  }

  const validateAndProceed = (onValid: () => void) => {
    const schema = STEP_SCHEMAS[currentStep]
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

  const handleSaveAsDraft = () => {
    if (currentStep < STEPS.length - 1) {
      // Can't save partial form — just exit
      navigate({ to: '/applications' })
      return
    }
    // Final step — validate and save as DRAFT
    validateAndProceed(async () => {
      await createApplicationAsync(buildPayload())
      toast.success(t('applicationSavedAsDraft'))
      navigate({ to: '/applications' })
    })
  }

  const handleSubmit = () =>
    validateAndProceed(async () => {
      const created = await createApplicationAsync(buildPayload()) as Application
      await submitApplicationAsync({ applicationId: created.id })
      toast.success(t('applicationSubmitted'))
      navigate({ to: '/applications' })
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
              onClick={() => navigate({ to: '/applications' })}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className='w-full'>

            <StepperIndicator steps={STEPS} currentStep={currentStep} />
            </div>
          </div>

          {currentStep === 0 && <StepCustomerProduct form={form} stepErrors={stepErrors} />}
          {currentStep === 1 && <StepVehicleDetails form={form} stepErrors={stepErrors} />}
          {currentStep === 2 && <StepDocuments form={form} stepErrors={stepErrors} />}

          {/* Bottom action bar */}
          <div className="mt-auto flex flex-col gap-2 rounded-xl border bg-muted/25 p-2 sm:flex-row sm:items-center sm:justify-between sm:p-3">
              <Button disabled={currentStep <= 0} type="button" variant="ghost" className='border w-full sm:w-auto' onClick={handleBack}>
                {t('back')}
              </Button>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="ghost"
                onClick={handleSaveAsDraft}
                disabled={isPending}
                className='border w-full sm:w-auto'
              >
                {t('saveAsDraftAndExit')}
              </Button>
              {currentStep < STEPS.length - 1 ? (
                <Button type="button" className="w-full sm:w-auto" onClick={handleNext}>
                  {t('saveAndContinue')}
                </Button>
              ) : (
                <Button type="button" className="w-full sm:w-auto" onClick={handleSubmit} disabled={isPending}>
                  {isPending ? t('processing') : t('submit')}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
