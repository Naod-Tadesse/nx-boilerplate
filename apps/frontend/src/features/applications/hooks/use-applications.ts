import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import ApiClient from '@/services/api-client'
import { toast } from 'sonner'
import type {
  Application,
  ApplicationListResponse,
  ApplicationTableState,
  CreateApplicationRequest,
  UpdateApplicationRequest,
  AssignApplicationRequest,
  ReviewApplicationRequest,
  GenerateQuotationRequest,
  ReviseQuotationRequest,
  ReturnToDraftRequest,
  StatusHistoryEntry,
} from '../data/types'

const apiClient = new ApiClient('/api')

// ============================================
// Lookup Queries
// ============================================

interface InsuranceProductSubtype {
  id: string
  name: string
  productType: string
}

export function useInsuranceProductSubtypes() {
  const query = useQuery({
    queryKey: ['insurance-product-subtypes'],
    queryFn: () =>
      apiClient.get<{ data: InsuranceProductSubtype[] }>('/insurance-product-subtypes', {
        params: { productType: 'MOTOR', limit: 100 },
      }),
  })

  return {
    subtypes: query.data?.data ?? [],
    isLoading: query.isLoading,
  }
}

interface InsuranceProductConfigItem {
  id: string
  insurerOrgId: string
  subtypeId: string
  premiumRatePct: string
  isActive: boolean
}

export function useInsuranceProductConfig(subtypeId: string) {
  const query = useQuery({
    queryKey: ['insurance-configs', 'lookup', subtypeId],
    queryFn: () =>
      apiClient.get<{ data: InsuranceProductConfigItem[] }>('/insurance-product-configs', {
        params: { page: 1, limit: 100 },
      }),
    enabled: !!subtypeId,
    select: (data) =>
      data.data.find((c) => c.subtypeId === subtypeId && c.isActive) ?? null,
  })

  return {
    config: query.data ?? null,
    isLoading: query.isLoading,
  }
}

// ============================================
// Queries
// ============================================

export function useApplications(tableState: ApplicationTableState) {
  const query = useQuery({
    queryKey: ['applications', 'list', tableState],
    queryFn: () =>
      apiClient.get<ApplicationListResponse>('/applications', {
        params: {
          page: tableState.page,
          limit: tableState.limit,
          ...(tableState.search && { search: tableState.search }),
          ...(tableState.status && { status: tableState.status }),
          ...(tableState.productType && { productType: tableState.productType }),
          ...(tableState.subtypeId && { subtypeId: tableState.subtypeId }),
        },
      }),
  })

  const meta = query.data?.meta

  return {
    applications: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
    paginationInfo: {
      page: meta?.page ?? tableState.page,
      limit: meta?.limit ?? tableState.limit,
      total: meta?.total ?? 0,
      totalPages: meta?.totalPages ?? 1,
      hasNext: (meta?.page ?? 0) < (meta?.totalPages ?? 1),
      hasPrev: (meta?.page ?? 1) > 1,
    },
  }
}

export function useApplication(id: string) {
  const query = useQuery({
    queryKey: ['applications', 'detail', id],
    queryFn: () => apiClient.get<Application>(`/applications/${id}`),
    enabled: !!id,
  })

  return {
    application: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  }
}

export function useStatusHistory(applicationId: string) {
  const query = useQuery({
    queryKey: ['applications', 'history', applicationId],
    queryFn: () => apiClient.get<StatusHistoryEntry[]>(`/applications/${applicationId}/status-history`),
    enabled: !!applicationId,
  })

  return {
    history: query.data ?? [],
    isLoading: query.isLoading,
  }
}

// ============================================
// Helper: create a standard mutation hook
// ============================================

function useApplicationMutation<TData = unknown>(
  method: 'patch' | 'post',
  urlFn: (applicationId: string) => string,
  successMessage: string,
) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ applicationId, data }: { applicationId: string; data?: TData }) =>
      method === 'post'
        ? apiClient.post(urlFn(applicationId), data ?? {})
        : apiClient.patch(urlFn(applicationId), data ?? {}),
    onSuccess: (_, { applicationId }) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['applications', 'detail', applicationId] })
      queryClient.invalidateQueries({ queryKey: ['applications', 'history', applicationId] })
      toast.success(successMessage)
    },
  })

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  }
}

// ============================================
// Mutations — Core
// ============================================

export function useCreateApplication() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: CreateApplicationRequest) =>
      apiClient.post<Application>('/applications', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })

  return {
    createApplication: mutation.mutate,
    createApplicationAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  }
}

export function useUpdateApplication() {
  return useApplicationMutation<UpdateApplicationRequest>(
    'patch',
    (id) => `/applications/${id}`,
    'Application updated successfully',
  )
}

// ============================================
// Mutations — General Actions
// ============================================

export function useSubmitApplication() {
  return useApplicationMutation(
    'patch',
    (id) => `/applications/${id}/submit`,
    'Application submitted successfully',
  )
}

export function useReturnToDraft() {
  return useApplicationMutation<ReturnToDraftRequest>(
    'patch',
    (id) => `/applications/${id}/return-to-draft`,
    'Application returned to draft',
  )
}

// ============================================
// Mutations — Agent Actions
// ============================================

export function useAgentAssign() {
  return useApplicationMutation<AssignApplicationRequest>(
    'patch',
    (id) => `/applications/${id}/agent/assign`,
    'Application assigned successfully',
  )
}

export function useAgentReview() {
  return useApplicationMutation<ReviewApplicationRequest>(
    'patch',
    (id) => `/applications/${id}/agent/review`,
    'Application reviewed successfully',
  )
}

// ============================================
// Mutations — Insurer Actions
// ============================================

export function useInsurerAssign() {
  return useApplicationMutation<AssignApplicationRequest>(
    'patch',
    (id) => `/applications/${id}/insurer/assign`,
    'Application assigned successfully',
  )
}

export function useGenerateQuotation() {
  return useApplicationMutation<GenerateQuotationRequest>(
    'post',
    (id) => `/applications/${id}/agent/quotation`,
    'Quotation generated successfully',
  )
}

export function useReviseQuotation() {
  return useApplicationMutation<ReviseQuotationRequest>(
    'patch',
    (id) => `/applications/${id}/agent/revise-quotation`,
    'Quotation revised successfully',
  )
}

export function useInsurerReviewQuotation() {
  return useApplicationMutation<ReviewApplicationRequest>(
    'patch',
    (id) => `/applications/${id}/insurer/review-quotation`,
    'Quotation reviewed successfully',
  )
}

// ============================================
// Mutations — Policy Generation
// ============================================

export function useGeneratePolicyFromApplication() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (applicationId: string) =>
      apiClient.post('/policies', { applicationId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['policies'] })
      toast.success('Policy generated successfully')
    },
  })

  return {
    generatePolicy: mutation.mutate,
    generatePolicyAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  }
}
