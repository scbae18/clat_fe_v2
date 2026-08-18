import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CLAT 관리자',
  robots: { index: false, follow: false },
}

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  return children
}
