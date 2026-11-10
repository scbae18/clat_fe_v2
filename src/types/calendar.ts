export interface CalendarEventStudent {
  student_id: number
  student_name: string
}

export interface CalendarEvent {
  id: number
  event_date: string
  body: string
  students: CalendarEventStudent[]
}
