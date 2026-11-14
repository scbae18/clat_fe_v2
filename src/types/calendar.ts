export interface CalendarEventStudent {
  student_id: number
  student_name: string
}

export interface CalendarEventClass {
  class_id: number
  class_name: string
}

export interface CalendarEvent {
  id: number
  event_date: string
  body: string
  done: boolean
  audience: string
  classes: CalendarEventClass[]
  students: CalendarEventStudent[]
}
