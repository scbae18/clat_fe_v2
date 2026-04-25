'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import bannerIllust from '@/assets/images/banner-illust.png'
import LogoBetaIcon from '@/assets/logo/logo-beta.svg'
import EditIcon from '@/assets/icons/icon-edit.svg'
import ClipboardIcon from '@/assets/icons/icon-clipboard.svg'
import UsersIcon from '@/assets/icons/icon-users.svg'
import StarIcon from '@/assets/icons/icon-star.svg'
import { useUserStore } from '@/stores/userStore'
import type { LessonSummary } from '@/services/lesson'
import type { Student } from '@/types/student'
import * as styles from './HomeHero.css'

type IconComp = typeof EditIcon

interface HomeHeroProps {
  todayLessons: LessonSummary[] | null
  students: Student[] | null
  riskHighCount: number
  todayDate: string
}

function formatGreetingDate(yyyymmdd: string): string {
  const d = new Date(yyyymmdd)
  const month = d.getMonth() + 1
  const day = d.getDate()
  const dow = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()]
  return `${month}월 ${day}일 ${dow}요일`
}

function greetingByHour(): string {
  const hour = new Date().getHours()
  if (hour < 5) return '늦은 시간까지 고생 많으세요,'
  if (hour < 12) return '좋은 아침이에요,'
  if (hour < 18) return '오후도 잘 부탁드려요,'
  return '오늘도 수고 많으셨어요,'
}

function scrollToId(id: string) {
  if (typeof document === 'undefined') return
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

interface StatChipDef {
  key: string
  icon: IconComp
  label: string
  value: number | null
  unit: string
  tone: 'default' | 'accent' | 'danger' | 'primary'
  onClick: () => void
}

export default function HomeHero({
  todayLessons,
  students,
  riskHighCount,
  todayDate,
}: HomeHeroProps) {
  const router = useRouter()
  const userName = useUserStore((s) => s.user?.name) ?? '선생님'

  const todayLessonsCount = todayLessons?.length ?? null
  const pendingLessonsCount =
    todayLessons === null
      ? null
      : todayLessons.filter((l) => l.lesson_record_id === null).length
  const incompleteStudentsCount =
    students === null ? null : students.filter((s) => s.total_incomplete_items > 0).length

  const stats: StatChipDef[] = [
    {
      key: 'today-lessons',
      icon: EditIcon,
      label: '오늘 수업',
      value: todayLessonsCount,
      unit: '건',
      tone: 'primary',
      onClick: () => scrollToId('home-today-lessons'),
    },
    {
      key: 'pending-lessons',
      icon: ClipboardIcon,
      label: '입력 대기',
      value: pendingLessonsCount,
      unit: '건',
      tone: 'accent',
      onClick: () => scrollToId('home-today-lessons'),
    },
    {
      key: 'incomplete-students',
      icon: UsersIcon,
      label: '미완료 학생',
      value: incompleteStudentsCount,
      unit: '명',
      tone: 'danger',
      onClick: () => scrollToId('home-attention-students'),
    },
    {
      key: 'risk-students',
      icon: StarIcon,
      label: '위험 학생',
      value: riskHighCount,
      unit: '명',
      tone: 'primary',
      onClick: () => router.push('/ai'),
    },
  ]

  function chipToneClass(tone: StatChipDef['tone']) {
    if (tone === 'accent') return styles.statChipAccent
    if (tone === 'danger') return styles.statChipDanger
    if (tone === 'primary') return styles.statChipPrimary
    return ''
  }

  return (
    <section className={styles.banner}>
      <div className={styles.bannerContent}>
        <div className={styles.logoWrap}>
          <LogoBetaIcon className={styles.logoSvg} />
        </div>
        <div>
          <div className={styles.greetingSm}>{greetingByHour()}</div>
          <div className={styles.greetingLg}>
            <span className={styles.greetingHighlight}>{userName}쌤</span>, 오늘은{' '}
            {formatGreetingDate(todayDate)}이에요
          </div>
        </div>

        <div className={styles.statsRow}>
          {stats.map((s) => {
            const IconComp = s.icon
            return (
              <button
                key={s.key}
                type="button"
                className={`${styles.statChip} ${chipToneClass(s.tone)}`}
                onClick={s.onClick}
              >
                <IconComp width={16} height={16} />
                <span className={styles.statLabel}>{s.label}</span>
                {s.value === null ? (
                  <span className={styles.statValueLoading}>···</span>
                ) : (
                  <span className={styles.statValue}>
                    {s.value}
                    {s.unit}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className={styles.illustWrap}>
        <Image src={bannerIllust} alt="" height={300} priority />
      </div>
    </section>
  )
}
