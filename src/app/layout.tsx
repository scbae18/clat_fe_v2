import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '클랫',
  description: '출강 강사를 위한 학생 관리 및 문자 자동화 서비스',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
