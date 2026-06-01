/** 수업 목록(알림톡 배지 등) 갱신이 필요할 때 sessionStorage 플래그 */
export const LESSON_LIST_REFRESH_KEY = 'clat:lesson-list-needs-refresh'

export function markLessonListNeedsRefresh(): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(LESSON_LIST_REFRESH_KEY, '1')
}

export function consumeLessonListNeedsRefresh(): boolean {
  if (typeof window === 'undefined') return false
  if (sessionStorage.getItem(LESSON_LIST_REFRESH_KEY) !== '1') return false
  sessionStorage.removeItem(LESSON_LIST_REFRESH_KEY)
  return true
}
