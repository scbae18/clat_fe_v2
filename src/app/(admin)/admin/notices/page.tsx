'use client'

import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import Button from '@/components/common/Button/Button'
import Input from '@/components/common/Input/Input'
import Textarea from '@/components/common/Textarea'
import ConfirmModal from '@/components/common/ConfirmModal/ConfirmModal'
import { AdminHeader, AdminPager } from '../_components/AdminUi'
import { admin, adminErrorMessage } from '@/services/admin'
import useToast from '@/hooks/useToast'
import { formatMdHm } from '../_lib/format'
import {
  ADMIN_NOTICE_CHAR_LIMIT,
  adminNoticeCharCount,
  formatAdminNoticeDateLabel,
  renderAdminNoticeMessage,
  todayKstYmd,
} from './_lib/adminNotice'
import * as styles from '../admin.css'

const POLL_MS = 2000
const POLL_LIMIT_MS = 10 * 60 * 1000

function statusLabel(status: string) {
  if (status === 'queued') return '대기'
  if (status === 'sending') return '보내는 중'
  if (status === 'partial_fail') return '일부 실패'
  if (status === 'PENDING') return '대기'
  if (status === 'FAIL') return '실패'
  if (status === 'SUCCESS') return '성공'
  return '완료'
}

function statusBadge(status: string) {
  if (status === 'FAIL' || status === 'partial_fail') return styles.badge.red
  if (status === 'queued' || status === 'sending' || status === 'PENDING') return styles.badge.yellow
  return styles.badge.green
}

async function pollNotice(id: number, onProgress: (sent: number, total: number) => void) {
  const deadline = Date.now() + POLL_LIMIT_MS
  for (;;) {
    const detail = await admin.getNotice(id)
    onProgress(detail.success_count + detail.fail_count, detail.total_count)
    if (detail.status === 'done' || detail.status === 'partial_fail') return detail
    if (Date.now() >= deadline) throw new Error('BATCH_POLL_TIMEOUT')
    await new Promise((resolve) => setTimeout(resolve, POLL_MS))
  }
}

export default function AdminNoticesPage() {
  const queryClient = useQueryClient()
  const { success, error } = useToast()
  const [date, setDate] = useState(todayKstYmd)
  const [body, setBody] = useState('')
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [testConfirmOpen, setTestConfirmOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [progress, setProgress] = useState<{ sent: number; total: number } | null>(null)
  const [page, setPage] = useState(1)
  const [openId, setOpenId] = useState<number | null>(null)

  const recipientsQuery = useQuery({
    queryKey: ['admin', 'notices', 'recipients'],
    queryFn: () => admin.listNoticeRecipients(),
    refetchOnWindowFocus: false,
  })
  const historyQuery = useQuery({
    queryKey: ['admin', 'notices', 'list', page],
    queryFn: () => admin.listNotices(page, 20),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
  const detailQuery = useQuery({
    queryKey: ['admin', 'notices', 'detail', openId],
    queryFn: () => admin.getNotice(openId!),
    enabled: openId != null,
    refetchOnWindowFocus: false,
  })

  const recipients = recipientsQuery.data?.items ?? []
  const deliveryMode = recipientsQuery.data?.delivery_mode ?? 'mock'
  const skippedNoPhone = recipientsQuery.data?.skipped_no_phone ?? 0
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return recipients
    return recipients.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        row.phone.includes(q),
    )
  }, [recipients, search])

  const dateLabel = formatAdminNoticeDateLabel(date)
  const preview = renderAdminNoticeMessage(dateLabel, body.trim() || '업데이트 사항을 입력하면 여기에 보여요.')
  const charCount = adminNoticeCharCount(renderAdminNoticeMessage(dateLabel, body.trim()))
  const overLimit = charCount > ADMIN_NOTICE_CHAR_LIMIT
  const selectedCount = selectedIds.size
  const canSend = Boolean(body.trim()) && !overLimit && selectedCount > 0 && !sending

  const toggle = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectVisible = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      for (const row of filtered) next.add(row.id)
      return next
    })
  }

  const selectAllEligible = () => {
    setSelectedIds(new Set(recipients.map((row) => row.id)))
  }

  const clearSelected = () => setSelectedIds(new Set())

  const runSend = async (kind: 'all-selected' | 'test') => {
    setConfirmOpen(false)
    setTestConfirmOpen(false)
    setSending(true)
    setProgress({ sent: 0, total: kind === 'test' ? 1 : selectedCount })
    try {
      const payload = { date, body: body.trim() }
      const queued =
        kind === 'test'
          ? await admin.sendNoticeTest(payload)
          : await admin.sendNotice({
              ...payload,
              teacher_ids: [...selectedIds],
            })
      const settled = await pollNotice(queued.batch_id, (sent, total) => {
        setProgress({ sent, total })
      })
      if (settled.fail_count > 0) {
        error(`${settled.success_count}건 보냈고 ${settled.fail_count}건은 실패했습니다.`)
      } else {
        success(
          kind === 'test'
            ? '내 번호로 시험 발송했습니다.'
            : `${settled.success_count}명에게 안내 알림톡을 보냈습니다.`,
        )
      }
      await queryClient.invalidateQueries({ queryKey: ['admin', 'notices'] })
    } catch (err) {
      error(adminErrorMessage(err, '발송에 실패했습니다.'))
    } finally {
      setSending(false)
      setProgress(null)
    }
  }

  if (recipientsQuery.isLoading) {
    return <p className={styles.loading}>안내 알림톡을 불러오는 중…</p>
  }
  if (recipientsQuery.isError) {
    return <p className={styles.loading}>{adminErrorMessage(recipientsQuery.error)}</p>
  }

  return (
    <div className={styles.stack}>
      <AdminHeader
        title="안내 알림톡"
        subtitle="클랫 업데이트·안내를 선생님 가입 번호로 보냅니다. 선생님 발송 내역과 통수에는 들어가지 않습니다."
      />

      {deliveryMode === 'live' ? (
        <section className={styles.warnBox}>
          지금은 실제 카카오 알림톡으로 나갑니다. 보내기 전에 미리보기를 확인하고, 처음이면 내 번호로 시험 발송하세요.
        </section>
      ) : (
        <section className={styles.healthCard.info}>
          지금은 모의 모드라 실제 카톡에는 도착하지 않습니다.
        </section>
      )}

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>새 안내 보내기</h2>
        </div>
        <div className={styles.formBody}>
          <div className={styles.noticeComposeGrid}>
            <div className={styles.noticeFormStack}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>날짜</span>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>업데이트 사항</span>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={8}
                  placeholder="선생님에게 전할 내용을 적어 주세요."
                />
                <span className={overLimit ? styles.noticeCharCountOver : styles.noticeCharCount}>
                  {charCount.toLocaleString()} / {ADMIN_NOTICE_CHAR_LIMIT}
                </span>
              </label>
              <div className={styles.formActions}>
                <Button
                  type="button"
                  variant="primary"
                  disabled={!canSend}
                  onClick={() => setConfirmOpen(true)}
                >
                  {sending && progress ? `보내는 중 ${progress.sent}/${progress.total}` : `${selectedCount}명에게 보내기`}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={!body.trim() || overLimit || sending}
                  onClick={() => setTestConfirmOpen(true)}
                >
                  내 번호로 시험 발송
                </Button>
              </div>
            </div>
            <div>
              <p className={styles.fieldLabel}>미리보기</p>
              <div className={styles.noticePreviewCard}>{preview}</div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>받을 선생님</h2>
          <span className={styles.noticeCountHint}>
            번호 있는 {recipients.length}명
            {skippedNoPhone > 0 ? ` · 번호 없음 ${skippedNoPhone}명은 빠짐` : ''}
          </span>
        </div>
        <div className={styles.formBody}>
          <div className={styles.noticeToolbar}>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="이름, 이메일, 번호"
            />
            <Button type="button" variant="ghost" size="sm" onClick={selectAllEligible}>
              전체 선택
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={selectVisible}>
              검색 결과 선택
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={clearSelected}>
              선택 해제
            </Button>
          </div>
          {filtered.length === 0 ? (
            <p className={styles.empty}>보낼 수 있는 선생님이 없습니다.</p>
          ) : (
            <div className={styles.noticeRecipientList}>
              {filtered.map((row) => (
                <label key={row.id} className={styles.noticeRecipientRow}>
                  <input
                    type="checkbox"
                    className={styles.noticeCheckbox}
                    checked={selectedIds.has(row.id)}
                    onChange={() => toggle(row.id)}
                  />
                  <span className={styles.noticeRecipientMeta}>
                    <span>{row.name}</span>
                    <span className={styles.muted}>
                      {row.email} · {row.phone}
                      {row.suspended ? ' · 정지' : ''}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>보낸 이력</h2>
        </div>
        {historyQuery.isLoading ? (
          <p className={styles.loading}>이력을 불러오는 중…</p>
        ) : historyQuery.isError ? (
          <p className={styles.loading}>{adminErrorMessage(historyQuery.error)}</p>
        ) : (historyQuery.data?.items.length ?? 0) === 0 ? (
          <p className={styles.empty}>아직 보낸 안내 알림톡이 없습니다.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>보낸 시각</th>
                  <th className={styles.th}>날짜</th>
                  <th className={styles.th}>내용</th>
                  <th className={styles.th}>결과</th>
                </tr>
              </thead>
              <tbody>
                {historyQuery.data?.items.map((row) => (
                  <tr
                    key={row.id}
                    className={styles.clickRow}
                    onClick={() => setOpenId((cur) => (cur === row.id ? null : row.id))}
                  >
                    <td className={styles.td}>{formatMdHm(row.sent_at)}</td>
                    <td className={styles.td}>{row.date_label ?? row.date ?? '-'}</td>
                    <td className={styles.td}>
                      <span className={styles.preview}>{row.body}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={statusBadge(row.status)}>{statusLabel(row.status)}</span>
                      {' '}
                      {row.success_count}/{row.total_count}
                      {row.delivery_mode === 'mock' ? ' · 모의' : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <AdminPager
              page={page}
              limit={historyQuery.data?.meta.limit ?? 20}
              total={historyQuery.data?.meta.total ?? 0}
              onPage={setPage}
            />
          </div>
        )}
        {openId != null ? (
          <div className={styles.formBody}>
            {detailQuery.isLoading ? (
              <p className={styles.loading}>
                <Loader2 size={16} /> 상세를 불러오는 중…
              </p>
            ) : detailQuery.isError ? (
              <p className={styles.loading}>{adminErrorMessage(detailQuery.error)}</p>
            ) : (
              <div className={styles.recipientList}>
                {detailQuery.data?.messages.map((message) => (
                  <div key={message.id} className={styles.messageCardHead}>
                    <span>{message.teacher_name}</span>
                    <span className={styles.messageMeta}>
                      {message.teacher_email} · {message.phone}
                    </span>
                    <span className={statusBadge(message.status)}>{statusLabel(message.status)}</span>
                    {message.error_message ? (
                      <span className={styles.muted}>{message.error_message}</span>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </section>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => void runSend('all-selected')}
        title={`${selectedCount}명에게 안내 알림톡을 보낼까요?`}
        descriptions={
          deliveryMode === 'live'
            ? ['실제 카카오 알림톡으로 나갑니다. 선생님 통수에는 들어가지 않습니다.']
            : ['모의 모드라 실제 카톡에는 도착하지 않습니다.']
        }
        confirmLabel="보내기"
      />
      <ConfirmModal
        isOpen={testConfirmOpen}
        onClose={() => setTestConfirmOpen(false)}
        onConfirm={() => void runSend('test')}
        title="내 번호로 시험 발송할까요?"
        descriptions={
          deliveryMode === 'live'
            ? ['관리자 계정에 등록된 번호로 실제 알림톡 1통이 갑니다.']
            : ['모의 모드라 실제 카톡에는 도착하지 않습니다.']
        }
        confirmLabel="시험 발송"
      />
    </div>
  )
}
