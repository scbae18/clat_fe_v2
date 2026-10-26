'use client'

import { useEffect, useRef, useState } from 'react'
import { CheckCodeForm } from '../[sessionId]/_components/CheckCodeForm'
import { CheckSuccessView } from '../[sessionId]/_components/CheckSuccessView'

export default function CheckDemoPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [code, setCode] = useState('')
  const [remain, setRemain] = useState(600)
  const [submitErr, setSubmitErr] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemain((value) => (value > 0 ? value - 1 : 0))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  if (done) {
    return (
      <CheckSuccessView
        done={{ status: 'PRESENT', class_name: '샘플반', lesson_date: new Date().toISOString() }}
        fallbackClassName="샘플반"
      />
    )
  }

  return (
    <CheckCodeForm
      inputRef={inputRef}
      className="샘플반"
      studentName="홍길동"
      loadErr={null}
      code={code}
      remain={remain}
      submitErr={submitErr}
      submitting={false}
      onCodeInput={(raw) => {
        setSubmitErr(null)
        setCode(raw.replace(/\D/g, '').slice(0, 4))
      }}
      onConfirm={() => {
        if (code === '0000') {
          setDone(true)
          return
        }
        setSubmitErr('코드가 맞지 않아요. 샘플은 0000이에요.')
      }}
    />
  )
}
