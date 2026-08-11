'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Text from '@/components/common/Text'
import Textarea from '@/components/common/Textarea'
import { listItemRowStyle } from '@/components/common/styles/listItem.css'
import useToast from '@/hooks/useToast'
import { useUserStore } from '@/stores/userStore'
import { classService, type Class } from '@/services/class'
import { studentService } from '@/services/student'
import type { Student } from '@/types/student'
import {
  alimtalkService,
  type BroadcastChannel,
  type AlimtalkDeliveryMode,
} from '@/services/alimtalk'
import { AlimtalkTabs } from '../_components/AlimtalkTabs'
import * as baseStyles from '../alimtalkSettings.css'
import * as styles from './broadcast.css'

function hasPhone(value: string | null | undefined) {
  return Boolean(value && String(value).replace(/\D/g, '').length >= 8)
}

function resolveChannel(
  sendToParent: boolean,
  sendToStudent: boolean,
): BroadcastChannel | null {
  if (sendToParent && sendToStudent) return 'BOTH'
  if (sendToParent) return 'PARENT'
  if (sendToStudent) return 'STUDENT'
  return null
}

function isSelectable(
  student: Student,
  sendToParent: boolean,
  sendToStudent: boolean,
) {
  if (!sendToParent && !sendToStudent) return false
  if (sendToStudent && !hasPhone(student.phone)) return false
  if (sendToParent && !hasPhone(student.parent_phone)) return false
  return true
}

function disableReason(
  student: Student,
  sendToParent: boolean,
  sendToStudent: boolean,
) {
  if (!sendToParent && !sendToStudent) return '수신 대상 선택'
  const needStudent = sendToStudent && !hasPhone(student.phone)
  const needParent = sendToParent && !hasPhone(student.parent_phone)
  if (needStudent && needParent) return '번호 없음'
  if (needStudent) return '학생번호 없음'
  if (needParent) return '학부모번호 없음'
  return ''
}

function estimateCount(
  selectedCount: number,
  sendToParent: boolean,
  sendToStudent: boolean,
) {
  let per = 0
  if (sendToParent) per += 1
  if (sendToStudent) per += 1
  return selectedCount * per
}

export default function AlimtalkBroadcastPage() {
  const router = useRouter()
  const { success, error } = useToast()
  const user = useUserStore((s) => s.user)

  const [deliveryMode, setDeliveryMode] = useState<AlimtalkDeliveryMode>('mock')
  const [classes, setClasses] = useState<Class[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [classStudentIds, setClassStudentIds] = useState<Record<number, number[]>>({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterClassId, setFilterClassId] = useState<number | null>(null)
  const [sendToParent, setSendToParent] = useState(true)
  const [sendToStudent, setSendToStudent] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [checkedClasses, setCheckedClasses] = useState<Set<number>>(new Set())
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)

  const academyName = useMemo(() => {
    return classes[0]?.academy_name?.trim() || '학원명'
  }, [classes])
  const teacherName = user?.name?.trim() || '강사명'
  const channel = resolveChannel(sendToParent, sendToStudent)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [settings, classRes, studentRes] = await Promise.all([
          alimtalkService.getSettings(),
          classService.getClasses({ status: 'active' }),
          studentService.getStudents(),
        ])
        if (cancelled) return
        setDeliveryMode(settings.delivery_mode)
        setClasses(classRes.data)
        setStudents(studentRes.data)

        const map: Record<number, number[]> = {}
        await Promise.all(
          classRes.data.map(async (c) => {
            try {
              const list = await classService.getClassStudents(c.id)
              map[c.id] = list.map((s) => s.id)
            } catch {
              map[c.id] = []
            }
          }),
        )
        if (!cancelled) setClassStudentIds(map)
      } catch {
        if (!cancelled) error('학생·반 목록을 불러오지 못했어요.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount once
  }, [])

  useEffect(() => {
    setSelectedIds((prev) => {
      const next = new Set<number>()
      for (const id of prev) {
        const st = students.find((s) => s.id === id)
        if (st && isSelectable(st, sendToParent, sendToStudent)) next.add(id)
      }
      return next
    })
  }, [sendToParent, sendToStudent, students])

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase()
    return students.filter((s) => {
      if (filterClassId != null) {
        const inClass =
          (classStudentIds[filterClassId] ?? []).includes(s.id) ||
          s.classes?.some((c) => c.id === filterClassId)
        if (!inClass) return false
      }
      if (!q) return true
      return (
        s.name.toLowerCase().includes(q) ||
        s.classes?.some((c) => c.name.toLowerCase().includes(q))
      )
    })
  }, [students, search, filterClassId, classStudentIds])

  const selectableFiltered = useMemo(
    () =>
      filteredStudents.filter((s) =>
        isSelectable(s, sendToParent, sendToStudent),
      ),
    [filteredStudents, sendToParent, sendToStudent],
  )

  const allFilteredSelected =
    selectableFiltered.length > 0 &&
    selectableFiltered.every((s) => selectedIds.has(s.id))

  const toggleStudent = useCallback(
    (student: Student) => {
      if (!isSelectable(student, sendToParent, sendToStudent)) return
      setSelectedIds((prev) => {
        const next = new Set(prev)
        if (next.has(student.id)) next.delete(student.id)
        else next.add(student.id)
        return next
      })
    },
    [sendToParent, sendToStudent],
  )

  const selectAllFiltered = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      for (const s of selectableFiltered) next.add(s.id)
      return next
    })
  }, [selectableFiltered])

  const clearFiltered = useCallback(() => {
    const remove = new Set(filteredStudents.map((s) => s.id))
    setSelectedIds((prev) => {
      const next = new Set<number>()
      for (const id of prev) {
        if (!remove.has(id)) next.add(id)
      }
      return next
    })
  }, [filteredStudents])

  const clearAll = useCallback(() => {
    setSelectedIds(new Set())
    setCheckedClasses(new Set())
  }, [])

  const toggleClass = useCallback(
    async (cls: Class) => {
      let ids = classStudentIds[cls.id]
      if (!ids) {
        try {
          const list = await classService.getClassStudents(cls.id)
          ids = list.map((s) => s.id)
          setClassStudentIds((prev) => ({ ...prev, [cls.id]: ids! }))
        } catch {
          error('반 학생을 불러오지 못했어요.')
          return
        }
      }

      const selectableIds = ids.filter((id) => {
        const st = students.find((s) => s.id === id)
        return st && isSelectable(st, sendToParent, sendToStudent)
      })

      setCheckedClasses((prev) => {
        const next = new Set(prev)
        const turningOn = !next.has(cls.id)
        if (turningOn) {
          next.add(cls.id)
          setSelectedIds((sel) => {
            const n = new Set(sel)
            for (const id of selectableIds) n.add(id)
            return n
          })
        } else {
          next.delete(cls.id)
          const stillCovered = new Set<number>()
          for (const otherId of next) {
            for (const sid of classStudentIds[otherId] ?? []) stillCovered.add(sid)
          }
          setSelectedIds((sel) => {
            const n = new Set<number>()
            for (const id of sel) {
              if (!ids!.includes(id) || stillCovered.has(id)) n.add(id)
            }
            return n
          })
        }
        return next
      })
    },
    [sendToParent, sendToStudent, classStudentIds, students, error],
  )

  const previewText = useMemo(() => {
    const content = body.trim() || '공지 내용을 입력하세요.'
    return `안녕하세요. ${academyName} ${teacherName}입니다.\n${content}`
  }, [academyName, teacherName, body])

  const expectedCount = estimateCount(selectedIds.size, sendToParent, sendToStudent)

  const handleSend = async () => {
    if (sending) return
    if (!channel) {
      error('학부모 또는 학생 중 하나 이상 선택해 주세요.')
      return
    }
    if (selectedIds.size === 0) {
      error('보낼 학생을 선택해 주세요.')
      return
    }
    if (!body.trim()) {
      error('공지 내용을 입력해 주세요.')
      return
    }

    setSending(true)
    try {
      const res = await alimtalkService.sendBroadcast({
        student_ids: [...selectedIds],
        channel,
        body: body.trim(),
      })
      if (res.fail_count > 0) {
        error(`발송 완료 · 실패 ${res.fail_count}건 (성공 ${res.success_count}건)`)
      } else {
        success(`발송 완료 · ${res.success_count}건`)
      }
      router.push('/alimtalk/history')
    } catch {
      error('발송에 실패했어요.')
    } finally {
      setSending(false)
    }
  }

  if (loading) return null

  return (
    <div className={baseStyles.pageRoot}>
      <h1 className={baseStyles.pageTitle}>알림톡</h1>

      {deliveryMode === 'mock' && (
        <div className={baseStyles.deliveryBanner}>
          현재 <strong>모의 전송(mock)</strong> 모드입니다. 실제 카카오 알림톡은 발송되지
          않아요.
        </div>
      )}

      <AlimtalkTabs />

      <div className={styles.layout}>
        <section className={`${styles.panel} ${styles.recipientPanel}`} aria-label="수신자 선택">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeaderText}>
              <Text as="h2" variant="headingSm">
                수신자 선택
              </Text>
              <Text as="p" variant="labelSm" color="gray500">
                반 필터 · 반 일괄 선택 · 개별 선택
              </Text>
            </div>
            <span className={styles.countBadge}>{selectedIds.size}명 선택</span>
          </div>

          <div className={styles.searchWrap}>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="학생 이름 · 반 이름 검색"
              aria-label="학생 검색"
            />
          </div>

          <div className={styles.sectionBlock}>
            <Text as="h3" variant="titleSm" color="gray700">
              목록 필터
            </Text>
            <div className={styles.filterRow}>
              <button
                type="button"
                className={`${styles.filterChip} ${filterClassId == null ? styles.filterChipActive : styles.filterChipInactive}`}
                onClick={() => setFilterClassId(null)}
              >
                전체
              </button>
              {classes.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`${styles.filterChip} ${filterClassId === c.id ? styles.filterChipActive : styles.filterChipInactive}`}
                  onClick={() =>
                    setFilterClassId((prev) => (prev === c.id ? null : c.id))
                  }
                >
                  {c.name}
                  <span className={styles.filterChipCount}>{c.student_count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sectionBlock}>
            <Text as="h3" variant="titleSm" color="gray700">
              반 일괄 선택
            </Text>
            <div className={styles.classBulkRow}>
              {classes.length === 0 ? (
                <Text as="p" variant="labelSm" color="gray500">
                  등록된 반이 없어요.
                </Text>
              ) : (
                classes.map((c) => {
                  const active = checkedClasses.has(c.id)
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className={`${styles.classBulkItem}${active ? ` ${styles.classBulkItemActive}` : ''}`}
                      aria-pressed={active}
                      onClick={() => void toggleClass(c)}
                    >
                      {c.name}
                    </button>
                  )
                })
              )}
            </div>
          </div>

          <div className={styles.toolbar}>
            <div className={styles.toolbarActions}>
              <Button
                variant="ghost"
                size="sm"
                onClick={allFilteredSelected ? clearFiltered : selectAllFiltered}
                disabled={selectableFiltered.length === 0}
              >
                {allFilteredSelected ? '현재 목록 해제' : '현재 목록 전체 선택'}
              </Button>
              <Button variant="ghost" size="sm" onClick={clearAll}>
                전체 선택 해제
              </Button>
            </div>
            <Text as="span" variant="labelSm" color="gray500">
              표시 {filteredStudents.length}명
            </Text>
          </div>

          <div className={styles.studentList}>
            {filteredStudents.length === 0 ? (
              <div className={styles.emptyList}>
                <Text as="p" variant="bodyMd" color="gray500">
                  조건에 맞는 학생이 없어요.
                </Text>
              </div>
            ) : (
              filteredStudents.map((s) => {
                const ok = isSelectable(s, sendToParent, sendToStudent)
                const checked = selectedIds.has(s.id)
                return (
                  <button
                    key={s.id}
                    type="button"
                    className={`${listItemRowStyle} ${styles.studentRowButton}${checked ? ` ${styles.studentRowSelected}` : ''}${ok ? '' : ` ${styles.studentRowDisabled}`}`}
                    aria-pressed={checked}
                    disabled={!ok}
                    onClick={() => toggleStudent(s)}
                  >
                    <span className={styles.studentName}>{s.name}</span>
                    <span className={styles.studentMeta}>
                      {ok
                        ? s.classes?.map((c) => c.name).join(', ') || '—'
                        : disableReason(s, sendToParent, sendToStudent)}
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </section>

        <section className={styles.composeStack} aria-label="공지 작성">
          <div className={styles.panel}>
            <div className={styles.sectionHeaderText}>
              <Text as="h2" variant="headingSm">
                공지 내용
              </Text>
              <Text as="p" variant="labelSm" color="gray500">
                인사말은 고정 · 버튼 없음
              </Text>
            </div>

            <div className={styles.channelRow} role="group" aria-label="수신 대상">
              <button
                type="button"
                className={`${styles.channelCheck}${sendToParent ? ` ${styles.channelCheckActive}` : ''}`}
                aria-pressed={sendToParent}
                onClick={() => setSendToParent((v) => !v)}
              >
                학부모에게 보내기
              </button>
              <button
                type="button"
                className={`${styles.channelCheck}${sendToStudent ? ` ${styles.channelCheckActive}` : ''}`}
                aria-pressed={sendToStudent}
                onClick={() => setSendToStudent((v) => !v)}
              >
                학생에게 보내기
              </button>
            </div>

            <div className={styles.bodyField}>
              <Textarea
                className={styles.bodyTextarea}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="공지 내용을 입력하세요."
                aria-label="공지 내용"
              />
              <Text as="p" variant="labelSm" color="gray500">
                안녕하세요. {'{학원명}'} {'{강사명}'}입니다.
              </Text>
            </div>

            <div className={styles.summaryBar}>
              <Text as="p" variant="bodyMd" color="gray700">
                선택 {selectedIds.size}명 · 예상 발송 {expectedCount}건
              </Text>
              <Button
                variant="primary"
                size="md"
                onClick={() => void handleSend()}
                disabled={sending}
              >
                {sending ? '발송 중…' : '발송하기'}
              </Button>
            </div>
          </div>

          <div className={baseStyles.previewColumn}>
            <h2 className={baseStyles.previewTitle}>알림톡 미리보기</h2>
            <div className={baseStyles.previewPhoneShell}>
              <div className={baseStyles.previewLogoRow}>
                <div className={baseStyles.previewLogoPlaceholder} />
                <span className={baseStyles.previewAppLabel}>클랫 수업 알림</span>
              </div>
              <div className={baseStyles.previewHeaderBar}>
                <p className={baseStyles.previewHeaderText}>알림톡 상세 도착</p>
              </div>
              <div className={baseStyles.previewBubble}>
                <p className={baseStyles.previewBodyText}>{previewText}</p>
              </div>
              <p className={baseStyles.previewTime}>오후 09:54</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
