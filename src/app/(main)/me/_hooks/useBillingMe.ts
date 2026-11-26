'use client'

import { useQuery } from '@tanstack/react-query'
import { isEnforcedBilling } from '@/lib/billingView'
import { billingService, type BillingInvoice } from '@/services/billing'

export function useBillingMe() {
  const meQuery = useQuery({
    queryKey: ['billing', 'me'],
    queryFn: () => billingService.me(),
    refetchOnWindowFocus: false,
    retry: false,
  })
  const enforced = isEnforcedBilling(meQuery.data) ? meQuery.data : null
  const invoicesQuery = useQuery({
    queryKey: ['billing', 'invoices'],
    queryFn: () => billingService.invoices(),
    enabled: enforced != null,
    refetchOnWindowFocus: false,
    retry: false,
  })

  return {
    enforced,
    billingOff: meQuery.isSuccess && !isEnforcedBilling(meQuery.data),
    invoices: (enforced ? invoicesQuery.data : []) ?? ([] as BillingInvoice[]),
  }
}
