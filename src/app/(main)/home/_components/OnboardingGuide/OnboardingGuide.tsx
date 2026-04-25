'use client'

import { useState } from 'react'
import BookOpenIcon from '@/assets/icons/icon-book-open.svg'
import ChevronDownIcon from '@/assets/icons/icon-chevron-down.svg'
import * as styles from './OnboardingGuide.css'

interface Step {
  tag: string
  title: string
  items: string[]
}

const STEPS: Step[] = [
  {
    tag: 'STEP 1',
    title: '반 & 학생 등록',
    items: [
      '[학생·반 관리] 메뉴에서 반 이름 입력 후 반 생성 (예: "중등 수학 A반")',
      '생성된 반에 학생 개별 추가 또는 엑셀 파일로 일괄 등록',
      '학생 정보 입력 (이름, 학생 전화번호, 학부모 전화번호)',
      '등록 완료 → 이후 수업 입력 시 해당 반·학생 자동 연동',
    ],
  },
  {
    tag: 'STEP 2',
    title: '수업 준비 — 템플릿 설정',
    items: [
      '템플릿 이름 입력 (예: "중등 수업 템플릿")',
      '공통 항목 추가 (예: 오늘 수업 내용, 과제 범위)',
      '개별 항목 추가 (시험 점수 → 숫자형 / 출결 → 선택형 / 과제 → 완료형)',
      '문자에 포함할 항목 선택 후 저장 → 이후 수업에서 반복 사용',
    ],
  },
  {
    tag: 'STEP 3',
    title: '수업 데이터 입력 & 문자 발송',
    items: [
      '홈 화면에서 날짜 선택 → 해당 날짜 수업반 자동 표시',
      '반 선택 후 [입력하기] 클릭 → 템플릿 선택',
      '공통 내용 및 학생별 개별 내용 입력',
      '저장 → 완료율 자동 계산 및 미완료 항목 추적 시작',
      '학생별 문자 내용 미리보기 확인 후 엑셀 내보내기',
    ],
  },
  {
    tag: 'STEP 4',
    title: '학생 추적',
    items: [
      '템플릿 생성 시 관리할 항목을 완료형으로 설정',
      '학생 목록에서 완료율이 낮은 학생 확인',
      '학생 개인 페이지 진입 → 미완료 항목 및 수업 확인',
      '페이지에서 바로 완료 처리 → 즉시 반영',
    ],
  },
]

interface OnboardingGuideProps {
  defaultOpen?: boolean
}

export default function OnboardingGuide({ defaultOpen = false }: OnboardingGuideProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section className={styles.wrapper}>
      <button
        type="button"
        className={styles.summary}
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
      >
        <span className={styles.summaryLeft}>
          <BookOpenIcon width={20} height={20} />
          <span className={styles.summaryTitle}>처음 사용하시나요?</span>
          <span className={styles.summarySub}>4단계 시작 가이드</span>
        </span>
        <span className={`${styles.chevronWrap} ${isOpen ? styles.chevronOpen : ''}`}>
          <ChevronDownIcon width={20} height={20} />
        </span>
      </button>

      {isOpen && (
        <div className={styles.content}>
          <div className={styles.tabList}>
            {STEPS.map((step, i) => (
              <button
                key={step.tag}
                type="button"
                onClick={() => setActiveStep(i)}
                className={`${styles.tabButton} ${i === activeStep ? styles.tabButtonActive : ''}`}
              >
                {step.tag}
              </button>
            ))}
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepCardTitle}>{STEPS[activeStep].title}</div>
            <div className={styles.stepItemList}>
              {STEPS[activeStep].items.map((item, i) => (
                <div key={i} className={styles.stepItem}>
                  <div className={styles.stepNumber}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className={styles.stepItemText}>{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
