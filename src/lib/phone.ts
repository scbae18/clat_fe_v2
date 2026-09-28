/** 입력 중 숫자만 남기고 010-0000-0000 형태로 붙인다. 최대 11자리. */
export function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length < 4) return digits
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

/** 010 휴대폰을 010-XXXX-XXXX로 맞춘다. 그 외는 null. */
export function normalizeKoreanMobile(raw: string): string | null {
  let digits = raw.replace(/\D/g, '')
  if (digits.length === 10 && digits.startsWith('10')) {
    digits = `0${digits}`
  }
  if (digits.length === 11 && digits.startsWith('010')) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
  }
  return null
}
