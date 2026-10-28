export type TutorialAction =
  | 'student-open'
  | 'common-added'
  | 'individual-added'
  | 'template-save'
  | 'ai-save'
  | 'lesson-create'
  | 'attendance-opened'
  | 'attendance-ended'
  | 'common-filled'
  | 'lesson-input'
  | 'feedback-ready'
  | 'alimtalk-send'

const gates = new Map<string, boolean>()
const gateListeners = new Set<() => void>()

export function setTutorialGate(name: string, open: boolean) {
  if (gates.get(name) === open) return
  gates.set(name, open)
  gateListeners.forEach((listener) => listener())
}

export function subscribeTutorialGate(listener: () => void) {
  gateListeners.add(listener)
  return () => {
    gateListeners.delete(listener)
  }
}

export function isTutorialGateOpen(name: string) {
  return gates.get(name) === true
}

export interface TutorialActionExtra {
  studentId?: number
  lessonId?: number
}

type TutorialActionHandler = (action: TutorialAction, extra?: TutorialActionExtra) => boolean

let handler: TutorialActionHandler | null = null

export function setTutorialActionHandler(next: TutorialActionHandler | null) {
  handler = next
}

/** 투어가 이 동작을 받으면 true. 받으면 템플릿 저장 뒤 목록으로 가지 않는다. */
export function reportTutorialAction(action: TutorialAction, extra?: TutorialActionExtra): boolean {
  return handler?.(action, extra) ?? false
}
