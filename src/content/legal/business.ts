export const business = {
  name: '클랫',
  representative: '배승찬',
  address: '경기도 수원시 팔달구 경수대로 609-7, 2층 가30호(지동)',
  phone: '010-7324-7708',
  phoneTel: '01073247708',
  email: 'scbae18@gmail.com',
  registrationNumber: '763-16-02814',
  hosting: 'Vercel · Amazon Web Services',
  privacyOfficer: '배승찬',
  mailOrderNote: '통신판매업 신고번호는 신고가 끝나면 이 자리에 표시합니다.',
  effectiveDate: '2026년 12월 28일',
} as const

export const legalLinks = [
  { href: '/terms', id: 'terms', label: '이용약관' },
  { href: '/privacy', id: 'privacy', label: '개인정보 처리방침' },
  { href: '/refund', id: 'refund', label: '환불 규정' },
] as const

export type LegalDocId = (typeof legalLinks)[number]['id']
