export type BriefingKind =
  | 'LESSON_MISSING'
  | 'LESSON_INPUT'
  | 'LESSON_UNSENT'
  | 'LESSON_SCHEDULED'
  | 'CALENDAR'

export interface BriefingItem {
  kind: BriefingKind
  title: string
  sub: string
  href: string
  action_label: string
  lesson_id?: number
  class_id?: number
  event_id?: number
}

export interface HomeToday {
  date: string
  items: BriefingItem[]
}
