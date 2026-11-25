'use client'

import { useEffect, useRef, useState } from 'react'
import Button from '@/components/common/Button'
import useToast from '@/hooks/useToast'
import {
  alimtalkService,
  kakaoUnavailableToastMessage,
  pollBatchUntilSettled,
  type AlimtalkDeliveryMode,
  type AlimtalkTestKind,
  type BroadcastNoticeType,
} from '@/services/alimtalk'
import { AlimtalkTabs } from '../_components/AlimtalkTabs'
import LessonTestTable, { type LessonTestValue } from './LessonTestTable'
import {
  BROADCAST_CHAR_LIMIT,
  BROADCAST_NOTICE_HINT,
  BROADCAST_NOTICE_LABEL,
  BROADCAST_NOTICE_TYPES,
} from '../broadcast/_lib/broadcastNotice'
import * as noticeStyles from '../broadcast/broadcast.css'
import * as baseStyles from '../alimtalkSettings.css'
import * as styles from './test.css'

const KINDS: Array<{ kind: AlimtalkTestKind; label: string }> = [
  { kind: 'LESSON', label: '수업 문자 받아보기' },
  { kind: 'ATTENDANCE', label: '출결 문자 받아보기' },
  { kind: 'BROADCAST', label: '공지 문자 받아보기' },
]

export default function AlimtalkTestPage() {
  const { success, error, warning } = useToast()
  const [phone, setPhone] = useState<string | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [limit, setLimit] = useState(5)
  const [deliveryMode, setDeliveryMode] = useState<AlimtalkDeliveryMode>('mock')
  const [panel, setPanel] = useState<AlimtalkTestKind>('LESSON')
  const [noticeType, setNoticeType] = useState<BroadcastNoticeType>('MAKEUP')
  const [noticeBody, setNoticeBody] = useState('')
  const [sending, setSending] = useState<AlimtalkTestKind | null>(null)
  const lessonRef = useRef<LessonTestValue>({
    content: '',
    attendance: null,
    score: '',
    scoreMax: '',
    homework: null,
  })

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
      const lesson = lessonRef.current
      const earned = lesson.score.trim()
      const scoreMax = lesson.scoreMax.trim()
      const queued = await alimtalkService.sendTest({
        kind,
        notice_type: kind === 'BROADCAST' ? noticeType : undefined,
        lesson:
          kind === 'LESSON'
            ? {
                content: lesson.content,
                attendance: lesson.attendance ?? undefined,
                score: earned || undefined,
                score_max: earned && scoreMax ? scoreMax : undefined,
                homework: lesson.homework ?? undefined,
              }
            : undefined,
      })
      setRemaining(queued.remaining)
      const result = await pollBatchUntilSettled(queued.batch_id, () => {})
      const kakaoNotice = kakaoUnavailableToastMessage(result)
      if (kakaoNotice) warning(kakaoNotice, 8000)
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
  const noticeCount = Array.from(noticeBody).length

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
        <div className={styles.menu}>
          <div className={styles.infoCard} data-tour="alimtalk-test-phone">
            <h2 className={styles.infoTitle}>알림톡 테스트</h2>
            <p className={styles.infoPhone}>
              {phone ? `수신 번호 ${phone}` : '수신 번호 없음'}
            </p>
            <p className={styles.infoRemain}>
              {remaining == null
                ? '오늘 남은 테스트를 확인하는 중이에요.'
                : `오늘 남은 테스트 ${remaining} / ${limit}회`}
            </p>
          </div>
          <div className={styles.menuList} data-tour="alimtalk-test-kinds">
            {KINDS.map((item) => (
              <button
                key={item.kind}
                type="button"
                className={`${styles.menuButton}${panel === item.kind ? ` ${styles.menuButtonActive}` : ''}`}
                aria-pressed={panel === item.kind}
                onClick={() => openPanel(item.kind)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {panel === 'LESSON' ? (
          <section className={styles.detail} aria-label="수업 문자 내용">
            <div>
              <h2 className={styles.detailTitle}>수업 문자 내용</h2>
              <p className={styles.detailHint}>
                입력한 내용으로 테스트 문자를 보내요. 비워 두면 예시 문구로 채워져요.
              </p>
            </div>
            <LessonTestTable onChange={(value) => { lessonRef.current = value }} />
            <Button variant="primary" size="md" fullWidth disabled={blocked} onClick={() => void send('LESSON')}>
              {sending === 'LESSON' ? '보내는 중…' : '이 내용으로 받아보기'}
            </Button>
          </section>
        ) : null}

        {panel === 'ATTENDANCE' ? (
          <section className={styles.detail} aria-label="출결 문자">
            <div>
              <h2 className={styles.detailTitle}>출결 문자</h2>
              <p className={styles.detailHint}>받은 문자의 링크에서 출결 코드를 입력해 보세요.</p>
            </div>
            <div className={styles.codeBox}>
              <p className={styles.codeLabel}>테스트 출결 코드</p>
              <p className={styles.codeValue}>0000</p>
            </div>
            <Button
              variant="primary"
              size="md"
              fullWidth
              disabled={blocked}
              onClick={() => void send('ATTENDANCE')}
            >
              {sending === 'ATTENDANCE' ? '보내는 중…' : '출결 문자 받아보기'}
            </Button>
          </section>
        ) : null}

        {panel === 'BROADCAST' ? (
          <section className={styles.detail} aria-label="공지 문자">
            <div className={styles.noticeBlock}>
              <h2 className={styles.detailTitle}>공지 종류</h2>
              <div className={noticeStyles.typeGrid} role="radiogroup" aria-label="공지 종류">
                {BROADCAST_NOTICE_TYPES.map((type) => {
                  const active = noticeType === type
                  return (
                    <button
                      key={type}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      className={`${noticeStyles.typeCard}${active ? ` ${noticeStyles.typeCardActive}` : ''}`}
                      onClick={() => setNoticeType(type)}
                    >
                      <span
                        className={`${noticeStyles.typeCardTitle}${active ? ` ${noticeStyles.typeCardTitleActive}` : ''}`}
                      >
                        {BROADCAST_NOTICE_LABEL[type]}
                      </span>
                      <span className={noticeStyles.typeCardHint}>{BROADCAST_NOTICE_HINT[type]}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className={styles.noticeBlock}>
              <h2 className={styles.detailTitle}>안내 사항</h2>
              <div className={styles.noticeBox}>
                <textarea
                  className={styles.noticeArea}
                  value={noticeBody}
                  onChange={(event) => setNoticeBody(event.target.value)}
                  placeholder="예: 내일 13시, 3층 강의실에서 보강합니다."
                  aria-label="안내 사항"
                />
                <p
                  className={
                    noticeCount > BROADCAST_CHAR_LIMIT
                      ? noticeStyles.bodyCountOver
                      : noticeStyles.bodyCount
                  }
                >
                  {`${noticeCount.toLocaleString('ko-KR')} / 1,000자`}
                </p>
              </div>
            </div>
            <Button variant="primary" size="md" fullWidth disabled={blocked} onClick={() => void send('BROADCAST')}>
              {sending === 'BROADCAST' ? '보내는 중…' : '이 공지로 받아보기'}
            </Button>
          </section>
        ) : null}
      </div>
    </div>
  )
}
