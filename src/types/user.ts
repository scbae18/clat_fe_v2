export interface User {
  id: number
  email: string
  name: string
  phone: string | null
  created_at: string
  approval_status?: 'PENDING' | 'APPROVED' | 'REJECTED'
}
