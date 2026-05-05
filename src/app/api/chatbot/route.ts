import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'

const KB_PATH = path.join(process.cwd(), 'docs', 'CLAT-챗봇-지식베이스.md')

let cachedKb: string | null = null

async function getKnowledgeBase(): Promise<string> {
  if (cachedKb) return cachedKb
  cachedKb = await readFile(KB_PATH, 'utf-8')
  return cachedKb
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[`*_>#|[\]()-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractAnswer(query: string, kb: string): string {
  const sections = kb.split(/\n(?=##\s)/g)
  const tokens = normalize(query)
    .split(' ')
    .filter((t) => t.length >= 2)

  if (tokens.length === 0) {
    return '질문을 조금 더 구체적으로 적어 주세요. 예: "출결 세션 다시 시작 가능?", "학부모 링크 만료 시 조치"'
  }

  const ranked = sections
    .map((section) => {
      const text = normalize(section)
      let score = 0
      for (const token of tokens) {
        if (text.includes(token)) score += 1
      }
      return { section, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  if (ranked.length === 0) {
    return [
      '지식베이스에서 정확히 매칭되는 항목을 찾지 못했습니다.',
      '아래 형태로 다시 질문해 주세요:',
      '- 메뉴 경로 + 문제 상황 (예: /lesson에서 저장 실패)',
      '- 에러 문구 + 언제 발생했는지',
      '- 대상 기능 (출결/알림톡/학부모 링크/학생 AI 등)',
    ].join('\n')
  }

  const body = ranked
    .map((item) => item.section.trim())
    .join('\n\n---\n\n')
    .slice(0, 2200)

  return [
    '지식베이스 기준으로 가장 관련 있는 안내입니다:\n',
    body,
    '\n\n필요하면 현재 화면 경로와 에러 문구를 함께 알려 주세요. 절차를 더 정확히 좁혀 드릴게요.',
  ].join('')
}

function topSections(query: string, kb: string): string {
  const sections = kb.split(/\n(?=##\s)/g)
  const tokens = normalize(query)
    .split(' ')
    .filter((t) => t.length >= 2)

  const ranked = sections
    .map((section) => {
      const text = normalize(section)
      let score = 0
      for (const token of tokens) {
        if (text.includes(token)) score += 1
      }
      return { section, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.section.trim())
    .join('\n\n---\n\n')

  return ranked.slice(0, 5000)
}

async function getLlmAnswer(question: string, context: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim()
  if (!apiKey) return null

  const model = process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini'
  const base = (process.env.OPENAI_BASE_URL?.trim() || 'https://api.openai.com/v1').replace(
    /\/$/,
    ''
  )

  const system = [
    '너는 CLAT 서비스 선생님 지원 챗봇이다.',
    '반드시 제공된 지식베이스 컨텍스트를 우선 근거로 답한다.',
    '모르면 추측하지 말고 추가 확인 정보를 요청한다.',
    '답변은 한국어 존댓말, 실무 단계형으로 짧고 명확하게 작성한다.',
    '개발 용어/API 경로를 먼저 말하지 말고 화면 기준으로 안내한다.',
    '영문 상태값(PRESENT/LATE/ABSENT)은 한국어(출석/지각/결석) 설명 뒤에 괄호로만 보조 표기한다.',
    '답변 포맷: 결론 1문장 + 단계 2~4개 + 문제 시 확인 포인트 1~2개.',
  ].join(' ')

  const user = [
    `질문:\n${question}`,
    '',
    '[지식베이스 컨텍스트]',
    context || '(관련 컨텍스트 없음)',
  ].join('\n')

  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })

  if (!res.ok) return null
  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = json.choices?.[0]?.message?.content?.trim()
  return content || null
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { question?: string }
    const question = body.question?.trim()

    if (!question) {
      return NextResponse.json(
        { success: false, message: 'question은 필수입니다.' },
        { status: 400 }
      )
    }

    const kb = await getKnowledgeBase()
    const context = topSections(question, kb)
    const llmAnswer = await getLlmAnswer(question, context)
    const answer = llmAnswer ?? extractAnswer(question, kb)

    return NextResponse.json({ success: true, data: { answer } })
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: '챗봇 응답 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      },
      { status: 500 }
    )
  }
}
