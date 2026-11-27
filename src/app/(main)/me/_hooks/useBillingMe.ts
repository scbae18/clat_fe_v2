'use client'

import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
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
  const invoicesQuery = useInfiniteQuery({
    queryKey: ['billing', 'invoices'],
    queryFn: ({ pageParam }) => billingService.invoices(pageParam),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (last) => last.next_cursor ?? undefined,
    enabled: enforced != null,
    refetchOnWindowFocus: false,
    retry: false,
    refetchInterval: (query) =>
      query.state.data?.pages.some((page) => page.invoices.some((row) => row.status === 'PENDING')) ? 4000 : false,
  })
  const invoices = invoicesQuery.data?.pages.flatMap((page) => page.invoices) ?? ([] as BillingInvoice[])

  return {
    enforced,
    billingOff: meQuery.isSuccess && !isEnforcedBilling(meQuery.data),
    invoices: enforced ? invoices : ([] as BillingInvoice[]),
    hasOlderInvoices: invoicesQuery.hasNextPage,
    loadingOlderInvoices: invoicesQuery.isFetchingNextPage,
    loadOlderInvoices: () => invoicesQuery.fetchNextPage(),
  }
}
