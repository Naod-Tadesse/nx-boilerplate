import { useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Download, Eye, FileTextIcon, ExternalLink } from 'lucide-react'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Separator,
  Skeleton,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ImagePreviewDialog,
} from '@org/ui'
import { format } from 'date-fns'
import { usePermissions } from '@/features/auth/hooks/use-permissions'
import { useCurrentUser } from '@/features/auth/hooks/use-auth'
import type { StaffProfile } from '@/features/auth/data/types'
import {
  useApplication,
  useStatusHistory,
  useInsuranceProductConfig,
  useSubmitApplication,
  useReturnToDraft,
  useAgentAssign,
  useAgentReview,
  useInsurerAssign,
  useGenerateQuotation,
  useReviseQuotation,
  useInsurerReviewQuotation,
  useGeneratePolicyFromApplication,
} from '../hooks/use-applications'
import { useUserOrgType } from '../hooks/use-user-org-type'
import { getAvailableActions } from '../data/actions'
import type { ApplicationStatus } from '../data/types'
import ApplicationActionBar from '../components/application-action-bar'
import StatusTimeline from '../components/status-timeline'
import ConfirmActionDialog from '../actions/confirm-action-dialog'
import ConfirmReasonDialog from '../actions/confirm-reason-dialog'
import ReviewDialog from '../actions/review-dialog'
import AssignDialog from '../actions/assign-dialog'
import QuotationFormDialog from '../actions/quotation-form-dialog'

const statusVariant: Record<ApplicationStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  DRAFT: 'outline',
  NEW: 'outline',
  AGENT_REVIEW: 'secondary',
  AGENT_ACCEPTED: 'secondary',
  AGENT_REJECTED: 'destructive',
  QUOTATION_GENERATED: 'secondary',
  QUOTATION_REJECTED: 'destructive',
  QUOTATION_APPROVED: 'default',
  CUSTOMER_ACCEPTED: 'default',
  DEPOSIT_PAID: 'default',
  DISBURSED: 'default',
  POLICY_GENERATED: 'default',
}

const statusLabel: Record<ApplicationStatus, string> = {
  DRAFT: 'Draft',
  NEW: 'New',
  AGENT_REVIEW: 'Agent Review',
  AGENT_ACCEPTED: 'Agent Accepted',
  AGENT_REJECTED: 'Agent Rejected',
  QUOTATION_GENERATED: 'Quotation Generated',
  QUOTATION_REJECTED: 'Quotation Rejected',
  QUOTATION_APPROVED: 'Quotation Approved',
  CUSTOMER_ACCEPTED: 'Customer Accepted',
  DEPOSIT_PAID: 'Deposit Paid',
  DISBURSED: 'Disbursed',
  POLICY_GENERATED: 'Policy Generated',
}

function DetailRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value == null) return null
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground text-sm font-medium">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  )
}

function formatDate(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null
  try {
    return format(new Date(dateStr), 'dd MMM yyyy - hh:mm aa')
  } catch {
    return dateStr
  }
}

function formatCurrency(value: string | null | undefined): string | null {
  if (value == null) return null
  return Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

function isImageUrl(url: string): boolean {
  return IMAGE_EXTENSIONS.some((ext) =>
    url.toLowerCase().split('?')[0].endsWith(ext)
  )
}

function DocumentPreview({
  url,
  label,
  onImageClick,
}: {
  url: string
  label: string
  onImageClick: (url: string) => void
}) {
  const isImage = isImageUrl(url)
  const fileName = url.split('/').pop()?.split('?')[0] || label

  if (isImage) {
    return (
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-sm font-medium">{label}</span>
        <div className="group relative overflow-hidden rounded-lg border bg-accent/30">
          <button
            type="button"
            className="block w-full cursor-pointer"
            onClick={() => onImageClick(url)}
          >
            <img
              src={url}
              alt={label}
              className="h-40 w-full object-cover transition-opacity group-hover:opacity-80"
            />
          </button>
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="size-9"
              onClick={() => onImageClick(url)}
            >
              <Eye className="size-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="size-9"
              onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
            >
              <ExternalLink className="size-4" />
            </Button>
            <a href={url} download={fileName}>
              <Button type="button" variant="secondary" size="icon" className="size-9">
                <Download className="size-4" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Non-image file (PDF, DOCX, etc.)
  return (
    <div className="flex flex-col gap-2">
      <span className="text-muted-foreground text-sm font-medium">{label}</span>
      <div className="flex items-center gap-3 rounded-md border p-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded border bg-accent/50">
          <FileTextIcon className="size-5 text-muted-foreground" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium">{fileName}</span>
          <span className="text-xs text-muted-foreground uppercase">
            {fileName.split('.').pop() || 'File'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
          >
            <ExternalLink className="size-4" />
          </Button>
          <a href={url} download={fileName}>
            <Button type="button" variant="ghost" size="icon" className="size-8">
              <Download className="size-4" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}

export default function ApplicationDetailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { applicationId } = useParams({ strict: false }) as { applicationId: string }
  const { application, isLoading } = useApplication(applicationId)
  const { history, isLoading: historyLoading } = useStatusHistory(applicationId)
  const { hasPermission } = usePermissions()
  const orgType = useUserOrgType()
  const { data: currentUser } = useCurrentUser()
  const [activeAction, setActiveAction] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Lookup insurance product config for quotation defaults (agent action)
  const { config: insuranceConfig } = useInsuranceProductConfig(
    orgType === 'AGENT' ? (application?.subtypeId ?? '') : ''
  )

  // Initialize all mutation hooks (cheap — no network until mutate is called)
  const submitMutation = useSubmitApplication()
  const returnToDraftMutation = useReturnToDraft()
  const agentAssignMutation = useAgentAssign()
  const agentReviewMutation = useAgentReview()
  const insurerAssignMutation = useInsurerAssign()
  const generateQuotationMutation = useGenerateQuotation()
  const reviseQuotationMutation = useReviseQuotation()
  const insurerReviewQuotationMutation = useInsurerReviewQuotation()
  const generatePolicyMutation = useGeneratePolicyFromApplication()

  // Resolve caller's org ID for assign dialogs
  const callerOrgId = currentUser?.userType === 'STAFF'
    ? (currentUser.profile as StaffProfile).orgId ?? ''
    : ''

  if (isLoading) {
    return (
      <div className="mx-2 my-3 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Card>
              <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="mx-2 my-3">
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/applications' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back')}
        </Button>
        <p className="text-muted-foreground mt-4 text-center text-sm">{t('noResults')}</p>
      </div>
    )
  }

  const availableActions = getAvailableActions(application.status, orgType, hasPermission)

  const handleAction = (actionKey: string) => {
    if (actionKey === 'edit') {
      navigate({ to: '/applications/$applicationId/edit', params: { applicationId } })
      return
    }
    setActiveAction(actionKey)
  }

  const closeDialog = () => setActiveAction(null)

  const insurerOrgId = application.insurerOrgId

  // Determine which org ID to use for assign dialogs
  function getAssignOrgId(): string {
    if (activeAction === 'agentAssign') return callerOrgId
    if (activeAction === 'insurerAssign') return insurerOrgId
    return callerOrgId
  }

  // Quotation defaults
  const defaultInsuredValue = Number(application.vehicleDetail?.presentEstimatedValue || 0)
  const defaultPremiumRatePct = Number(insuranceConfig?.premiumRatePct || 0)

  return (
    <div className="mx-2 my-3 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/applications' })}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{t('applicationDetails')}</h1>
        </div>
        <ApplicationActionBar actions={availableActions} onAction={handleAction} />
      </div>

      {/* Tabs: Details + Timeline */}
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">{t('details')}</TabsTrigger>
          <TabsTrigger value="timeline">{t('statusTimeline')}</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* ── Left Column (2/3) ── */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Application Info — parties and product */}
              <Card>
                <CardHeader><CardTitle>{t('applicationInformation')}</CardTitle></CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <DetailRow label={t('customer')} value={application.customer?.fullName} />
                  <Separator />
                  <DetailRow label={t('insurerOrganization')} value={application.insurerOrg?.name} />
                  <Separator />
                  <DetailRow label={t('bankOrganization')} value={application.bankOrg?.name} />
                  <Separator />
                  <DetailRow label={t('productSubtype')} value={application.subtype?.name} />
                </CardContent>
              </Card>

              {/* Vehicle Details */}
              {application.vehicleDetail && (
                <Card>
                  <CardHeader><CardTitle>{t('vehicleDetails')}</CardTitle></CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                      <DetailRow label={t('plateNumber')} value={application.vehicleDetail.plateNumber} />
                      <DetailRow label={t('chassisNumber')} value={application.vehicleDetail.chassisNumber} />
                      <DetailRow label={t('engineNumber')} value={application.vehicleDetail.engineNumber} />
                      <DetailRow label={t('vehicleMake')} value={application.vehicleDetail.vehicleMake} />
                      <DetailRow label={t('bodyType')} value={application.vehicleDetail.bodyType} />
                      <DetailRow label={t('horsePowerOrCc')} value={application.vehicleDetail.horsePowerOrCc} />
                      <DetailRow label={t('yearOfManufacture')} value={application.vehicleDetail.yearOfManufacture} />
                      <DetailRow label={t('carryingCapacity')} value={application.vehicleDetail.carryingCapacity} />
                      <DetailRow label={t('yearPurchased')} value={application.vehicleDetail.yearPurchased} />
                      <DetailRow label={t('pricePaid')} value={formatCurrency(application.vehicleDetail.pricePaid)} />
                    </div>
                    <Separator />
                    <DetailRow label={t('presentEstimatedValue')} value={formatCurrency(application.vehicleDetail.presentEstimatedValue)} />
                  </CardContent>
                </Card>
              )}

              {/* Documents */}
              {application.vehicleDetail && (application.vehicleDetail.titleDeedUrl || application.vehicleDetail.driversLicenseUrl) && (
                <Card>
                  <CardHeader><CardTitle>{t('documents')}</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {application.vehicleDetail.titleDeedUrl && (
                      <DocumentPreview
                        url={application.vehicleDetail.titleDeedUrl}
                        label={t('titleDeed')}
                        onImageClick={setPreviewUrl}
                      />
                    )}
                    {application.vehicleDetail.driversLicenseUrl && (
                      <DocumentPreview
                        url={application.vehicleDetail.driversLicenseUrl}
                        label={t('driversLicense')}
                        onImageClick={setPreviewUrl}
                      />
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Vehicle Photos */}
              {application.vehicleDetail?.photos && application.vehicleDetail.photos.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('vehiclePhotos')}</CardTitle>
                    <CardDescription>
                      {t('vehiclePhotosCount', { count: application.vehicleDetail.photos.length })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {application.vehicleDetail.photos.map((photo) => {
                        const photoName = photo.url.split('/').pop()?.split('?')[0] || 'photo'
                        return (
                          <div
                            key={photo.id}
                            className="group relative overflow-hidden rounded-lg border bg-accent/30"
                          >
                            <button
                              type="button"
                              className="block w-full cursor-pointer"
                              onClick={() => setPreviewUrl(photo.url)}
                            >
                              <img
                                src={photo.url}
                                alt={t('vehiclePhotos')}
                                className="h-40 w-full object-cover transition-opacity group-hover:opacity-80"
                              />
                            </button>
                            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                              <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                className="size-9"
                                onClick={() => setPreviewUrl(photo.url)}
                              >
                                <Eye className="size-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                className="size-9"
                                onClick={() => window.open(photo.url, '_blank', 'noopener,noreferrer')}
                              >
                                <ExternalLink className="size-4" />
                              </Button>
                              <a href={photo.url} download={photoName}>
                                <Button type="button" variant="secondary" size="icon" className="size-9">
                                  <Download className="size-4" />
                                </Button>
                              </a>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* ── Right Column (1/3) ── */}
            <div className="flex flex-col gap-4 lg:sticky lg:top-4 lg:self-start">
              {/* Status & Metadata */}
              <Card>
                <CardHeader><CardTitle>{t('statusAndMetadata')}</CardTitle></CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm font-medium">{t('status')}</span>
                    <Badge variant={statusVariant[application.status]}>
                      {statusLabel[application.status]}
                    </Badge>
                  </div>
                  <Separator />
                  <DetailRow label={t('appliedFrom')} value={application.appliedFrom} />
                  <Separator />
                  <DetailRow label={t('submittedAt')} value={formatDate(application.submittedAt)} />
                  {application.agentAssignedName && (
                    <>
                      <Separator />
                      <DetailRow label={t('agentAssignedTo')} value={application.agentAssignedName} />
                    </>
                  )}
                  {application.insurerAssignedName && (
                    <>
                      <Separator />
                      <DetailRow label={t('insurerAssignedTo')} value={application.insurerAssignedName} />
                    </>
                  )}
                  {application.rejectionReason && (
                    <>
                      <Separator />
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground text-sm font-medium">{t('rejectionReason')}</span>
                        <span className="text-sm text-destructive">{application.rejectionReason}</span>
                      </div>
                    </>
                  )}
                  <Separator />
                  <DetailRow label={t('createdAt')} value={formatDate(application.createdAt)} />
                  <Separator />
                  <DetailRow label={t('updatedAt')} value={formatDate(application.updatedAt)} />
                </CardContent>
              </Card>

              {/* Financial Summary */}
              {application.insuredValue && (
                <Card>
                  <CardHeader><CardTitle>{t('financialSummary')}</CardTitle></CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <DetailRow label={t('insuredValue')} value={formatCurrency(application.insuredValue)} />
                    <Separator />
                    <DetailRow label={t('premiumRate')} value={application.premiumRatePct ? `${application.premiumRatePct}%` : null} />
                    <Separator />
                    <DetailRow label={t('vatRate')} value={application.vatRatePct ? `${application.vatRatePct}%` : null} />
                    <Separator />
                    <DetailRow label={t('premiumAmount')} value={formatCurrency(application.premiumAmount)} />
                    <Separator />
                    <DetailRow label={t('depositRate')} value={application.depositRatePct ? `${application.depositRatePct}%` : null} />
                    <Separator />
                    <DetailRow label={t('depositAmount')} value={formatCurrency(application.depositAmount)} />
                    <Separator />
                    <DetailRow label={t('financedAmount')} value={formatCurrency(application.financedAmount)} />
                    <Separator />
                    <DetailRow label={t('interestRate')} value={application.interestRatePct ? `${application.interestRatePct}%` : null} />
                    <Separator />
                    <DetailRow label={t('totalRepayment')} value={formatCurrency(application.totalRepayment)} />
                    <Separator />
                    <DetailRow label={t('monthlyPayment')} value={formatCurrency(application.monthlyPayment)} />
                    <Separator />
                    <DetailRow label={t('tenureMonths')} value={application.tenureMonths} />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardHeader><CardTitle>{t('statusHistory')}</CardTitle></CardHeader>
            <CardContent>
              <StatusTimeline history={history} isLoading={historyLoading} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Action Dialogs ── */}

      {/* Submit (confirm) */}
      <ConfirmActionDialog
        open={activeAction === 'submit'}
        onOpenChange={(open) => !open && closeDialog()}
        title={t('submitApplicationTitle')}
        description={t('submitApplicationDescription')}
        confirmLabel={t('submitApplication')}
        onConfirm={async () => {
          await submitMutation.mutateAsync({ applicationId })
          closeDialog()
        }}
        isPending={submitMutation.isPending}
      />

      {/* Return to Draft (confirm + optional reason) */}
      <ConfirmReasonDialog
        open={activeAction === 'returnToDraft'}
        onOpenChange={(open) => !open && closeDialog()}
        title={t('returnToDraftTitle')}
        description={t('returnToDraftDescription')}
        fieldLabel={t('reasonOptional')}
        confirmLabel={t('returnToDraft')}
        onConfirm={async (reason) => {
          await returnToDraftMutation.mutateAsync({ applicationId, data: { reason: reason || undefined } })
          closeDialog()
        }}
        isPending={returnToDraftMutation.isPending}
      />

      {/* Agent Review */}
      <ReviewDialog
        open={activeAction === 'agentReview'}
        onOpenChange={(open) => !open && closeDialog()}
        title={t('reviewApplicationTitle')}
        onConfirm={async (action, reason) => {
          await agentReviewMutation.mutateAsync({
            applicationId,
            data: { action, rejectionReason: reason },
          })
          closeDialog()
        }}
        isPending={agentReviewMutation.isPending}
      />

      {/* Insurer Review Quotation */}
      <ReviewDialog
        open={activeAction === 'insurerReviewQuotation'}
        onOpenChange={(open) => !open && closeDialog()}
        title={t('reviewQuotationTitle')}
        onConfirm={async (action, reason) => {
          await insurerReviewQuotationMutation.mutateAsync({
            applicationId,
            data: { action, rejectionReason: reason },
          })
          closeDialog()
        }}
        isPending={insurerReviewQuotationMutation.isPending}
      />

      {/* Agent Assign */}
      <AssignDialog
        open={activeAction === 'agentAssign'}
        onOpenChange={(open) => !open && closeDialog()}
        title={t('assignApplicationTitle')}
        description={t('assignApplicationDescription')}
        orgId={getAssignOrgId()}
        currentAssigneeId={application.agentAssignedTo}
        onConfirm={async (staffId) => {
          await agentAssignMutation.mutateAsync({
            applicationId,
            data: { assignedTo: staffId },
          })
          closeDialog()
        }}
        isPending={agentAssignMutation.isPending}
      />

      {/* Insurer Assign */}
      <AssignDialog
        open={activeAction === 'insurerAssign'}
        onOpenChange={(open) => !open && closeDialog()}
        title={t('assignApplicationTitle')}
        description={t('assignApplicationDescription')}
        orgId={getAssignOrgId()}
        currentAssigneeId={application.insurerAssignedTo}
        onConfirm={async (staffId) => {
          await insurerAssignMutation.mutateAsync({
            applicationId,
            data: { assignedTo: staffId },
          })
          closeDialog()
        }}
        isPending={insurerAssignMutation.isPending}
      />

      {/* Generate Quotation */}
      <QuotationFormDialog
        open={activeAction === 'generateQuotation'}
        onOpenChange={(open) => !open && closeDialog()}
        onConfirm={async (data) => {
          await generateQuotationMutation.mutateAsync({ applicationId, data })
          closeDialog()
        }}
        isPending={generateQuotationMutation.isPending}
        defaultInsuredValue={defaultInsuredValue}
        defaultPremiumRatePct={defaultPremiumRatePct}
      />

      {/* Revise Quotation (after insurer rejection) */}
      <QuotationFormDialog
        open={activeAction === 'reviseQuotation'}
        onOpenChange={(open) => !open && closeDialog()}
        onConfirm={async (data) => {
          await reviseQuotationMutation.mutateAsync({ applicationId, data })
          closeDialog()
        }}
        isPending={reviseQuotationMutation.isPending}
        defaultInsuredValue={Number(application.insuredValue || defaultInsuredValue)}
        defaultPremiumRatePct={Number(application.premiumRatePct || defaultPremiumRatePct)}
      />

      {/* Generate Policy */}
      <ConfirmActionDialog
        open={activeAction === 'generatePolicy'}
        onOpenChange={(open) => !open && closeDialog()}
        title={t('generatePolicyTitle')}
        description={t('generatePolicyDescription')}
        confirmLabel={t('generatePolicy')}
        onConfirm={async () => {
          await generatePolicyMutation.generatePolicyAsync(applicationId)
          closeDialog()
        }}
        isPending={generatePolicyMutation.isPending}
      />

      {/* Fullscreen image preview */}
      <ImagePreviewDialog
        open={!!previewUrl}
        onOpenChange={(open) => {
          if (!open) setPreviewUrl(null)
        }}
        src={previewUrl ?? ''}
        alt={t('imagePreview')}
      />
    </div>
  )
}
