import type { Metadata } from 'next'
import { LegalDocument } from '@/components/legal/LegalDocument'

export const metadata: Metadata = { title: '개인정보 처리방침 · 클랫' }

export default function PrivacyPage() {
  return <LegalDocument file="privacy-policy.md" current="privacy" />
}
