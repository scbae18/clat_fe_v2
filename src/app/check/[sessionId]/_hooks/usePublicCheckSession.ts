import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { attendanceService } from '@/services/attendance'

import {
  applyPublicSessionToState,
  type CheckBlockedState,
  type CheckDoneState,
} from '../_lib/checkShared'
import { useCountdown } from './useCountdown'

export function usePublicCheckSession(sessionId: number) {
  const search = useSearchParams()
  const studentIdRaw = search.get('studentId')
  const studentId = studentIdRaw ? Number(studentIdRaw) : NaN

  const inputRef = useRef<HTMLInputElement>(null)

  const [className, setClassName] = useState('')
  const [expiresAt, setExpiresAt] = useState<string | null>(null)
  const [studentName, setStudentName] = useState<string | null>(null)
  const [blocked, setBlocked] = useState<CheckBlockedState | null>(null)
  const [loadErr, setLoadErr] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [submitErr, setSubmitErr] = useState<string | null>(null)
  const [done, setDone] = useState<CheckDoneState | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const remain = useCountdown(expiresAt)

  useEffect(() => {
    if (!Number.isFinite(sessionId) || !Number.isFinite(studentId)) return
    let cancelled = false
    attendanceService
      .getPublicCheckSession(sessionId, studentId)
      .then((r) => {
        if (cancelled) return
        applyPublicSessionToState(r, {
          setDone,
          setBlocked,
          setClassName,
          setExpiresAt,
          setStudentName,
        })
      })
      .catch(() => {
        if (!cancelled) {
          setLoadErr('세션 정보를 불러올 수 없어요. 코드를 입력해 주세요.')
        }
      })
    return () => {
      cancelled = true
    }
  }, [sessionId, studentId])

  /** 서버에서 만료·종료 반영 후 화면을 맞춤 (타이머 0 또는 세션 상태 변경) */
  useEffect(() => {
    if (!Number.isFinite(sessionId) || !Number.isFinite(studentId)) return
    if (blocked != null || done != null || loadErr != null) return
    if (!expiresAt) return
    if (remain > 0) return
    let cancelled = false
    attendanceService
      .getPublicCheckSession(sessionId, studentId)
      .then((r) => {
        if (cancelled) return
        applyPublicSessionToState(r, {
          setDone,
          setBlocked,
          setClassName,
          setExpiresAt,
          setStudentName,
        })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [sessionId, studentId, remain, expiresAt, blocked, done, loadErr])

  useEffect(() => {
    if (!Number.isFinite(sessionId) || !Number.isFinite(studentId)) return
    if (blocked || done) return
    const t = window.setTimeout(() => inputRef.current?.focus(), 400)
    return () => clearTimeout(t)
  }, [sessionId, studentId, blocked, done])

  const onCodeInput = useCallback((raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 4)
    setCode(digits)
    setSubmitErr(null)
  }, [])

  const onConfirm = async () => {
    if (code.length !== 4) {
      setSubmitErr('4자리 코드를 입력해 주세요.')
      return
    }
    setSubmitting(true)
    setSubmitErr(null)
    try {
      const res = await attendanceService.submitPublicCheckCode(sessionId, studentId, code)
      setDone({
        status: res.status,
        class_name: res.class_name,
        lesson_date: res.lesson_date,
      })
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message ??
        ((e as { response?: { status?: number } })?.response?.status === 404
          ? '출결 체크 API가 아직 없어요. 서버 구현을 확인해 주세요.'
          : '코드가 올바르지 않아요')
      setSubmitErr(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return {
    studentId,
    inputRef,
    className,
    studentName,
    blocked,
    loadErr,
    code,
    submitErr,
    done,
    submitting,
    remain,
    onCodeInput,
    onConfirm,
  }
}
