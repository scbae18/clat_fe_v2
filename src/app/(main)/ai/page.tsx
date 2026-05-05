'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Button from '@/components/common/Button/Button'
import useToast from '@/hooks/useToast'
import RiskBadge from './_components/RiskBadge/RiskBadge'
import ScoreTrendMini from './_components/ScoreTrendMini/ScoreTrendMini'
import SignalCard from './_components/SignalCard/SignalCard'
import {
  MOCK_AT_RISK_SNAPSHOTS,
  MOCK_LOW_SNAPSHOTS,
  MOCK_NEW_SNAPSHOT,
  MOCK_RECENT_LESSONS,
  MOCK_RISK_HISTORY,
  MOCK_RISK_TIMELINE,
} from './_data/mockAtRisk'
import type {
  RecentLessonSummary,
  RiskDecision,
  RiskLevel,
  RiskSnapshot,
  RiskTimelineItem,
} from './_types/atRisk'
import * as styles from './aiStudents.css'

type LevelFilter = 'ALL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NEW'

const FILTERS: Array<{ value: LevelFilter; label: string }> = [
  { value: 'ALL', label: '전체' },
  { value: 'HIGH', label: '위험' },
  { value: 'MEDIUM', label: '주의' },
  { value: 'LOW', label: '안정' },
  { value: 'NEW', label: '관찰' },
]

const ALL_SNAPSHOTS: RiskSnapshot[] = [
  ...MOCK_AT_RISK_SNAPSHOTS,
  ...MOCK_LOW_SNAPSHOTS,
  MOCK_NEW_SNAPSHOT,
]

function scoreColor(level: RiskLevel): string {
  if (level === 'HIGH') return 'rgb(220, 34, 59)'
  if (level === 'MEDIUM') return 'rgb(163, 89, 8)'
  if (level === 'NEW') return 'rgb(59, 81, 204)'
  return 'rgb(29, 170, 127)'
}

function levelAccentColor(level: RiskLevel): string {
  if (level === 'HIGH') return '#EF4453'
  if (level === 'MEDIUM') return '#FDAD22'
  if (level === 'LOW') return '#1DAA7F'
  return '#5774DA'
}

function levelTintColor(level: RiskLevel): string {
  if (level === 'HIGH') return '#FFF1F1'
  if (level === 'MEDIUM') return '#FFF9EB'
  if (level === 'LOW') return '#EDFCF5'
  return '#F1F4FD'
}

function levelBorderColor(level: RiskLevel): string {
  if (level === 'HIGH') return '#FDCED0'
  if (level === 'MEDIUM') return '#FFEEC6'
  if (level === 'LOW') return '#ABEFD2'
  return '#C8D5F5'
}

function decisionLabel(d: RiskDecision): string {
  if (d === 'ACTED') return '처리함'
  if (d === 'SNOOZED') return '보류'
  return '제외'
}

function decisionClass(d: RiskDecision): string {
  if (d === 'ACTED') return `${styles.decisionChip} ${styles.decisionActed}`
  if (d === 'SNOOZED') return `${styles.decisionChip} ${styles.decisionSnoozed}`
  return `${styles.decisionChip} ${styles.decisionDismissed}`
}

function attendanceClass(a: RecentLessonSummary['attendance']): string {
  if (a === '출석') return `${styles.tagAttendance} ${styles.tagPresent}`
  if (a === '지각') return `${styles.tagAttendance} ${styles.tagLate}`
  if (a === '결석') return `${styles.tagAttendance} ${styles.tagAbsent}`
  return styles.tagAttendance
}

function AiStudentsRiskContent() {
  const searchParams = useSearchParams()
  const toast = useToast()

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<LevelFilter>('ALL')
  const [selectedId, setSelectedId] = useState<number | null>(
    ALL_SNAPSHOTS[0]?.studentId ?? null,
  )
  const [note, setNote] = useState('')

  useEffect(() => {
    const fromQuery = searchParams.get('student')
    if (fromQuery) {
      const id = Number(fromQuery)
      if (!Number.isNaN(id)) setSelectedId(id)
    }
  }, [searchParams])

  const filtered = useMemo(() => {
    return ALL_SNAPSHOTS.filter((s) => {
      const passLevel = filter === 'ALL' || s.level === filter
      const term = search.trim()
      const passSearch =
        term.length === 0 ||
        s.studentName.includes(term) ||
        s.className.includes(term)
      return passLevel && passSearch
    }).sort((a, b) => b.score - a.score)
  }, [search, filter])

  const selected = useMemo(
    () => ALL_SNAPSHOTS.find((s) => s.studentId === selectedId) ?? null,
    [selectedId],
  )

  const history = selected ? MOCK_RISK_HISTORY[selected.studentId] ?? [] : []
  const timeline = selected ? MOCK_RISK_TIMELINE[selected.studentId] ?? [] : []
  const lessons = selected ? MOCK_RECENT_LESSONS[selected.studentId] ?? [] : []

  const onSaveNote = () => {
    if (!note.trim()) {
      toast.warning('내용을 입력해 주세요.')
      return
    }
    toast.success('조교 노트에 기록했어요.')
    setNote('')
  }

  const onMarkActed = () => {
    if (!selected) return
    toast.success(`${selected.studentName} 학생을 '처리함'으로 표시했어요.`)
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.listColumn}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="학생 이름 또는 반 이름 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className={styles.filterChips}>
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              className={`${styles.filterChip}${filter === f.value ? ` ${styles.filterChipActive}` : ''}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <ul className={styles.list}>
          {filtered.map((s) => (
            <li
              key={s.studentId}
              className={`${styles.listItem}${
                s.studentId === selectedId ? ` ${styles.listItemActive}` : ''
              }`}
              style={{ borderLeft: `3px solid ${levelAccentColor(s.level)}` }}
              onClick={() => setSelectedId(s.studentId)}
            >
              <div className={styles.listLeft}>
                <span className={styles.listName}>{s.studentName}</span>
                <span className={styles.listMeta}>{s.className}</span>
              </div>
              <div className={styles.listRight}>
                <RiskBadge level={s.level} size="sm" showDot={false} />
                <span
                  className={styles.listScore}
                  style={{ color: scoreColor(s.level) }}
                >
                  {s.level === 'NEW' ? '—' : `${s.score}점`}
                </span>
              </div>
            </li>
          ))}
          {filtered.length === 0 ? (
            <li className={styles.emptyDetail}>해당하는 학생이 없어요.</li>
          ) : null}
        </ul>
      </aside>

      <section className={styles.detailColumn}>
        {!selected ? (
          <div className={styles.detailCard}>
            <p className={styles.emptyDetail}>학생을 선택해 주세요.</p>
          </div>
        ) : (
          <>
            <div
              className={styles.detailCard}
              style={{
                borderTop: `4px solid ${levelAccentColor(selected.level)}`,
                borderColor: levelBorderColor(selected.level),
              }}
            >
              <header className={styles.detailHeader}>
                <div className={styles.studentIdentity}>
                  <RiskBadge level={selected.level} size="lg" />
                  <div>
                    <div className={styles.studentNameLg}>{selected.studentName}</div>
                    <div className={styles.studentMetaLg}>
                      {selected.className}
                      {selected.grade ? ` · ${selected.grade}` : ''}
                      {selected.schoolName ? ` · ${selected.schoolName}` : ''}
                      {' · '}등록 {selected.joinedDays}일차
                    </div>
                  </div>
                </div>
                {selected.level !== 'NEW' ? (
                  <div className={styles.scoreBlockLg}>
                    <span
                      className={styles.scoreNumberLg}
                      style={{ color: scoreColor(selected.level) }}
                    >
                      {selected.score}
                    </span>
                    <span className={styles.scoreUnitLg}>/ 100점</span>
                  </div>
                ) : null}
              </header>

              <div
                className={styles.oneLinerBox}
                style={{ backgroundColor: levelTintColor(selected.level) }}
              >
                {selected.brief.oneLiner}
              </div>

              {selected.brief.causes.length > 0 ? (
                <>
                  <h3 className={styles.sectionTitle} style={{ marginTop: '20px' }}>
                    조교가 본 원인 가설
                  </h3>
                  <ul className={styles.causesList}>
                    {selected.brief.causes.map((c, i) => (
                      <li key={i} className={styles.causeItem}>
                        {c}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              {selected.brief.actions.length > 0 ? (
                <div style={{ marginTop: '20px' }}>
                  <div className={styles.actionButtonsRow}>
                    {selected.brief.actions.map((action) => (
                      <Button
                        key={action.id}
                        variant="outlined"
                        size="sm"
                        onClick={onMarkActed}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {history.length > 0 ? (
              <div className={styles.detailCard}>
                <div className={styles.sectionTitleRow}>
                  <h3 className={styles.sectionTitle} style={{ margin: 0 }}>
                    최근 12주 위험도 추이
                  </h3>
                </div>
                <ScoreTrendMini data={history} />
              </div>
            ) : null}

            {selected.signals.length > 0 ? (
              <div className={styles.detailCard}>
                <h3 className={styles.sectionTitle}>신호 분석</h3>
                <div className={styles.signalsGrid}>
                  {selected.signals.map((sig) => (
                    <SignalCard
                      key={sig.code}
                      signal={sig}
                      triggered={selected.topSignalCodes.includes(sig.code)}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {timeline.length > 0 ? (
              <div className={styles.detailCard}>
                <h3 className={styles.sectionTitle}>조교 노트 타임라인</h3>
                <div className={styles.timeline}>
                  {timeline.map((t: RiskTimelineItem) => (
                    <div key={t.date} className={styles.timelineItem}>
                      <span className={styles.timelineDate}>{t.date.slice(5)}</span>
                      <div className={styles.timelineBody}>
                        <div className={styles.timelineHeadRow}>
                          <RiskBadge level={t.level} size="sm" showDot={false} />
                          {t.decision ? (
                            <span className={decisionClass(t.decision)}>
                              {decisionLabel(t.decision)}
                            </span>
                          ) : null}
                        </div>
                        <span className={styles.timelineText}>{t.oneLiner}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '12px' }}>
                  <textarea
                    className={styles.noteEditor}
                    placeholder="이 학생에 대한 노트를 추가하면 다음 브리핑에 반영돼요."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                  <div className={styles.noteRow}>
                    <Button variant="outlined" size="sm" onClick={() => setNote('')}>
                      취소
                    </Button>
                    <Button variant="primary" size="sm" onClick={onSaveNote}>
                      노트 저장
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}

            {lessons.length > 0 ? (
              <div className={styles.detailCard}>
                <h3 className={styles.sectionTitle}>최근 5회 수업</h3>
                <table className={styles.lessonTable}>
                  <thead>
                    <tr>
                      <th className={styles.lessonTh}>날짜</th>
                      <th className={styles.lessonTh}>템플릿</th>
                      <th className={styles.lessonTh}>점수</th>
                      <th className={styles.lessonTh}>과제</th>
                      <th className={styles.lessonTh}>출결</th>
                      <th className={styles.lessonTh}>메모</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lessons.map((l) => (
                      <tr key={l.date}>
                        <td className={styles.lessonTd}>{l.date.slice(5)}</td>
                        <td className={styles.lessonTd}>{l.templateName}</td>
                        <td className={styles.lessonTd}>
                          {l.score === null || l.score === undefined ? '—' : `${l.score}점`}
                        </td>
                        <td className={styles.lessonTd}>
                          {l.homeworkCompleted === true
                            ? '완료'
                            : l.homeworkCompleted === false
                              ? '미완료'
                              : '—'}
                        </td>
                        <td className={styles.lessonTd}>
                          {l.attendance ? (
                            <span className={attendanceClass(l.attendance)}>
                              {l.attendance}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className={styles.lessonTd}>{l.note ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </>
        )}
      </section>
    </div>
  )
}

export default function AiStudentsRiskPage() {
  return (
    <Suspense fallback={null}>
      <AiStudentsRiskContent />
    </Suspense>
  )
}
