import type { Metadata } from 'next'
import { LegalDocument } from '@/components/legal/LegalDocument'

export const metadata: Metadata = { title: '환불 규정 · 클랫' }

export default function RefundPage() {
  return <LegalDocument file="refund-policy.md" current="refund" />
}
