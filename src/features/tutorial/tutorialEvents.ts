export type TutorialAction =
  | 'template-save'
  | 'ai-save'
  | 'attendance-start'
  | 'lesson-attend'
  | 'alimtalk-send'
  | 'parent-open'

type TutorialActionHandler = (action: TutorialAction, studentId?: number) => boolean

let handler: TutorialActionHandler | null = null

export function setTutorialActionHandler(next: TutorialActionHandler | null) {
  handler = next
}

/** 투어가 이 동작을 받으면 true. 받으면 기존 화면 이동은 하지 않는다. */
export function reportTutorialAction(action: TutorialAction, studentId?: number): boolean {
  return handler?.(action, studentId) ?? false
}
