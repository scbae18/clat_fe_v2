'use client'

import { useRouter } from 'next/navigation'
import EditIcon from '@/assets/icons/icon-edit.svg'
import UsersIcon from '@/assets/icons/icon-users.svg'
import ClipboardIcon from '@/assets/icons/icon-clipboard.svg'
import MessageIcon from '@/assets/icons/icon-message.svg'
import FlagIcon from '@/assets/icons/icon-flag.svg'
import * as styles from './QuickActions.css'

type IconComp = typeof EditIcon

interface ActionDef {
  key: string
  icon: IconComp
  title: string
  desc: string
  href: string
  toneClass?: string
}

export default function QuickActions() {
  const router = useRouter()

  const actions: ActionDef[] = [
    {
      key: 'lesson',
      icon: EditIcon,
      title: '수업 입력',
      desc: '오늘 수업을 기록해요',
      href: '/lesson',
    },
    {
      key: 'students',
      icon: UsersIcon,
      title: '학생·반 관리',
      desc: '학생을 추가하거나 정리해요',
      href: '/management',
      toneClass: styles.iconWrapSecondary,
    },
    {
      key: 'template',
      icon: ClipboardIcon,
      title: '수업 템플릿',
      desc: '수업 항목을 구성해요',
      href: '/template',
      toneClass: styles.iconWrapAccent,
    },
    {
      key: 'alimtalk',
      icon: MessageIcon,
      title: '알림톡 발송 내역',
      desc: '발송 결과를 확인해요',
      href: '/alimtalk',
      toneClass: styles.iconWrapDanger,
    },
  ]

  return (
    <section className={styles.wrapper}>
      <div className={styles.titleGroup}>
        <FlagIcon width={20} height={20} />
        <span className={styles.titleText}>빠른 액션</span>
      </div>
      <div className={styles.grid}>
        {actions.map((a) => {
          const IconComp = a.icon
          return (
            <button
              key={a.key}
              type="button"
              className={styles.card}
              onClick={() => router.push(a.href)}
            >
              <span className={`${styles.iconWrap} ${a.toneClass ?? ''}`}>
                <IconComp width={22} height={22} />
              </span>
              <span className={styles.textWrap}>
                <span className={styles.cardTitle}>{a.title}</span>
                <span className={styles.cardDesc}>{a.desc}</span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
