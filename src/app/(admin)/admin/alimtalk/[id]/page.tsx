'use client'

import { use } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Calendar, Clock, Mail, MessageSquare } from 'lucide-react'
import { isAxiosError } from '@/lib/api/http'
import { admin, adminErrorMessage } from '@/services/admin'
import { StatCard } from '../../_components/AdminUi'
import { formatMdHm, formatYmd } from '../../_lib/format'
import { batchTitle, batchTypeLabel, groupBatchMessages } from '../../_lib/alimtalk'
import * as styles from '../../admin.css'

function channelLabel(type: 'STUDENT' | 'PARENT'): string {
  return type === 'PARENT' ? '학부모' : '학생'
}

export default function AdminAlimtalkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: rawId } = use(params)
  const id = Number.parseInt(rawId, 10)
  const enabled = Number.isInteger(id) && id > 0

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'alimtalk', 'batch', id],
    queryFn: () => admin.getAlimtalkBatch(id),
    enabled,
    retry: false,
    refetchOnWindowFocus: false,
  })

  if (!enabled || (isError && isAxiosError(error) && error.response?.status === 404)) {
    return <p className={styles.loading}>발송 내역을 찾을 수 없습니다.</p>
  }
  if (isLoading) return <p className={styles.loading}>발송 상세를 불러오는 중…</p>
  if (isError || !data) return <p className={styles.loading}>{adminErrorMessage(error)}</p>

  const recipients = groupBatchMessages(data.messages)
  const title = batchTitle(data)

  return (
    <div className={styles.stack}>
      <div>
        <Link href="/admin/alimtalk" className={styles.backLink}>
          <ArrowLeft size={16} />
          알림톡 목록으로
        </Link>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.pageTitle}>{title}</h1>
            <div className={styles.metaRow}>
              <span className={styles.badge.slate}>{batchTypeLabel(data.batch_type)}</span>
              <span className={styles.metaItem}>
                {data.delivery_mode === 'MOCK' ? '모의 전송' : '실발송'}
              </span>
              <span className={styles.metaItem}>
                <Mail size={14} />
                <Link href={`/admin/users/${data.teacher_id}`} className={styles.nameLink}>
                  {data.teacher_name}
                </Link>
              </span>
              {data.lesson_date ? (
                <span className={styles.metaItem}>
                  <Calendar size={14} /> 수업일 {formatYmd(data.lesson_date)}
                </span>
              ) : null}
              <span className={styles.metaItem}>
                <Clock size={14} /> {formatMdHm(data.sent_at)}
              </span>
            </div>
            {data.template_name ? <p className={styles.pageSub}>{data.template_name}</p> : null}
          </div>
        </div>
      </div>

      <div className={styles.kpiGrid3}>
        <StatCard
          label="수신 건수"
          value={data.total_count}
          sub={`${recipients.length}명`}
          icon={MessageSquare}
          iconTone="primary50"
          accent="primary"
        />
        <StatCard
          label="성공"
          value={data.success_count}
          icon={MessageSquare}
          iconTone="success"
          accent="success"
          valueTone="success"
        />
        <StatCard
          label="실패"
          value={data.fail_count}
          icon={MessageSquare}
          iconTone="error"
          accent="error"
          valueTone={data.fail_count > 0 ? 'error' : undefined}
        />
      </div>

      {data.body_text ? (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>공지 원문</h2>
          </div>
          <div className={styles.formBody}>
            <p className={styles.messageBody}>{data.body_text}</p>
          </div>
        </section>
      ) : null}

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>수신자별 문자</h2>
          <span className={styles.badge.indigo}>{recipients.length}명</span>
        </div>
        <div className={styles.formBody}>
          {recipients.length === 0 ? (
            <p className={styles.empty}>수신 메시지가 없습니다.</p>
          ) : (
            <div className={styles.recipientList}>
              {recipients.map((group) => (
                <article key={group.student_id} className={styles.messageCard}>
                  <div className={styles.messageCardHead}>
                    <strong>{group.student_name}</strong>
                    {group.student ? (
                      <span
                        className={
                          group.student.status === 'SUCCESS' ? styles.badge.green : styles.badge.red
                        }
                      >
                        학생 {group.student.status === 'SUCCESS' ? '성공' : '실패'}
                      </span>
                    ) : null}
                    {group.parent ? (
                      <span
                        className={
                          group.parent.status === 'SUCCESS' ? styles.badge.green : styles.badge.red
                        }
                      >
                        학부모 {group.parent.status === 'SUCCESS' ? '성공' : '실패'}
                      </span>
                    ) : null}
                  </div>
                  {([group.student, group.parent] as const)
                    .filter((msg): msg is NonNullable<typeof msg> => Boolean(msg))
                    .map((msg) => (
                      <div key={msg.message_id} className={styles.cellStack}>
                        <span className={styles.messageLabel}>
                          {channelLabel(msg.phone_type)} · {msg.phone}
                        </span>
                        {msg.error_message ? (
                          <p className={styles.dropText}>{msg.error_message}</p>
                        ) : null}
                        <p className={styles.messageBody}>{msg.message_body}</p>
                      </div>
                    ))}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
