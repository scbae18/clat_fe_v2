'use client'

import { useEffect, useRef, useState } from 'react'
import * as styles from '../studentDashboard.css'
import { MSG } from '../_lib/studentDashboardShared'

type StudentMemoCardProps = {
  memo: string
  onSave: (memo: string) => Promise<void>
}

export function StudentMemoCard({ memo, onSave }: StudentMemoCardProps) {
  const [value, setValue] = useState(memo)
  const [status, setStatus] = useState('')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setValue(memo)
  }, [memo])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const scheduleSave = (next: string) => {
    setValue(next)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      void (async () => {
        try {
          await onSave(next)
          setStatus(MSG.memoSaved)
        } catch {
          setStatus(MSG.memoSaveFail)
        }
      })()
    }, 800)
  }

  return (
    <section className={styles.memoCard}>
      <div>
        <h2 className={styles.memoTitle}>{MSG.memoTitle}</h2>
        <p className={styles.memoHint}>{status || MSG.memoHint}</p>
      </div>
      <textarea
        className={styles.memoTextarea}
        value={value}
        placeholder={MSG.memoPlaceholder}
        onChange={(e) => scheduleSave(e.target.value)}
      />
    </section>
  )
}
