import type { ApplicationStatus, OrgType } from './types'

export type ActionDialogType =
  | 'confirm'
  | 'confirm-reason'
  | 'review'
  | 'assign'
  | 'quotation-form'
  | 'navigate-edit'

export interface ActionConfig {
  key: string
  labelKey: string
  permission: string
  orgTypes: OrgType[]
  variant: 'default' | 'destructive' | 'outline' | 'secondary'
  dialogType: ActionDialogType
}

const STATUS_ACTIONS: Partial<Record<ApplicationStatus, ActionConfig[]>> = {
  DRAFT: [
    { key: 'edit', labelKey: 'editApplication', permission: 'application:update', orgTypes: ['AGENT'], variant: 'outline', dialogType: 'navigate-edit' },
    { key: 'submit', labelKey: 'submitApplication', permission: 'application:update', orgTypes: ['AGENT'], variant: 'default', dialogType: 'confirm' },
  ],
  NEW: [
    { key: 'agentAssign', labelKey: 'assignToAgent', permission: 'application:assign', orgTypes: ['AGENT'], variant: 'default', dialogType: 'assign' },
  ],
  AGENT_REVIEW: [
    { key: 'agentAssign', labelKey: 'reassignAgent', permission: 'application:assign', orgTypes: ['AGENT'], variant: 'outline', dialogType: 'assign' },
    { key: 'agentReview', labelKey: 'reviewApplication', permission: 'application:review', orgTypes: ['AGENT'], variant: 'default', dialogType: 'review' },
  ],
  AGENT_REJECTED: [
    { key: 'returnToDraft', labelKey: 'returnToDraft', permission: 'application:update', orgTypes: ['AGENT'], variant: 'outline', dialogType: 'confirm-reason' },
  ],
  AGENT_ACCEPTED: [
    { key: 'generateQuotation', labelKey: 'generateQuotation', permission: 'application:generate-quotation', orgTypes: ['AGENT'], variant: 'default', dialogType: 'quotation-form' },
  ],
  QUOTATION_GENERATED: [
    { key: 'insurerAssign', labelKey: 'assignToInsurer', permission: 'application:assign', orgTypes: ['INSURER'], variant: 'outline', dialogType: 'assign' },
    { key: 'insurerReviewQuotation', labelKey: 'reviewQuotation', permission: 'application:review-quotation', orgTypes: ['INSURER'], variant: 'default', dialogType: 'review' },
  ],
  QUOTATION_REJECTED: [
    { key: 'reviseQuotation', labelKey: 'reviseQuotation', permission: 'application:generate-quotation', orgTypes: ['AGENT'], variant: 'default', dialogType: 'quotation-form' },
  ],
  DISBURSED: [
    { key: 'generatePolicy', labelKey: 'generatePolicy', permission: 'policy:create', orgTypes: ['INSURER', 'SYSTEM'], variant: 'default', dialogType: 'confirm' },
  ],
}

export function getAvailableActions(
  status: ApplicationStatus,
  userOrgType: OrgType | null,
  hasPermission: (p: string) => boolean,
): ActionConfig[] {
  const actions = STATUS_ACTIONS[status] ?? []
  return actions.filter((a) => {
    if (!hasPermission(a.permission)) return false
    return userOrgType ? a.orgTypes.includes(userOrgType) : false
  })
}
