export interface User {
  id: number
  email: string
  name: string
  created_at: string
  approval_status?: 'PENDING' | 'APPROVED' | 'REJECTED'
}
