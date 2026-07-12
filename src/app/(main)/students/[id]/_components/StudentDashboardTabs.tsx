'use client'

import type {
  AlimtalkHistoryRow,
  LessonHistoryRow,
  ScoreHistoryPoint,
  ScorePeriod,
} from '@/services/studentDashboard'
import ScoreLineChart from '../ScoreLineChart'
import * as styles from '../studentDashboard.css'
import {
  MSG,
  PERIODS,
  type AiSection,
  type MainTab,
} from '../_lib/studentDashboardShared'
import { SparkleIcon } from './StudentDashboardIcons'

type StudentDashboardTabsProps = {
  mainTab: MainTab
  onTabChange: (tab: MainTab) => void
  period: ScorePeriod
  onPeriodChange: (period: ScorePeriod) => void
  scoreRows: ScoreHistoryPoint[]
  lessons: LessonHistoryRow[]
  alimRows: AlimtalkHistoryRow[]
  aiLoading: boolean
  aiText: string | null
  aiSections: AiSection[]
  onRefreshAi: () => void
}

export function StudentDashboardTabs({
  mainTab,
  onTabChange,
  period,
  onPeriodChange,
  scoreRows,
  lessons,
  alimRows,
  aiLoading,
  aiText,
  aiSections,
  onRefreshAi,
}: StudentDashboardTabsProps) {
  return (
    <div className={styles.panelCard}>
      <div className={styles.tabRow}>
        <button
          type="button"
          className={`${styles.tabBtn}${mainTab === 'scores' ? ` ${styles.tabBtnActive}` : ''}`}
          onClick={() => onTabChange('scores')}
        >
          {MSG.tabScores}
        </button>
        <button
          type="button"
          className={`${styles.tabBtn}${mainTab === 'lessons' ? ` ${styles.tabBtnActive}` : ''}`}
          onClick={() => onTabChange('lessons')}
        >
          {MSG.tabLessons}
        </button>
        <button
          type="button"
          className={`${styles.tabBtn}${mainTab === 'alimtalk' ? ` ${styles.tabBtnActive}` : ''}`}
          onClick={() => onTabChange('alimtalk')}
        >
          {MSG.tabAlim}
        </button>
      </div>

      <div className={styles.panelBody}>
        {mainTab === 'scores' && (
          <>
            <div className={styles.periodRow}>
              {PERIODS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  className={`${styles.periodChip}${period === p.key ? ` ${styles.periodChipActive}` : ''}`}
                  onClick={() => onPeriodChange(p.key)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <ScoreLineChart rows={scoreRows} motionKey={`${period}-${scoreRows.length}`} />
            <div className={styles.aiBox}>
              <div className={styles.aiTitleRow}>
                <SparkleIcon />
                <span className={styles.aiTitle}>{MSG.aiTitle}</span>
              </div>
              {aiLoading ? (
                <p className={styles.aiBody}>{MSG.analyzing}</p>
              ) : aiSections.length > 0 ? (
                <div className={styles.aiSections}>
                  {aiSections.map((s, idx) => (
                    <div key={`${s.title}-${idx}`} className={styles.aiSection}>
                      <span className={styles.aiSectionTitle}>{s.title}</span>
                      {s.kind === 'list' ? (
                        <ul className={styles.aiList}>
                          {s.items.map((item, i) => (
                            <li key={`${idx}-${i}`} className={styles.aiListItem}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className={styles.aiSectionBody}>{s.items.join(' ')}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.aiBody}>{aiText ?? MSG.aiEmpty}</p>
              )}
              <div className={styles.aiToolbar}>
                <button
                  type="button"
                  className={styles.aiRefreshBtn}
                  disabled={aiLoading}
                  onClick={onRefreshAi}
                >
                  {MSG.refreshAi}
                </button>
              </div>
            </div>
          </>
        )}

        {mainTab === 'lessons' && (
          <>
            {lessons.length === 0 ? (
              <div className={styles.emptyState}>{MSG.noLessons}</div>
            ) : (
              <table className={styles.listTable}>
                <thead>
                  <tr>
                    <th className={styles.th}>{MSG.thDate}</th>
                    <th className={styles.th}>{MSG.thClass}</th>
                    <th className={styles.th}>{MSG.thTemplate}</th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.map((row) => (
                    <tr key={row.lesson_record_id}>
                      <td className={styles.td}>{row.lesson_date}</td>
                      <td className={styles.td}>{row.class_name}</td>
                      <td className={styles.td}>{row.template_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {mainTab === 'alimtalk' && (
          <>
            {alimRows.length === 0 ? (
              <div className={styles.emptyState}>{MSG.noAlim}</div>
            ) : (
              <table className={styles.listTable}>
                <thead>
                  <tr>
                    <th className={styles.th}>{MSG.thSentDate}</th>
                    <th className={styles.th}>{MSG.thSentTime}</th>
                    <th className={styles.th}>{MSG.thType}</th>
                    <th className={styles.th}>{MSG.thSentClass}</th>
                  </tr>
                </thead>
                <tbody>
                  {alimRows.map((row) => (
                    <tr key={row.message_id}>
                      <td className={styles.td}>
                        {new Date(row.sent_at).toLocaleString('ko-KR', {
                          month: '2-digit',
                          day: '2-digit',
                        })}
                      </td>
                      <td className={styles.td}>
                        {new Date(row.sent_at).toLocaleString('ko-KR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className={styles.td}>{row.batch_type}</td>
                      <td className={styles.td}>{row.class_name ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  )
}
