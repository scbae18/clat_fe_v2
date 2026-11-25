'use client'

import Image from 'next/image'
import clatIcon from '@/assets/images/clat-alimtalk-icon.png'
import Text from '@/components/common/Text'
import {
  LESSON_ALIMTALK_CTA_LABEL,
  LESSON_ALIMTALK_FRAME_FOOTER,
  stripParentDashboardPreviewLine,
} from '@/lib/lessonAlimtalkFrame'
import type { LessonPreviewRow } from '@/services/lesson'
import { listParentPhones } from '@/lib/parentPhones'
import * as styles from './AlimtalkSendModal.css'

function hasPhone(value: string | null | undefined) {
  return Boolean(value && String(value).replace(/\D/g, '').length >= 8)
}

function previewClock(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h12',
  }).formatToParts(date)
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ''
  const period = read('dayPeriod').toUpperCase() === 'AM' ? '오전' : '오후'
  return `${period} ${read('hour')}:${read('minute')}`
}

function KakaoPreview({
  audience,
  header,
  body,
  missingMessage,
  clock,
}: {
  audience: '학부모용' | '학생용'
  header: string
  body: string
  missingMessage: string | null
  clock: string
}) {
  return (
    <div className={styles.kakaoCard}>
      <div className={styles.kakaoShell}>
        <div className={styles.kakaoLogoRow}>
          <Image src={clatIcon} alt="" width={36} height={36} className={styles.kakaoLogo} />
          <span className={styles.kakaoAppLabel}>{`클랫 수업 알림 (${audience})`}</span>
        </div>
        <div className={styles.kakaoBubbleRow}>
          <div className={styles.kakaoBubble}>
            <div className={styles.kakaoArrive}>알림톡 도착</div>
            <div className={styles.kakaoBody}>
              {missingMessage ? (
                <p className={styles.kakaoMessage}>{missingMessage}</p>
              ) : (
                <>
                  <p className={styles.kakaoMessage}>{header}</p>
                  <p className={styles.kakaoMessage}>{body.trim() ? body : '—'}</p>
                  <p className={styles.kakaoMessage}>{LESSON_ALIMTALK_FRAME_FOOTER}</p>
                  <div className={styles.kakaoCta}>{LESSON_ALIMTALK_CTA_LABEL}</div>
                </>
              )}
            </div>
          </div>
          <p className={styles.kakaoTime}>{clock}</p>
        </div>
      </div>
    </div>
  )
}

interface AlimtalkMessagePreviewProps {
  focused: LessonPreviewRow | undefined
  frameHeader: string
  sendToParent: boolean
  sendToStudent: boolean
}

export default function AlimtalkMessagePreview({
  focused,
  frameHeader,
  sendToParent,
  sendToStudent,
}: AlimtalkMessagePreviewProps) {
  if (!focused) {
    return (
      <Text variant="bodyMd" color="gray500">
        왼쪽에서 학생을 선택하면 미리보기가 표시돼요.
      </Text>
    )
  }

  const clock = previewClock()
  const parentReady = listParentPhones(focused).some((phone) => hasPhone(phone))
  const studentReady = hasPhone(focused.phone)

  return (
    <div className={styles.previewStack}>
      {sendToParent ? (
        <KakaoPreview
          audience="학부모용"
          header={frameHeader}
          body={stripParentDashboardPreviewLine(focused.message_for_parent || '')}
          missingMessage={parentReady ? null : '학부모 연락처가 없어 이 채널로는 발송되지 않아요.'}
          clock={clock}
        />
      ) : null}
      {sendToStudent ? (
        <KakaoPreview
          audience="학생용"
          header={frameHeader}
          body={focused.message || ''}
          missingMessage={studentReady ? null : '학생 연락처가 없어 이 채널로는 발송되지 않아요.'}
          clock={clock}
        />
      ) : null}
      {!sendToParent && !sendToStudent ? (
        <Text variant="bodyMd" color="gray500">
          학부모 또는 학생 중 받을 대상을 골라 주세요.
        </Text>
      ) : null}
    </div>
  )
}
