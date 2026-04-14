'use client'

import { useRef, useState } from 'react'
import Text from '@/components/common/Text'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import UploadCloudIcon from '@/assets/icons/icon-upload-cloud.svg'
import DownloadIcon from '@/assets/icons/icon-download.svg'
import CloseIcon from '@/assets/icons/icon-close.svg'
import XlsxIcon from '@/assets/icons/icon-xlsx.svg'
import {
  fieldGroupStyle,
  stepStyle,
  stepHeaderStyle,
  stepNumberStyle,
  stepTitleStyle,
  stepDescStyle,
  dropzoneStyle,
  dropzoneActiveStyle,
  dropzoneTextStyle,
  dropzoneIconStyle,
  fileNameStyle,
  fileRowStyle,
  fileDeleteButtonStyle,
  fileIconBadgeStyle,
  actionsStyle,
} from './BulkUploadModal.css'

interface BulkUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (file: File) => void
}

export default function BulkUploadModal({ isOpen, onClose, onConfirm }: BulkUploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => setFile(f)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleClose = () => {
    setFile(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <div style={{ marginBottom: '36px' }}>
        <Text variant="headingLg" as="h2">
          일괄 등록
        </Text>
      </div>
      <div className={fieldGroupStyle}>
        {/* Step 1 */}
        <div className={stepStyle}>
          <div className={stepHeaderStyle}>
            <span className={stepNumberStyle}>1</span>
            <span className={stepTitleStyle}>양식 다운로드</span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<DownloadIcon width={20} height={20} />}
            style={{ marginLeft: 32, alignSelf: 'flex-start' }}
            onClick={() => {
              const link = document.createElement('a')
              link.href = '/templates/student-template.xlsx'
              link.download = '학생_일괄등록_양식.xlsx'
              link.click()
            }}
          >
            엑셀 양식 다운로드
          </Button>
        </div>

        {/* Step 2 */}
        <div className={stepStyle}>
          <div className={stepHeaderStyle}>
            <span className={stepNumberStyle}>2</span>
            <span className={stepTitleStyle}>학생 정보 작성</span>
          </div>
          <span className={stepDescStyle}>
            양식에 학생명, 학생 전화, 학부모 전화를 입력해주세요
          </span>
        </div>

        {/* Step 3 */}
        <div className={stepStyle}>
          <div className={stepHeaderStyle}>
            <span className={stepNumberStyle}>3</span>
            <span className={stepTitleStyle}>파일 업로드</span>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleFile(f)
            }}
          />
          {file ? (
            <div className={fileRowStyle}>
              <XlsxIcon width={24} height={24} />
              <span className={fileNameStyle}>{file.name}</span>
              <button
                className={fileDeleteButtonStyle}
                onClick={() => {
                  setFile(null)
                  if (inputRef.current) inputRef.current.value = ''
                }}
              >
                <CloseIcon width={20} height={20} />
              </button>
            </div>
          ) : (
            <div
              className={`${dropzoneStyle}${isDragging ? ` ${dropzoneActiveStyle}` : ''}`}
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              style={{ cursor: 'pointer' }}
            >
              <span className={dropzoneIconStyle}>
                <UploadCloudIcon width={24} height={24} />
              </span>
              <span className={dropzoneTextStyle}>파일을 드래그하거나 클릭하여 선택하세요</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  inputRef.current?.click()
                }}
              >
                파일 열기
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className={actionsStyle}>
        <Button variant="ghost" size="lg" fullWidth onClick={handleClose}>
          취소
        </Button>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!file}
          onClick={() => {
            if (file) {
              onConfirm(file)
              handleClose()
            }
          }}
        >
          업로드
        </Button>
      </div>
    </Modal>
  )
}
