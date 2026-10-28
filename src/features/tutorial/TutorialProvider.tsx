'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import Text from '@/components/common/Text'
import { useToastStore } from '@/stores/toastStore'
import { setTutorialActionHandler } from './tutorialEvents'
import {
  stepPath,
  tutorialApi,
  type TutorialScreen,
  type TutorialState,
} from './tutorialApi'
import { lessonCue, TUTORIAL_BEATS, type TutorialBeat } from './tutorialSteps'
import { TutorialLayer } from './TutorialLayer'
import * as styles from './tutorial.css'

const DISMISS_KEY = 'clat-tutorial-start-dismissed'

interface TutorialContextValue {
  status: TutorialState['status']
  step: number
  lessonId: number | null
  studentId: number | null
  seenScreens: string[]
  hidden: boolean
  cue: 'attendance' | 'send' | null
  reopenTick: number
  ready: boolean
  requestReopen: () => void
  markSeen: (screen: TutorialScreen) => void
  start: () => void
  resume: () => void
  restart: () => void
}

const TutorialContext = createContext<TutorialContextValue | null>(null)

export function useTutorial(): TutorialContextValue {
  const value = useContext(TutorialContext)
  if (!value) {
    return {
      status: 'none',
      step: 0,
      lessonId: null,
      studentId: null,
      seenScreens: [],
      hidden: true,
      cue: null,
      reopenTick: 0,
      ready: false,
      requestReopen: () => {},
      markSeen: () => {},
      start: () => {},
      resume: () => {},
      restart: () => {},
    }
  }
  return value
}

export default function TutorialProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname() ?? ''
  const addToast = useToastStore((s) => s.addToast)
  const [state, setState] = useState<TutorialState>(tutorialApi.empty)
  const [ready, setReady] = useState(false)
  const [beatIndex, setBeatIndex] = useState(0)
  const [hidden, setHidden] = useState(false)
  const [follow, setFollow] = useState(false)
  const [startOpen, setStartOpen] = useState(false)
  const [doneOpen, setDoneOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [reopenTick, setReopenTick] = useState(0)
  const [forceKind, setForceKind] = useState<'restart' | null>(null)

  const beats = TUTORIAL_BEATS[state.step] ?? []
  const beat: TutorialBeat | null = beats[beatIndex] ?? null
  const path = stepPath(state)
  const onStepPage = Boolean(path) && pathname === path

  useEffect(() => {
    let cancelled = false
    tutorialApi
      .get()
      .then((next) => {
        if (cancelled) return
        setState(next)
        setReady(true)
      })
      .catch(() => {
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setBeatIndex(0)
  }, [state.step])

  useEffect(() => {
    if (!ready || state.status !== 'none' || !state.auto_open || pathname !== '/home') return
    if (sessionStorage.getItem(DISMISS_KEY) === '1') return
    setStartOpen(true)
  }, [ready, state.status, state.auto_open, pathname])

  useEffect(() => {
    if (!follow || state.status !== 'in_progress' || !path || pathname === path) return
    router.push(path)
  }, [follow, state.status, path, pathname, router])

  const fail = useCallback(
    (error: unknown, retry: 'restart' | null = null) => {
      const parsed = tutorialApi.readError(error)
      if (parsed.code === 'TUTORIAL_HAS_OTHER_STUDENTS' && retry) {
        setForceKind(retry)
        return
      }
      addToast({ variant: 'error', message: parsed.message })
    },
    [addToast],
  )

  const apply = useCallback((next: TutorialState) => {
    setState(next)
    setHidden(false)
    setFollow(true)
    if (next.status === 'completed') {
      setFollow(false)
      setDoneOpen(true)
    }
  }, [])

  const run = useCallback(
    async (work: () => Promise<TutorialState>, retry: 'restart' | null = null) => {
      if (busy) return
      setBusy(true)
      try {
        apply(await work())
      } catch (error) {
        fail(error, retry)
      } finally {
        setBusy(false)
      }
    },
    [apply, busy, fail],
  )

  useEffect(() => {
    setTutorialActionHandler((action, studentId) => {
      if (state.status !== 'in_progress' || hidden) return false
      if (!beat || beat.mode !== 'action' || beat.action !== action) return false
      if (action === 'lesson-attend' && studentId !== state.student_id) return false
      void run(() => tutorialApi.advance(action, studentId))
      return true
    })
    return () => setTutorialActionHandler(null)
  }, [beat, hidden, run, state.status, state.student_id])

  const closeTour = () => {
    setHidden(true)
    setFollow(false)
  }

  const value = useMemo<TutorialContextValue>(
    () => ({
      status: state.status,
      step: state.step,
      lessonId: state.lesson_id,
      studentId: state.student_id,
      seenScreens: state.seen_screens,
      hidden,
      cue: state.status === 'in_progress' && !hidden ? lessonCue(state.step) : null,
      reopenTick,
      ready,
      requestReopen: () => setReopenTick((tick) => tick + 1),
      markSeen: (screen: TutorialScreen) => {
        void tutorialApi
          .seen(screen)
          .then(setState)
          .catch((error) => fail(error))
      },
      start: () => void run(() => tutorialApi.start()),
      resume: () => void run(() => tutorialApi.resume()),
      restart: () => void run(() => tutorialApi.restart(), 'restart'),
    }),
    [fail, hidden, ready, reopenTick, run, state],
  )

  const showLayer = state.status === 'in_progress' && !hidden && onStepPage && Boolean(beat)
  const showChip = state.status === 'in_progress' && pathname !== '/home' && (!onStepPage || hidden)

  return (
    <TutorialContext.Provider value={value}>
      {children}
      {showLayer && beat ? (
        <TutorialLayer
          beat={beat}
          stepLabel={`${state.step}/6`}
          onNext={() => setBeatIndex((index) => index + 1)}
          onSkip={() =>
            void run(() => (state.step === 6 ? tutorialApi.complete() : tutorialApi.skip()))
          }
          onClose={closeTour}
          onReopen={() => setReopenTick((tick) => tick + 1)}
        />
      ) : null}
      {showChip ? (
        <button
          type="button"
          className={styles.chip}
          onClick={() => void run(() => tutorialApi.resume())}
        >
          체험 이어하기
        </button>
      ) : null}

      <Modal isOpen={startOpen} onClose={() => { setStartOpen(false); sessionStorage.setItem(DISMISS_KEY, '1') }} size="sm">
        <div className={styles.dialogBody}>
          <Text variant="headingMd" as="h2">수업 문자를 받아 봐요</Text>
          <Text variant="bodyLg" color="gray500">
            체험 수업으로 출결과 결과 문자를 보내요. 4분 정도 걸려요. 체험 학생은 끝나면 지워져요.
          </Text>
          <div className={styles.dialogActions}>
            <Button
              variant="ghost"
              size="lg"
              fullWidth
              onClick={() => {
                setStartOpen(false)
                sessionStorage.setItem(DISMISS_KEY, '1')
              }}
            >
              나중에 하기
            </Button>
            <Button variant="primary" size="lg" fullWidth disabled={busy} onClick={() => {
              setStartOpen(false)
              sessionStorage.setItem(DISMISS_KEY, '1')
              void run(() => tutorialApi.start())
            }}>
              시작하기
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={doneOpen} onClose={() => setDoneOpen(false)} size="sm">
        <div className={styles.dialogBody}>
          <Text variant="headingMd" as="h2">체험을 끝냈어요</Text>
          <Text variant="bodyLg" color="gray500">
            체험 학생은 지웠어요. 이제 진짜 학생을 등록해 주세요.
          </Text>
          <div className={styles.dialogActions}>
            <Button variant="ghost" size="lg" fullWidth onClick={() => { setDoneOpen(false); router.push('/home') }}>
              홈으로 가기
            </Button>
            <Button variant="primary" size="lg" fullWidth onClick={() => { setDoneOpen(false); router.push('/management?tab=students') }}>
              학생 등록하기
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={forceKind !== null} onClose={() => setForceKind(null)} size="sm">
        <div className={styles.dialogBody}>
          <Text variant="headingMd" as="h2">체험 수업에 다른 학생이 있어요</Text>
          <Text variant="bodyLg" color="gray500">지우고 처음부터 다시 할까요?</Text>
          <div className={styles.dialogActions}>
            <Button variant="ghost" size="lg" fullWidth onClick={() => setForceKind(null)}>취소</Button>
            <Button
              variant="danger"
              size="lg"
              fullWidth
              onClick={() => {
                setForceKind(null)
                void run(() => tutorialApi.restart(true))
              }}
            >
              지우고 다시
            </Button>
          </div>
        </div>
      </Modal>
    </TutorialContext.Provider>
  )
}

export function TutorialHomeCard() {
  const tour = useTutorial()
  if (!tour.ready) return null

  if (tour.status === 'completed') {
    return (
      <section className={styles.homeCard}>
        <div>
          <p className={styles.homeTitle}>체험을 끝냈어요</p>
          <p className={styles.homeBody}>다시 보려면 체험 학생을 새로 만들어요.</p>
        </div>
        <div className={styles.homeActions}>
          <Button variant="secondary" size="md" onClick={tour.restart}>
            체험 다시 해보기
          </Button>
        </div>
      </section>
    )
  }

  if (tour.status === 'in_progress') {
    return (
      <section className={styles.homeCard}>
        <div>
          <p className={styles.homeTitle}>체험이 진행 중이에요</p>
          <p className={styles.homeBody}>{tour.step}단계까지 와 있어요.</p>
        </div>
        <div className={styles.homeActions}>
          <Button variant="ghost" size="md" onClick={tour.restart}>
            처음부터
          </Button>
          <Button variant="primary" size="md" onClick={tour.resume}>
            이어하기
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.homeCard}>
      <div>
        <p className={styles.homeTitle}>수업 문자를 받아 봐요</p>
        <p className={styles.homeBody}>체험 수업으로 출결과 결과 문자까지 해 봐요.</p>
      </div>
      <div className={styles.homeActions}>
        <Button variant="primary" size="md" onClick={tour.start}>
          체험 시작
        </Button>
      </div>
    </section>
  )
}
