import type { PaginatedResponseDto } from '@org/shared-config'

export const APPLICATION_STATUSES = [
  'DRAFT', 'NEW',
  'AGENT_REVIEW', 'AGENT_ACCEPTED', 'AGENT_REJECTED',
  'QUOTATION_GENERATED', 'QUOTATION_REJECTED', 'QUOTATION_APPROVED',
  'CUSTOMER_ACCEPTED',
  'DEPOSIT_PAID', 'DISBURSED', 'POLICY_GENERATED',
] as const
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

export const APPLICATION_STATUS = {
  DRAFT: 'DRAFT',
  NEW: 'NEW',
  AGENT_REVIEW: 'AGENT_REVIEW',
  AGENT_ACCEPTED: 'AGENT_ACCEPTED',
  AGENT_REJECTED: 'AGENT_REJECTED',
  QUOTATION_GENERATED: 'QUOTATION_GENERATED',
  QUOTATION_REJECTED: 'QUOTATION_REJECTED',
  QUOTATION_APPROVED: 'QUOTATION_APPROVED',
  CUSTOMER_ACCEPTED: 'CUSTOMER_ACCEPTED',
  DEPOSIT_PAID: 'DEPOSIT_PAID',
  DISBURSED: 'DISBURSED',
  POLICY_GENERATED: 'POLICY_GENERATED',
} as const satisfies Record<string, ApplicationStatus>

export const APPLICATION_STATUS_OPTIONS: { value: ApplicationStatus; labelKey: string }[] = [
  { value: APPLICATION_STATUS.DRAFT, labelKey: 'statusDraft' },
  { value: APPLICATION_STATUS.NEW, labelKey: 'statusNew' },
  { value: APPLICATION_STATUS.AGENT_REVIEW, labelKey: 'statusAgentReview' },
  { value: APPLICATION_STATUS.AGENT_ACCEPTED, labelKey: 'statusAgentAccepted' },
  { value: APPLICATION_STATUS.AGENT_REJECTED, labelKey: 'statusAgentRejected' },
  { value: APPLICATION_STATUS.QUOTATION_GENERATED, labelKey: 'statusQuotationGenerated' },
  { value: APPLICATION_STATUS.QUOTATION_REJECTED, labelKey: 'statusQuotationRejected' },
  { value: APPLICATION_STATUS.QUOTATION_APPROVED, labelKey: 'statusQuotationApproved' },
  { value: APPLICATION_STATUS.CUSTOMER_ACCEPTED, labelKey: 'statusCustomerAccepted' },
  { value: APPLICATION_STATUS.DEPOSIT_PAID, labelKey: 'statusDepositPaid' },
  { value: APPLICATION_STATUS.DISBURSED, labelKey: 'statusDisbursed' },
  { value: APPLICATION_STATUS.POLICY_GENERATED, labelKey: 'policyGenerated' },
]

export const VEHICLE_BODY_TYPES = [
  'SEDAN', 'SUV', 'PICKUP', 'MINIBUS', 'TRUCK', 'MOTORCYCLE', 'OTHER',
] as const
export type VehicleBodyType = (typeof VEHICLE_BODY_TYPES)[number]

export const VEHICLE_BODY_TYPE_OPTIONS: { value: VehicleBodyType; labelKey: string }[] = [
  { value: 'SEDAN', labelKey: 'bodyTypeSedan' },
  { value: 'SUV', labelKey: 'bodyTypeSuv' },
  { value: 'PICKUP', labelKey: 'bodyTypePickup' },
  { value: 'MINIBUS', labelKey: 'bodyTypeMinibus' },
  { value: 'TRUCK', labelKey: 'bodyTypeTruck' },
  { value: 'MOTORCYCLE', labelKey: 'bodyTypeMotorcycle' },
  { value: 'OTHER', labelKey: 'bodyTypeOther' },
]

export const APPLIED_FROM_VALUES = ['MOBILE', 'WEB'] as const
export type AppliedFrom = (typeof APPLIED_FROM_VALUES)[number]

export interface VehiclePhoto {
  id: string
  vehicleDetailId: string
  url: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface VehicleDetail {
  id: string
  plateNumber: string
  chassisNumber: string
  engineNumber: string
  vehicleMake: string
  bodyType: VehicleBodyType
  horsePowerOrCc: number
  yearOfManufacture: number
  carryingCapacity: number
  yearPurchased: number
  pricePaid: string
  presentEstimatedValue: string
  titleDeedUrl: string | null
  driversLicenseUrl: string | null
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  photos: VehiclePhoto[]
}

export interface Application {
  id: string
  customerId: string
  insurerOrgId: string
  bankOrgId: string
  productType: string
  subtypeId: string
  productDetailId: string
  appliedFrom: AppliedFrom
  appliedByStaff: string | null
  insuredValue: string | null
  premiumRatePct: string | null
  vatRatePct: string | null
  premiumAmount: string | null
  depositRatePct: string | null
  depositAmount: string | null
  financedAmount: string | null
  interestRatePct: string | null
  totalRepayment: string | null
  monthlyPayment: string | null
  tenureMonths: number | null
  originalInsuredValue: string | null
  originalPremiumRatePct: string | null
  status: ApplicationStatus
  rejectionReason: string | null
  agentAssignedTo: string | null
  agentAssignedAt: string | null
  agentReviewedBy: string | null
  agentReviewedAt: string | null
  insurerAssignedTo: string | null
  insurerAssignedAt: string | null
  quotationGeneratedBy: string | null
  quotationGeneratedAt: string | null
  quotationReviewedBy: string | null
  quotationReviewedAt: string | null
  quotationApprovedBy: string | null
  submittedAt: string | null
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  // Joined data (from GET detail)
  customer?: { id: string; fullName: string; phone: string | null; email: string | null } | null
  insurerOrg?: { id: string; name: string; orgType: string } | null
  bankOrg?: { id: string; name: string; orgType: string } | null
  subtype?: { id: string; name: string; productType: string } | null
  vehicleDetail?: VehicleDetail | null
  statusHistory?: StatusHistoryEntry[]
  agentAssignedName?: string | null
  insurerAssignedName?: string | null
  // List-specific joined fields
  customerName?: string
  insurerOrgName?: string
  bankOrgName?: string
  subtypeName?: string
}

export type ApplicationListResponse = PaginatedResponseDto<Application>

export interface ApplicationTableState {
  page: number
  limit: number
  search?: string
  status?: ApplicationStatus
  productType?: string
  subtypeId?: string
}

export interface CreateApplicationRequest {
  customerId: string
  plateNumber: string
  chassisNumber: string
  engineNumber: string
  vehicleMake: string
  bodyType: string
  horsePowerOrCc: number
  yearOfManufacture: number
  carryingCapacity: number
  yearPurchased: number
  pricePaid: number
  presentEstimatedValue: number
  titleDeedUrl?: string
  driversLicenseUrl?: string
  photoUrls?: string[]
  insurerOrgId: string
  bankOrgId: string
  subtypeId: string
  appliedFrom: string
  appliedByStaff?: string
}

export interface ApplicationFormValues {
  customerId: string
  insurerOrgId: string
  bankOrgId: string
  subtypeId: string
  plateNumber: string
  chassisNumber: string
  engineNumber: string
  vehicleMake: string
  bodyType: string
  horsePowerOrCc: number
  yearOfManufacture: number
  carryingCapacity: number
  yearPurchased: number
  pricePaid: number
  presentEstimatedValue: number
  titleDeedUrl: string
  driversLicenseUrl: string
  photoUrls: string[]
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export type ApplicationFormApi = any

export interface AssignApplicationRequest {
  assignedTo: string
}

export interface ReviewApplicationRequest {
  action: 'ACCEPT' | 'REJECT'
  rejectionReason?: string
}

export interface GenerateQuotationRequest {
  insuredValue: number
  premiumRatePct: number
}

export interface ReviseQuotationRequest {
  insuredValue: number
  premiumRatePct: number
}

// ── Status History ──

export interface StatusHistoryEntry {
  fromStatus: ApplicationStatus | null
  toStatus: ApplicationStatus
  action: string
  reason: string | null
  actorName: string | null
  createdAt: string
}

// ── New Lifecycle Request Types ──

export type OrgType = 'SYSTEM' | 'AGENT' | 'BANK' | 'INSURER'

export interface UpdateApplicationRequest {
  plateNumber?: string
  chassisNumber?: string
  engineNumber?: string
  vehicleMake?: string
  bodyType?: string
  horsePowerOrCc?: number
  yearOfManufacture?: number
  carryingCapacity?: number
  yearPurchased?: number
  pricePaid?: number
  presentEstimatedValue?: number
  titleDeedUrl?: string
  driversLicenseUrl?: string
  photoUrls?: string[]
  insurerOrgId?: string
  bankOrgId?: string
  subtypeId?: string
}

export interface ReturnToDraftRequest {
  reason?: string
}

