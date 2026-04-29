// Mirrors @org/shared-config enum constants for frontend use.
// Duplicated here to avoid pulling NestJS transitive deps into Vite.

// ── User Types ──
export const USER_TYPES = ['STAFF', 'CUSTOMER'] as const
export type UserType = (typeof USER_TYPES)[number]

// ── Org Types ──
export const ORG_TYPES = ['SYSTEM', 'AGENT', 'BANK', 'INSURER'] as const
export type OrgType = (typeof ORG_TYPES)[number]


export const CREATABLE_ORG_TYPES = ['AGENT', 'INSURER'] as const
export type CreatableOrgType = (typeof CREATABLE_ORG_TYPES)[number]

// ── Org Status ──
export const ORG_STATUSES = ['ACTIVE', 'SUSPENDED', 'INACTIVE'] as const
export type OrgStatus = (typeof ORG_STATUSES)[number]

// ── Account Status (Staff) ──
export const ACCOUNT_STATUSES = ['ACTIVE', 'SUSPENDED', 'INACTIVE'] as const
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number]

// ── Customer Status ──
export const CUSTOMER_STATUSES = [
  'ACTIVE',
  'SUSPENDED',
  'BLACKLISTED',
] as const
export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number]


// ── Policy Status ──
export const POLICY_STATUSES = ['ACTIVE', 'INACTIVE', 'EXPIRED', 'CANCELLED'] as const
export type PolicyStatus = (typeof POLICY_STATUSES)[number]


// ── Payment Schedule Status ──
export const PAYMENT_SCHEDULE_STATUSES = ['PENDING', 'PAID', 'MISSED', 'OVERDUE'] as const
export type PaymentScheduleStatus = (typeof PAYMENT_SCHEDULE_STATUSES)[number]
