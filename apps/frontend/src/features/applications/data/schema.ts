import { z } from 'zod'
import { VEHICLE_BODY_TYPES } from './types'

// Step 1: Customer & Product
export const step1Schema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  insurerOrgId: z.string().min(1, 'Insurer organization is required'),
  subtypeId: z.string().min(1, 'Product subtype is required'),
})

// Step 2: Vehicle Details
export const step2Schema = z.object({
  plateNumber: z.string().min(1, 'Plate number is required').max(50),
  chassisNumber: z.string().min(1, 'Chassis number is required').max(100),
  engineNumber: z.string().min(1, 'Engine number is required').max(100),
  vehicleMake: z.string().min(1, 'Vehicle make is required').max(100),
  bodyType: z.enum(VEHICLE_BODY_TYPES),
  horsePowerOrCc: z.number().int().min(1),
  yearOfManufacture: z.number().int().min(1900),
  carryingCapacity: z.number().int().min(0),
  yearPurchased: z.number().int().min(1900),
  pricePaid: z.number().min(0),
  presentEstimatedValue: z.number().min(0),
})

// Step 3: Documents
export const step3Schema = z.object({
  titleDeedUrl: z.string().optional(),
  driversLicenseUrl: z.string().optional(),
  photoUrls: z.array(z.string()).optional(),
})

// Combined for form-level validation
export const createApplicationSchema = step1Schema.merge(step2Schema).merge(step3Schema)

export const generateQuotationSchema = z.object({
  insuredValue: z.number().min(0, 'Insured value must be positive'),
  premiumRatePct: z.number().min(0, 'Premium rate must be positive'),
})

export type CreateApplicationFormData = z.infer<typeof createApplicationSchema>
export type GenerateQuotationFormData = z.infer<typeof generateQuotationSchema>

// ── Dialog Schemas ──

export const reviewSchema = z
  .object({
    action: z.enum(['ACCEPT', 'REJECT']),
    rejectionReason: z.string().optional(),
  })
  .refine(
    (data) => data.action === 'ACCEPT' || (data.rejectionReason && data.rejectionReason.trim().length > 0),
    { message: 'Rejection reason is required when rejecting', path: ['rejectionReason'] },
  )

export const reasonSchema = z.object({
  reason: z.string().optional(),
})

export type ReviewFormData = z.infer<typeof reviewSchema>
export type ReasonFormData = z.infer<typeof reasonSchema>
