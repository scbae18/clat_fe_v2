export type UpdateNoticeItem = {
  title: string
  description: string
}

export type UpdateNotice = {
  id: number
  title: string
  subtitle: string
  items: UpdateNoticeItem[]
  is_active: boolean
  created_at: string
  created_by: number
}

export function whatsNewStorageKey(userId: number, noticeId: number) {
  return `clat-whats-new:${noticeId}:${userId}`
}
