export type UpdateNoticeItem = {
  title: string
  description: string
  image_url?: string
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

export function resolveNoticeImageUrl(imageUrl: string): string {
  if (
    imageUrl.startsWith('http://') ||
    imageUrl.startsWith('https://') ||
    imageUrl.startsWith('data:')
  ) {
    return imageUrl
  }
  const base = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '')
  return `${base}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`
}
