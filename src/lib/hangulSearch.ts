const CHOSEONG = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'
const JUNGSEONG = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'
const JONGSEONG_JAMO = [
  '',
  'ㄱ',
  'ㄲ',
  'ㄱㅅ',
  'ㄴ',
  'ㄴㅈ',
  'ㄴㅎ',
  'ㄷ',
  'ㄹ',
  'ㄹㄱ',
  'ㄹㅁ',
  'ㄹㅂ',
  'ㄹㅅ',
  'ㄹㅌ',
  'ㄹㅍ',
  'ㄹㅎ',
  'ㅁ',
  'ㅂ',
  'ㅂㅅ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
]

const HANGUL_BASE = 0xac00
const HANGUL_LAST = 0xd7a3

type Syllable = {
  cho: string
  jung: string
  jong: string
}

function decompose(char: string): Syllable | null {
  const code = char.charCodeAt(0)
  if (code < HANGUL_BASE || code > HANGUL_LAST) return null
  const offset = code - HANGUL_BASE
  const choIndex = Math.floor(offset / 588)
  const jungIndex = Math.floor((offset % 588) / 28)
  const jongIndex = offset % 28
  return {
    cho: CHOSEONG[choIndex] ?? '',
    jung: JUNGSEONG[jungIndex] ?? '',
    jong: JONGSEONG_JAMO[jongIndex] ?? '',
  }
}

function isChoseong(char: string) {
  return char.length === 1 && CHOSEONG.includes(char)
}

function charMatches(source: string, query: string) {
  if (source.toLowerCase() === query.toLowerCase()) return true
  const sourceSyllable = decompose(source)
  if (!sourceSyllable) return false
  if (isChoseong(query)) return sourceSyllable.cho === query
  const querySyllable = decompose(query)
  if (!querySyllable) return false
  if (sourceSyllable.cho !== querySyllable.cho || sourceSyllable.jung !== querySyllable.jung) {
    return false
  }
  return sourceSyllable.jong.startsWith(querySyllable.jong)
}

/** 이름 검색. 완성된 글자, 조합 중 글자(바→박), 초성(ㅂ, ㅂㅈㅇ)을 받는다. */
export function hangulIncludes(text: string, query: string) {
  const source = [...text]
  const needle = [...query]
  if (needle.length === 0) return true
  if (needle.length > source.length) return false
  const lastStart = source.length - needle.length
  for (let start = 0; start <= lastStart; start += 1) {
    let matched = true
    for (let index = 0; index < needle.length; index += 1) {
      if (!charMatches(source[start + index] ?? '', needle[index] ?? '')) {
        matched = false
        break
      }
    }
    if (matched) return true
  }
  return false
}
