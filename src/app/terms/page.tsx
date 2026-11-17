import type { Metadata } from 'next'
import { LegalDocument } from '@/components/legal/LegalDocument'

export const metadata: Metadata = { title: '이용약관 · 클랫' }

export default function TermsPage() {
  return <LegalDocument file="terms-of-service.md" current="terms" />
}
