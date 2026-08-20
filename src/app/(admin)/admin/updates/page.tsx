'use client'

import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ImagePlus, Loader2, Megaphone, Plus, Trash2 } from 'lucide-react'
import Button from '@/components/common/Button/Button'
import Input from '@/components/common/Input/Input'
import Textarea from '@/components/common/Textarea'
import { AdminHeader } from '../_components/AdminUi'
import { WhatsNewContent } from '@/components/whats-new/WhatsNewModal/WhatsNewModal'
import { admin, adminErrorMessage } from '@/services/admin'
import useToast from '@/hooks/useToast'
import { resolveNoticeImageUrl, type UpdateNoticeItem } from '@/lib/whatsNew'
import { formatMdHm } from '../_lib/format'
import * as styles from '../admin.css'

const DEFAULT_TITLE = '업데이트가 있어요'
const DEFAULT_SUBTITLE = '이번 배포에서 아래 기능이 추가됐어요.'
const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif'
const IMAGE_MAX_BYTES = 5 * 1024 * 1024

function emptyItem(): UpdateNoticeItem {
  return { title: '', description: '' }
}

export default function AdminUpdatesPage() {
  const queryClient = useQueryClient()
  const { success, error } = useToast()
  const [title, setTitle] = useState(DEFAULT_TITLE)
  const [subtitle, setSubtitle] = useState(DEFAULT_SUBTITLE)
  const [items, setItems] = useState<UpdateNoticeItem[]>([emptyItem(), emptyItem()])
  const [saving, setSaving] = useState(false)
  const [deactivating, setDeactivating] = useState(false)
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)

  const { data, isLoading, isError, error: loadError } = useQuery({
    queryKey: ['admin', 'update-notices'],
    queryFn: () => admin.listUpdateNotices(),
    refetchOnWindowFocus: false,
  })

  const active = data?.find((n) => n.is_active) ?? null
  const filledItems = useMemo(
    () => items.filter((item) => item.title.trim() && item.description.trim()),
    [items],
  )

  const updateItem = (index: number, patch: Partial<UpdateNoticeItem>) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  const removeImage = (index: number) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item
        const next = { ...item }
        delete next.image_url
        return next
      }),
    )
  }

  const handleImageChange = async (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (file.size > IMAGE_MAX_BYTES) {
      error('이미지는 5MB까지 올릴 수 있어요.')
      return
    }
    if (!IMAGE_ACCEPT.split(',').includes(file.type)) {
      error('JPG, PNG, WEBP, GIF만 올릴 수 있어요.')
      return
    }
    setUploadingIndex(index)
    try {
      const { url } = await admin.uploadUpdateNoticeImage(file)
      updateItem(index, { image_url: url })
    } catch (err) {
      error(adminErrorMessage(err))
    } finally {
      setUploadingIndex(null)
    }
  }

  const handlePublish = async (e: FormEvent) => {
    e.preventDefault()
    if (filledItems.length === 0) {
      error('항목을 1개 이상 입력해 주세요.')
      return
    }
    setSaving(true)
    try {
      await admin.publishUpdateNotice({
        title: title.trim() || DEFAULT_TITLE,
        subtitle: subtitle.trim() || DEFAULT_SUBTITLE,
        items: filledItems.map((item) => {
          const next: UpdateNoticeItem = {
            title: item.title.trim(),
            description: item.description.trim(),
          }
          if (item.image_url) next.image_url = item.image_url
          return next
        }),
      })
      success('업데이트 모달을 띄웠어요. 아직 확인하지 않은 선생님에게 보여요.')
      await queryClient.invalidateQueries({ queryKey: ['admin', 'update-notices'] })
    } catch (err) {
      error(adminErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDeactivate = async () => {
    setDeactivating(true)
    try {
      const res = await admin.deactivateUpdateNotice()
      if (res.deactivated) success('업데이트 모달을 내렸어요.')
      else error('내려 둘 활성 모달이 없어요.')
      await queryClient.invalidateQueries({ queryKey: ['admin', 'update-notices'] })
    } catch (err) {
      error(adminErrorMessage(err))
    } finally {
      setDeactivating(false)
    }
  }

  if (isLoading) return <p className={styles.loading}>업데이트 공지를 불러오는 중…</p>
  if (isError) return <p className={styles.loading}>{adminErrorMessage(loadError)}</p>

  return (
    <div className={styles.stack}>
      <AdminHeader
        title="업데이트 모달"
        subtitle="내용을 입력하고 게시하면 아직 확인하지 않은 선생님 앱에 모달이 한 번 뜹니다. 항목마다 이미지를 붙일 수 있고, 홈 업데이트 소식에서도 다시 볼 수 있습니다."
      />

      {active ? (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>현재 게시 중 · #{active.id}</h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => void handleDeactivate()}
              disabled={deactivating}
            >
              {deactivating ? '내리는 중…' : '모달 내리기'}
            </Button>
          </div>
          <div className={styles.formBody}>
            <WhatsNewContent title={active.title} subtitle={active.subtitle} items={active.items} />
          </div>
        </section>
      ) : (
        <p className={styles.pageSub}>지금 게시된 업데이트 모달은 없습니다.</p>
      )}

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>새 공지 게시</h2>
        </div>
        <form className={styles.formBody} onSubmit={(e) => void handlePublish(e)}>
          <div className={styles.noticeFormStack}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>제목</span>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>부제</span>
              <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} maxLength={200} />
            </label>

            {items.map((item, index) => (
              <div key={index} className={styles.noticeItemCard}>
                <div className={styles.noticeItemHead}>
                  <span className={styles.noticeItemIndex}>{index + 1}</span>
                  {items.length > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}
                      leftIcon={<Trash2 size={14} />}
                    >
                      삭제
                    </Button>
                  ) : null}
                </div>
                <div className={styles.noticeItemFields}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>항목 제목</span>
                    <Input
                      value={item.title}
                      onChange={(e) => updateItem(index, { title: e.target.value })}
                      placeholder="문자 내용 분리"
                      maxLength={80}
                    />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>설명</span>
                    <Textarea
                      value={item.description}
                      onChange={(e) => updateItem(index, { description: e.target.value })}
                      placeholder="알림톡 인트로와 아웃트로를 나눠 작성할 수 있어요."
                      rows={2}
                      maxLength={300}
                    />
                  </label>
                </div>
                <div className={styles.noticeImageField}>
                  <span className={styles.fieldLabel}>이미지 (선택)</span>
                  {item.image_url ? (
                    <div className={styles.noticeImagePreviewWrap}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resolveNoticeImageUrl(item.image_url)}
                        alt={item.title || `항목 ${index + 1} 미리보기`}
                        className={styles.noticeImagePreview}
                      />
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeImage(index)}>
                        이미지 제거
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <input
                        id={`notice-image-${index}`}
                        className={styles.srOnly}
                        type="file"
                        accept={IMAGE_ACCEPT}
                        disabled={uploadingIndex === index}
                        onChange={(e) => void handleImageChange(index, e)}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        disabled={uploadingIndex === index}
                        leftIcon={
                          uploadingIndex === index ? <Loader2 size={16} /> : <ImagePlus size={16} />
                        }
                        onClick={() => {
                          document.getElementById(`notice-image-${index}`)?.click()
                        }}
                      >
                        {uploadingIndex === index ? '올리는 중…' : '이미지 첨부'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {items.length < 10 ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                leftIcon={<Plus size={16} />}
                onClick={() => setItems((prev) => [...prev, emptyItem()])}
              >
                항목 추가
              </Button>
            ) : null}

            {filledItems.length > 0 ? (
              <div className={styles.noticePreviewWrap}>
                <p className={styles.fieldLabel}>미리보기</p>
                <WhatsNewContent
                  title={title.trim() || DEFAULT_TITLE}
                  subtitle={subtitle.trim() || DEFAULT_SUBTITLE}
                  items={filledItems}
                />
              </div>
            ) : null}

            <div className={styles.formActions}>
              <Button
                type="submit"
                disabled={saving}
                leftIcon={saving ? <Loader2 size={16} /> : <Megaphone size={16} />}
              >
                {saving ? '게시 중…' : '모달 띄우기'}
              </Button>
            </div>
          </div>
        </form>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>게시 이력</h2>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>ID</th>
                <th className={styles.th}>제목</th>
                <th className={styles.th}>항목</th>
                <th className={styles.th}>상태</th>
                <th className={styles.th}>게시 시각</th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).length === 0 ? (
                <tr>
                  <td className={styles.td} colSpan={5}>
                    아직 게시한 공지가 없어요.
                  </td>
                </tr>
              ) : (
                (data ?? []).map((row) => (
                  <tr key={row.id}>
                    <td className={styles.td}>{row.id}</td>
                    <td className={styles.td}>{row.title}</td>
                    <td className={styles.td}>{row.items.length}개</td>
                    <td className={styles.td}>{row.is_active ? '게시 중' : '종료'}</td>
                    <td className={styles.td}>{formatMdHm(row.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
