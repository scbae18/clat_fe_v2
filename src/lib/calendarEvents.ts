export const CALENDAR_EVENTS_CHANGED = 'clat-calendar-events'

export function notifyCalendarEventsChanged() {
  window.dispatchEvent(new Event(CALENDAR_EVENTS_CHANGED))
}

export function sortCalendarEvents<T extends { id: number; done?: boolean }>(events: T[]): T[] {
  return [...events].sort(
    (a, b) => Number(a.done === true) - Number(b.done === true) || a.id - b.id,
  )
}
