import type { Metadata, Viewport } from 'next'
import './globals.css'
import AppProviders from '@/components/providers/AppProviders'

export const metadata: Metadata = {
  title: '클랫',
  description: '출강 강사를 위한 학생 관리 및 문자 자동화 서비스',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
