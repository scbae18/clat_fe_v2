'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Text from '@/components/common/Text'
import Button from '@/components/common/Button'
import * as styles from './checkEntry.css'

export default function CheckEntryPage() {
  const router = useRouter()
  const [sessionId, setSessionId] = useState('')
  const [studentId, setStudentId] = useState('')

  const go = () => {
    const sid = sessionId.trim()
    const st = studentId.trim()
    if (!sid || !st) return
    router.push(`/check/${sid}?studentId=${encodeURIComponent(st)}`)
  }

  return (
    <div className={styles.page}>
      <Text variant="display" as="h1">
        {'\uD559\uC0DD \uCD9C\uACB0 \uD14C\uC2A4\uD2B8 \uC9C4\uC785'}
      </Text>
      <Text variant="bodyLg" color="gray500" as="p" className={styles.lead}>
        {
          '\uC54C\uB9BC\uD1A1\uC774 \uC5C6\uC744 \uB54C \uCD9C\uACB0 \uC138\uC158 ID\uC640 \uD559\uC0DD ID\uB97C \uC785\uB825\uD558\uC5EC \uD559\uC0DD \uD654\uBA74\uC744 \uC5F4 \uC218 \uC788\uC5B4\uC694. (\uAC1C\uBC1C\uC6A9)'
        }
      </Text>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="sessionId">
          {'\uCD9C\uACB0 \uC138\uC158 ID'}
        </label>
        <input
          id="sessionId"
          className={styles.input}
          inputMode="numeric"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          placeholder="예: 12"
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="studentId">
          {'\uD559\uC0DD ID'}
        </label>
        <input
          id="studentId"
          className={styles.input}
          inputMode="numeric"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="예: 45"
        />
      </div>
      <Button variant="primary" size="md" fullWidth onClick={go}>
        {'\uCD9C\uACB0 \uD654\uBA74 \uC5F4\uAE30'}
      </Button>
    </div>
  )
}
