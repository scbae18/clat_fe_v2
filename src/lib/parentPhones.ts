export function listParentPhones(source: {
  parent_phone?: string | null
  parent_phone_2?: string | null
}): string[] {
  const out: string[] = []
  for (const raw of [source.parent_phone, source.parent_phone_2]) {
    const phone = (raw ?? '').trim()
    if (!phone || out.includes(phone)) continue
    out.push(phone)
  }
  return out
}
