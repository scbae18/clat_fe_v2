'use client'

import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef, useState, type Ref } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useUserStore } from '@/stores/userStore'
import { useUiStore } from '@/stores/uiStore'
import { useLogout } from '@/hooks/useLogout'
import { queryKeys } from '@/lib/queryKeys'
import { lessonService, type LessonSendScheduleCard } from '@/services/lesson'
import { alimtalkService, type BroadcastSchedule } from '@/services/alimtalk'
import { BROADCAST_NOTICE_LABEL } from '@/app/(main)/alimtalk/broadcast/_lib/broadcastNotice'
import {
  sidebarStyle,
  sidebarTopStyle,
  toggleButtonStyle,
  navStyle,
  navFixedStyle,
  navItemStyle,
  navItemActiveStyle,
  navLabelStyle,
  logoutButtonStyle,
  sidebarBottomStyle,
  sidebarBottomScrollStyle,
  scheduleStackStyle,
  scheduleCardStyle,
  scheduleTimeStyle,
  scheduleBadgeStyle,
  scheduleClassStyle,
  scheduleDateStyle,
  scheduleMoreStyle,
  scheduleLineButton,
  scheduleListHeading,
  scheduleListStack,
  scheduleListItem,
  scheduleListTime,
  scheduleListBadge,
  scheduleListName,
  scheduleListMeta,
  scheduleActionPopover,
  scheduleActionStack,
  scheduleDetailStyle,
  userCardStyle,
  userCardActiveStyle,
  userAvatarStyle,
  userTextWrapStyle,
  userNameStyle,
  userEmailStyle,
} from './Sidebar.css'
import ConfirmModal from '@/components/common/ConfirmModal'
import ScheduleActionPopover, { type ScheduleActionTarget } from './ScheduleActionPopover'
import SidebarUsage from '@/components/billing/SidebarUsage'
import HomeIcon from '@/assets/icons/icon-home.svg'
import EditIcon from '@/assets/icons/icon-edit.svg'
import UsersIcon from '@/assets/icons/icon-users.svg'
import ClipboardIcon from '@/assets/icons/icon-clipboard.svg'
import MessageIcon from '@/assets/icons/icon-message.svg'
import StarIcon from '@/assets/icons/icon-star.svg'
import LogoIcon from '@/assets/logo/logo-symbol.svg'
import LogoutIcon from '@/assets/icons/icon-logout.svg'
import ChevronLeftIcon from '@/assets/icons/icon-chevron-left.svg'
import ChevronRightIcon from '@/assets/icons/icon-chevron-right.svg'

const NAV_ITEMS = [
  { href: '/home', label: '\uD648', icon: HomeIcon },
  { href: '/lesson', label: '\uC218\uC5C5 \uC785\uB825', icon: EditIcon },
  { href: '/management', label: '\uD559\uC0DD\u00B7\uBC18 \uAD00\uB9AC', icon: UsersIcon },
  { href: '/template', label: '\uC218\uC5C5 \uD15C\uD50C\uB9BF', icon: ClipboardIcon },
  { href: '/alimtalk', label: '\uC54C\uB9BC\uD1A1', icon: MessageIcon },
  { href: '/ai', label: 'AI \uC870\uAD50', icon: StarIcon },
]

function seoulClock(iso: string): { month: string; day: string; hour: string; minute: string } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(iso))
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ''
  const hour = read('hour') === '24' ? '00' : read('hour')
  return { month: read('month'), day: read('day'), hour, minute: read('minute') }
}

function lessonDayLabel(lessonDate: string): string {
  const [, month, day] = lessonDate.split('-')
  return `${Number(month)}월 ${Number(day)}일 수업`
}

interface ScheduleCard {
  key: string
  scheduled_at: string
  badge: string
  title: string
  subtitle: string
  student_count: number
  kind: 'lesson' | 'broadcast'
  lesson_record_id?: number
  lesson_date?: string
  template_name?: string
  schedule_id?: number
  body?: string
}

function lessonCard(item: LessonSendScheduleCard): ScheduleCard {
  return {
    key: `lesson-${item.lesson_record_id}`,
    scheduled_at: item.scheduled_at,
    badge: '알림톡 발송 예약',
    title: item.class_name,
    subtitle: lessonDayLabel(item.lesson_date),
    student_count: item.student_count,
    kind: 'lesson',
    lesson_record_id: item.lesson_record_id,
    lesson_date: item.lesson_date,
    template_name: item.template_name,
  }
}

function broadcastCard(item: BroadcastSchedule): ScheduleCard {
  const clock = seoulClock(item.scheduled_at)
  return {
    key: `broadcast-${item.id}`,
    scheduled_at: item.scheduled_at,
    badge: '전체 공지 예약',
    title: BROADCAST_NOTICE_LABEL[item.notice_type],
    subtitle: `${Number(clock.month)}월 ${Number(clock.day)}일 발송`,
    student_count: item.student_count,
    kind: 'broadcast',
    schedule_id: item.id,
    body: item.body,
  }
}

function ScheduleEntry({
  item,
  extraCount,
  totalCount,
  collapsed,
  open,
  slotRef,
  line,
  onClick,
}: {
  item: ScheduleCard
  extraCount: number
  totalCount: number
  collapsed: boolean
  open: boolean
  slotRef: Ref<HTMLDivElement>
  line: boolean
  onClick: (anchor: HTMLButtonElement) => void
}) {
  const mode = collapsed ? 'collapsed' : 'expanded'
  const clock = seoulClock(item.scheduled_at)
  const time = `${clock.hour}:${clock.minute}`
  const summary =
    totalCount > 1 ? `예약 ${totalCount}건, 가장 가까운 시각 ${time}` : `${item.badge} ${time}`

  return (
    <div ref={slotRef} className={scheduleStackStyle[mode]}>
      {line ? (
        <button
          type="button"
          className={scheduleLineButton}
          data-schedule-layer=""
          data-open={open ? 'true' : undefined}
          aria-expanded={open}
          aria-label={summary}
          onClick={(event) => onClick(event.currentTarget)}
        >
          <span className={scheduleTimeStyle}>{time}</span>
          <span>예약 {totalCount}</span>
        </button>
      ) : (
        <button
          type="button"
          className={scheduleCardStyle[mode]}
          data-schedule-layer=""
          title={collapsed ? `${item.title} ${item.subtitle} ${time}` : undefined}
          data-open={open ? 'true' : undefined}
          aria-expanded={open}
          aria-label={summary}
          onClick={(event) => onClick(event.currentTarget)}
        >
          <span className={scheduleTimeStyle}>{time}</span>
          <span className={scheduleDetailStyle[mode]}>
            <span className={scheduleBadgeStyle}>{item.badge}</span>
            <span className={scheduleClassStyle}>{item.title}</span>
            <span className={scheduleDateStyle}>{item.subtitle}</span>
            {extraCount > 0 && <span className={scheduleMoreStyle}>외 {extraCount}건</span>}
          </span>
        </button>
      )}
    </div>
  )
}

function otherDialogOpen(): boolean {
  return Boolean(document.querySelector('[role="dialog"]:not([data-schedule-layer])'))
}

function ScheduleListPopover({
  items,
  anchorEl,
  openKey,
  onClose,
  onSelect,
}: {
  items: ScheduleCard[]
  anchorEl: HTMLButtonElement | null
  openKey: string | null
  onClose: () => void
  onSelect: (item: ScheduleCard, anchor: HTMLButtonElement) => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useLayoutEffect(() => {
    const panel = panelRef.current
    if (!panel || !anchorEl) return

    function place() {
      if (!panel || !anchorEl) return
      const rect = anchorEl.getBoundingClientRect()
      const height = panel.offsetHeight
      const gap = 10
      let top = rect.top
      if (top + height > window.innerHeight - 8) {
        top = Math.max(8, window.innerHeight - height - 8)
      }
      const arrow = Math.min(Math.max(rect.top + rect.height / 2 - top, 18), Math.max(18, height - 18))
      panel.style.setProperty('--schedule-popover-x', `${rect.right + gap}px`)
      panel.style.setProperty('--schedule-popover-y', `${top}px`)
      panel.style.setProperty('--schedule-popover-arrow', `${arrow}px`)
    }

    place()
    const observer = new ResizeObserver(() => place())
    observer.observe(panel)
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [anchorEl, items.length])

  useEffect(() => {
    if (!anchorEl) return
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape' || otherDialogOpen()) return
      onClose()
    }
    function onPointerDown(event: MouseEvent) {
      if (otherDialogOpen()) return
      const node = event.target
      if (!(node instanceof Node)) return
      if (node instanceof Element && node.closest('[data-schedule-layer]')) return
      onClose()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onPointerDown)
    }
  }, [anchorEl, onClose])

  if (!mounted || !anchorEl) return null

  return createPortal(
    <div
      ref={panelRef}
      className={scheduleActionPopover}
      role="dialog"
      data-schedule-layer=""
      aria-label="예약 내역"
    >
      <div className={scheduleActionStack}>
        <p className={scheduleListHeading}>예약 내역</p>
        <div className={scheduleListStack}>
          {items.map((item) => {
            const clock = seoulClock(item.scheduled_at)
            const time = `${clock.hour}:${clock.minute}`
            const open = openKey === item.key
            return (
              <button
                key={item.key}
                type="button"
                className={scheduleListItem}
                data-open={open ? 'true' : undefined}
                aria-expanded={open}
                onClick={(event) => onSelect(item, event.currentTarget)}
              >
                <span className={scheduleListTime}>{time}</span>
                <span className={scheduleListBadge}>{item.badge}</span>
                <span className={scheduleListName}>{item.title}</span>
                <span className={scheduleListMeta}>{item.subtitle}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>,
    document.body,
  )
}

function avatarInitial(name: string | undefined): string {
  const t = (name ?? '').trim()
  if (!t) return '?'
  return t.charAt(0).toUpperCase()
}

export default function Sidebar() {
  const pathname = usePathname()
  const user = useUserStore((s) => s.user)
  const collapsed = useUiStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)
  const logout = useLogout()
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [actionTarget, setActionTarget] = useState<ScheduleActionTarget | null>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [listAnchor, setListAnchor] = useState<HTMLButtonElement | null>(null)
  const [scheduleFit, setScheduleFit] = useState<'card' | 'line'>('card')
  const [bottomScroll, setBottomScroll] = useState(false)
  const asideRef = useRef<HTMLElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const slotRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLButtonElement>(null)
  const cardHeightRef = useRef(0)
  const lineHeightRef = useRef(0)
  const collapsedRef = useRef(collapsed)

  const meActive = pathname.startsWith('/me')
  const mode = collapsed ? 'collapsed' : 'expanded'
  const schedulesQuery = useQuery({
    queryKey: queryKeys.lessons.sendSchedules,
    queryFn: () => lessonService.listSendSchedules(),
    enabled: Boolean(user),
    refetchInterval: 15_000,
  })
  const broadcastSchedulesQuery = useQuery({
    queryKey: queryKeys.alimtalk.broadcastSchedules,
    queryFn: () => alimtalkService.listBroadcastSchedules(),
    enabled: Boolean(user),
    refetchInterval: 15_000,
  })
  const schedules = [
    ...(schedulesQuery.data ?? []).map(lessonCard),
    ...(broadcastSchedulesQuery.data ?? []).map(broadcastCard),
  ].sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at) || a.key.localeCompare(b.key))
  const nearest = schedules[0]
  const extraCount = Math.max(0, schedules.length - 1)
  const showLine = !collapsed && scheduleFit === 'line'
  const scheduleKey = schedules.map((item) => item.key).join('|')

  useLayoutEffect(() => {
    const aside = asideRef.current
    if (!aside) return
    if (schedules.length === 0) {
      setScheduleFit('card')
      setBottomScroll(false)
      return
    }

    if (collapsedRef.current !== collapsed) {
      collapsedRef.current = collapsed
      if (scheduleFit !== 'card' || bottomScroll) {
        setScheduleFit('card')
        setBottomScroll(false)
        return
      }
    }

    const update = () => {
      const currentAside = asideRef.current
      const end = endRef.current
      const nav = navRef.current
      const slot = slotRef.current
      const bottom = bottomRef.current
      if (!currentAside || !end || currentAside.clientHeight === 0) return

      const endMargin = Number.parseFloat(getComputedStyle(end).marginBottom) || 0
      const overflow =
        end.getBoundingClientRect().bottom + endMargin - currentAside.getBoundingClientRect().bottom
      const lastLink = nav?.querySelector(':scope > a:last-child')
      const gap =
        lastLink && slot
          ? slot.getBoundingClientRect().top - lastLink.getBoundingClientRect().bottom
          : 0

      if (slot) {
        const slotMargin = Number.parseFloat(getComputedStyle(slot).marginBottom) || 0
        const slotHeight = slot.offsetHeight + slotMargin
        if (showLine) lineHeightRef.current = slotHeight
        else cardHeightRef.current = slotHeight
      }

      if (!showLine && !bottomScroll) {
        if (overflow > 1) {
          if (collapsed) setBottomScroll(true)
          else setScheduleFit('line')
        }
        return
      }

      if (showLine && !bottomScroll) {
        if (overflow > 1) {
          setBottomScroll(true)
          return
        }
        const needed = cardHeightRef.current - lineHeightRef.current + 16
        if (cardHeightRef.current === 0 ? gap > 80 : gap >= needed) setScheduleFit('card')
        return
      }

      if (bottom && bottom.scrollTop === 0) {
        const bottomEdge = bottom.getBoundingClientRect().bottom
        const room = bottomEdge - (end.getBoundingClientRect().bottom + endMargin)
        if (room > 16) setBottomScroll(false)
      }
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(aside)
    return () => observer.disconnect()
  }, [bottomScroll, collapsed, scheduleFit, scheduleKey, schedules.length, showLine])

  function closeSchedule() {
    setActionTarget(null)
    setAnchorEl(null)
  }

  function selectSchedule(item: ScheduleCard, anchor: HTMLButtonElement) {
    if (actionTarget?.key === item.key) {
      closeSchedule()
      return
    }
    setActionTarget(item)
    setAnchorEl(anchor)
  }

  function openSummary(anchor: HTMLButtonElement) {
    if (!nearest) return
    if (schedules.length > 1) {
      setActionTarget(null)
      setAnchorEl(null)
      setListAnchor((current) => (current ? null : anchor))
      return
    }
    setListAnchor(null)
    selectSchedule(nearest, anchor)
  }

  function closeList() {
    setListAnchor(null)
    closeSchedule()
  }

  const summaryOpen = schedules.length > 1 ? Boolean(listAnchor) : actionTarget?.key === nearest?.key

  return (
    <aside ref={asideRef} className={sidebarStyle[mode]} aria-expanded={!collapsed}>
      <div className={sidebarTopStyle[mode]}>
        <LogoIcon width={32} height={32} />
        <button
          type="button"
          className={toggleButtonStyle}
          onClick={toggleSidebar}
          aria-label={collapsed ? '\uC0AC\uC774\uB4DC\uBC14 \uD3BC\uCE58\uAE30' : '\uC0AC\uC774\uB4DC\uBC14 \uC811\uAE30'}
        >
          {collapsed ? (
            <ChevronRightIcon width={20} height={20} />
          ) : (
            <ChevronLeftIcon width={20} height={20} />
          )}
        </button>
      </div>
      <nav ref={navRef} className={`${navStyle[mode]}${bottomScroll ? ` ${navFixedStyle}` : ''}`}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname.startsWith(href) ||
            (href === '/management' && pathname.startsWith('/students'))
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`${navItemStyle[mode]}${isActive ? ` ${navItemActiveStyle}` : ''}`}
            >
              <Icon width={20} height={20} />
              <span className={navLabelStyle[mode]}>{label}</span>
            </Link>
          )
        })}
      </nav>

      <div
        ref={bottomRef}
        className={`${sidebarBottomStyle[mode]}${bottomScroll ? ` ${sidebarBottomScrollStyle}` : ''}`}
      >
        {nearest && (
          <ScheduleEntry
            item={nearest}
            extraCount={extraCount}
            totalCount={schedules.length}
            collapsed={collapsed}
            open={summaryOpen}
            slotRef={slotRef}
            line={showLine}
            onClick={openSummary}
          />
        )}
        <SidebarUsage collapsed={collapsed} />
        <Link
          href="/me"
          title={collapsed ? '\uB0B4 \uC815\uBCF4' : undefined}
          className={`${userCardStyle[mode]}${meActive ? ` ${userCardActiveStyle}` : ''}`}
          aria-label={'\uB0B4 \uC815\uBCF4'}
        >
          <span className={userAvatarStyle}>{avatarInitial(user?.name)}</span>
          <span className={userTextWrapStyle[mode]}>
            <span className={userNameStyle}>{user?.name ?? '\uB0B4 \uC815\uBCF4'}</span>
            <span className={userEmailStyle}>{user?.email ?? '\u2014'}</span>
          </span>
        </Link>

        <button
          ref={endRef}
          type="button"
          className={logoutButtonStyle[mode]}
          title={collapsed ? '\uB85C\uADF8\uC544\uC6C3' : undefined}
          aria-label={'\uB85C\uADF8\uC544\uC6C3'}
          onClick={() => setIsLogoutModalOpen(true)}
        >
          <LogoutIcon width={20} height={20} />
          {!collapsed && '\uB85C\uADF8\uC544\uC6C3'}
        </button>
      </div>

      <ScheduleListPopover
        items={schedules}
        anchorEl={schedules.length > 1 ? listAnchor : null}
        openKey={actionTarget?.key ?? null}
        onClose={closeList}
        onSelect={selectSchedule}
      />

      <ScheduleActionPopover
        target={actionTarget}
        anchorEl={anchorEl}
        onClose={closeSchedule}
        onTimeSaved={(scheduledAt) =>
          setActionTarget((current) => (current ? { ...current, scheduled_at: scheduledAt } : current))
        }
      />

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={async () => {
          await logout()
        }}
        title="로그아웃"
        descriptions={['로그아웃 하시겠습니까?']}
        confirmLabel="로그아웃"
        confirmVariant="danger"
      />
    </aside>
  )
}
