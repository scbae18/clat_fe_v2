export interface User {
  id: number
  email: string
  name: string
  phone: string | null
  created_at: string
  approval_status?: 'PENDING' | 'APPROVED' | 'REJECTED'
  phone_verified?: boolean
  has_password?: boolean
  linked_providers?: Array<'kakao' | 'google'>
  needs_identity_verification?: boolean
  needs_social_prompt?: boolean
}
