'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/common/Button'
import Text from '@/components/common/Text'
import useToast from '@/hooks/useToast'
import { splitScoreStorage } from '@/lib/lessonScore'
import type { Attendance, CompletionStatus } from '@/types/lessonStudent'
import {
  alimtalkService,
  pollBatchUntilSettled,
  type AlimtalkDeliveryMode,
  type AlimtalkTestKind,
  type BroadcastNoticeType,
} from '@/services/alimtalk'
import {
  AttendanceCell,
  CompletionCell,
  ScoreEarnedCell,
  TextInputCell,
} from '@/app/(main)/lesson/[id]/_components/LessonTableSection/LessonTableCells'
import { AlimtalkTabs } from '../_components/AlimtalkTabs'
import {
  BROADCAST_NOTICE_LABEL,
  BROADCAST_NOTICE_TYPES,
} from '../broadcast/_lib/broadcastNotice'
import * as baseStyles from '../alimtalkSettings.css'
import * as styles from './test.css'

const KINDS: Array<{ kind: AlimtalkTestKind; label: string }> = [
  { kind: 'LESSON', label: '수업 문자 받아보기' },
  { kind: 'ATTENDANCE', label: '출결 문자 받아보기' },
  { kind: 'BROADCAST', label: '공지 문자 받아보기' },
]

const SCORE_MAX = '100'

export default function AlimtalkTestPage() {
  const { success, error } = useToast()
  const [phone, setPhone] = useState<string | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [limit, setLimit] = useState(5)
  const [deliveryMode, setDeliveryMode] = useState<AlimtalkDeliveryMode>('mock')
  const [panel, setPanel] = useState<AlimtalkTestKind | null>(null)
  const [noticeType, setNoticeType] = useState<BroadcastNoticeType | null>(null)
  const [content, setContent] = useState('')
  const [attendance, setAttendance] = useState<Attendance>(null)
  const [score, setScore] = useState('')
  const [homework, setHomework] = useState<CompletionStatus>(null)
  const [sending, setSending] = useState<AlimtalkTestKind | null>(null)

  useEffect(() => {
    let cancelled = false
    alimtalkService
      .getTestStatus()
      .then((status) => {
        if (cancelled) return
        setPhone(status.phone)
        setRemaining(status.remaining)
        setLimit(status.limit)
        setDeliveryMode(status.delivery_mode)
      })
      .catch(() => {
        if (!cancelled) error('테스트 발송 정보를 불러오지 못했어요.')
      })
    return () => {
      cancelled = true
    }
    // 화면을 열 때 한 번만 불러온다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openPanel = (kind: AlimtalkTestKind) => {
    setPanel(kind)
    if (kind === 'BROADCAST') setNoticeType(null)
  }

  const send = async (kind: AlimtalkTestKind) => {
    if (remaining === 0) {
      error('오늘은 테스트 발송을 5번 모두 썼어요.')
      return
    }
    if (kind === 'BROADCAST' && !noticeType) {
      error('공지 종류를 골라 주세요.')
      return
    }
    setSending(kind)
    try {
      const earned = splitScoreStorage(score).earned.trim()
      const queued = await alimtalkService.sendTest({
        kind,
        notice_type: kind === 'BROADCAST' ? (noticeType ?? undefined) : undefined,
        lesson:
          kind === 'LESSON'
            ? {
                content,
                attendance: attendance ?? undefined,
                score: earned || undefined,
                score_max: earned ? SCORE_MAX : undefined,
                homework: homework ?? undefined,
              }
            : undefined,
      })
      setRemaining(queued.remaining)
      const result = await pollBatchUntilSettled(queued.batch_id, () => {})
      if (result.fail_count > 0) {
        error('테스트 문자를 보내지 못했어요.')
      } else {
        success(deliveryMode === 'mock' ? '모의 전송으로 기록했어요.' : '테스트 문자를 보냈어요.')
      }
    } catch (err) {
      const message =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message ?? '테스트 문자를 보내지 못했어요.'
      error(message)
      const status = await alimtalkService.getTestStatus().catch(() => null)
      if (status) setRemaining(status.remaining)
    } finally {
      setSending(null)
    }
  }

  const blocked = sending != null || remaining === 0 || !phone

  return (
    <div className={baseStyles.pageRoot}>
      <h1 className={baseStyles.pageTitle}>알림톡</h1>
      {deliveryMode === 'mock' ? (
        <div className={baseStyles.deliveryBanner}>
          지금은 모의 모드라 실제 도착하지 않아요.
        </div>
      ) : null}
      <AlimtalkTabs />
      <div className={styles.layout}>
        <div className={styles.stack}>
          <div className={styles.card}>
            <Text variant="titleMd">내 번호로 받아보기</Text>
            <Text variant="bodyMd" color="gray700">
              {phone ? `수신 번호 ${phone}` : '가입한 전화번호가 없어요.'}
            </Text>
            <Text variant="bodyMd" color="gray500">
              {remaining == null
                ? '남은 횟수를 확인하는 중이에요.'
                : `오늘 ${remaining}/${limit}번 남았어요.`}
            </Text>
          </div>
          <div className={styles.actions}>
            {KINDS.map((item) => (
              <Button
                key={item.kind}
                variant={panel === item.kind ? 'primary' : 'outlined'}
                size="md"
                fullWidth
                disabled={blocked}
                onClick={() => openPanel(item.kind)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {panel === 'LESSON' ? (
          <div className={styles.card}>
            <Text variant="titleMd">수업 내용</Text>
            <div className={styles.field}>
              <div className={styles.fieldHead}>
                <p className={styles.fieldLabel}>오늘 학습 내용</p>
                <p className={styles.fieldType}>텍스트형</p>
              </div>
              <TextInputCell value={content} onChange={setContent} />
            </div>
            <div className={styles.field}>
              <p className={styles.fieldLabel}>출결</p>
              <AttendanceCell value={attendance} onChange={setAttendance} />
            </div>
            <div className={styles.field}>
              <div className={styles.fieldHead}>
                <p className={styles.fieldLabel}>단원평가</p>
                <p className={styles.fieldType}>점수형</p>
              </div>
              <ScoreEarnedCell value={score} columnMax={SCORE_MAX} onChange={setScore} />
            </div>
            <div className={styles.field}>
              <div className={styles.fieldHead}>
                <p className={styles.fieldLabel}>과제</p>
                <p className={styles.fieldType}>완료형</p>
              </div>
              <CompletionCell value={homework} onChange={setHomework} />
            </div>
            <Button
              variant="primary"
              size="md"
              disabled={blocked}
              onClick={() => void send('LESSON')}
            >
              {sending === 'LESSON' ? '보내는 중…' : '이 내용으로 받아보기'}
            </Button>
          </div>
        ) : null}

        {panel === 'BROADCAST' ? (
          <div className={styles.card}>
            <Text variant="titleMd">공지 종류</Text>
            <div className={styles.noticeRow}>
              {BROADCAST_NOTICE_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`${styles.noticeChip}${type === noticeType ? ` ${styles.noticeChipActive}` : ''}`}
                  onClick={() => setNoticeType(type)}
                  disabled={sending != null}
                >
                  {BROADCAST_NOTICE_LABEL[type]}
                </button>
              ))}
            </div>
            <Button
              variant="primary"
              size="md"
              disabled={blocked || !noticeType}
              onClick={() => void send('BROADCAST')}
            >
              {sending === 'BROADCAST' ? '보내는 중…' : '이 공지로 받아보기'}
            </Button>
          </div>
        ) : null}

        {panel === 'ATTENDANCE' ? (
          <div className={styles.card}>
            <Text variant="titleMd">출결 문자</Text>
            <Text variant="bodyMd" color="gray700">
              받은 문자에서 출결 코드에 0000을 입력해보세요.
            </Text>
            <Button
              variant="primary"
              size="md"
              disabled={blocked}
              onClick={() => void send('ATTENDANCE')}
            >
              {sending === 'ATTENDANCE' ? '보내는 중…' : '출결 문자 받아보기'}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
