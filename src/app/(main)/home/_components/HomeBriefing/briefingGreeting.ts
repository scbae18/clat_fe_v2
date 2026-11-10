const PLAIN = '안녕하세요, 선생님!'

function kstParts(now: Date): { date: string; hour: number } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ''
  return {
    date: `${value('year')}-${value('month')}-${value('day')}`,
    hour: Number(value('hour')),
  }
}

export function briefingGreeting(now = new Date()): string {
  const { date, hour } = kstParts(now)
  const pool = [PLAIN]
  if (hour >= 5 && hour <= 11) pool.push('안녕하세요, 선생님! 좋은 아침입니다')
  else if (hour >= 12 && hour <= 17) pool.push('안녕하세요, 선생님! 좋은 오후입니다')
  else pool.push('안녕하세요, 선생님! 좋은 저녁입니다')
  const index = [...date].reduce((sum, char) => sum + char.charCodeAt(0), 0) % pool.length
  return pool[index]
}
