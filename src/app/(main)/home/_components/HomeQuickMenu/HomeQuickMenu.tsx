'use client'

import Image from 'next/image'
import Link from 'next/link'
import ChevronRight from '@/assets/icons/icon-chevron-right.svg'
import writingIcon from '@/assets/images/quick-menu/writing.png'
import sendIcon from '@/assets/images/quick-menu/send.png'
import kakaoTalkIcon from '@/assets/images/quick-menu/kakao-talk.png'
import personIcon from '@/assets/images/quick-menu/person.png'
import { useHomeQuickMenu } from '../../_hooks/useHomeQuickMenu'
import * as styles from './HomeQuickMenu.css'

const BROADCAST_HINT = '수업보강 / 수업시간 / 수업 전 준비사항 / 수업진도'

function formatCount(value: number | null): string {
  if (value == null) return '–'
  return String(value)
}

export default function HomeQuickMenu() {
  const { stats, isLoading } = useHomeQuickMenu()

  const unentered = isLoading ? null : stats.unenteredClassCount
  const monthSend = isLoading ? null : stats.monthSendCount
  const incomplete = isLoading ? null : stats.incompleteStudentCount

  return (
    <div className={styles.wrap}>
      <nav aria-label="빠른 메뉴" className={styles.grid}>
      <Link href="/lesson" className={styles.card({ tone: 'lesson' })}>
        <span className={styles.iconWriting}>
          <Image
            src={writingIcon}
            alt=""
            width={36}
            height={36}
            className={styles.iconImgCover}
          />
        </span>
        <span className={styles.titleRow}>
          <span className={styles.title}>수업 입력하기</span>
          <span className={styles.chevron}>
            <ChevronRight width={20} height={20} aria-hidden />
          </span>
        </span>
        <span className={styles.footer}>
          <span className={styles.statRow}>
            <span className={styles.statLabel}>미입력 반</span>
            <span className={styles.statValue}>
              <span className={styles.statNumber}>{formatCount(unentered)}</span>
              <span className={styles.statUnit}>개</span>
            </span>
          </span>
          <span className={styles.progressTrack({ tone: 'lesson' })}>
            <span
              className={styles.progressFill({ tone: 'lesson' })}
              style={{ width: `${stats.lessonProgress}%` }}
            />
          </span>
        </span>
      </Link>

      <Link href="/alimtalk/broadcast" className={styles.card({ tone: 'broadcast' })}>
        <span className={styles.iconSend}>
          <Image
            src={sendIcon}
            alt=""
            width={36}
            height={36}
            className={styles.iconImgCover}
          />
        </span>
        <span className={styles.titleRow}>
          <span className={styles.title}>전체공지 발송하기</span>
          <span className={styles.chevron}>
            <ChevronRight width={20} height={20} aria-hidden />
          </span>
        </span>
        <span className={styles.footer}>
          <span className={styles.hint}>{BROADCAST_HINT}</span>
        </span>
      </Link>

      <Link href="/alimtalk/history" className={styles.card({ tone: 'history' })}>
        <span className={styles.iconKakao}>
          <Image
            src={kakaoTalkIcon}
            alt=""
            width={48}
            height={48}
            className={styles.iconImgKakao}
          />
        </span>
        <span className={styles.titleRow}>
          <span className={styles.title}>알림톡 발송 내역보기</span>
          <span className={styles.chevron}>
            <ChevronRight width={20} height={20} aria-hidden />
          </span>
        </span>
        <span className={styles.footer}>
          <span className={styles.statRow}>
            <span className={styles.statLabel}>이번달 발송 수</span>
            <span className={styles.statValue}>
              <span className={styles.statNumber}>{formatCount(monthSend)}</span>
              <span className={styles.statUnit}>개</span>
            </span>
          </span>
        </span>
      </Link>

      <Link href="/management?tab=students" className={styles.card({ tone: 'students' })}>
        <span className={styles.iconPerson}>
          <Image
            src={personIcon}
            alt=""
            width={43}
            height={37}
            className={styles.iconImgPerson}
          />
        </span>
        <span className={styles.titleRow}>
          <span className={styles.title}>학생 관리하기</span>
          <span className={styles.chevron}>
            <ChevronRight width={20} height={20} aria-hidden />
          </span>
        </span>
        <span className={styles.footer}>
          <span className={styles.statRow}>
            <span className={styles.statLabel}>미완료 학생</span>
            <span className={styles.statValue}>
              <span className={styles.statNumber}>{formatCount(incomplete)}</span>
              <span className={styles.statUnit}>명</span>
            </span>
          </span>
          <span className={styles.progressTrack({ tone: 'students' })}>
            <span
              className={styles.progressFill({ tone: 'students' })}
              style={{ width: `${stats.studentProgress}%` }}
            />
          </span>
        </span>
      </Link>
      </nav>
    </div>
  )
}
